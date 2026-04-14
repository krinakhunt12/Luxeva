const Product = require('./Product');

const getProducts = async(req, res) => {
    try {
        const { search, page, limit, category } = req.query;
        const q = {};
        if (search) q.$or = [{ name: new RegExp(search, 'i') }, { slug: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
        if (category) q.category = new RegExp(`^${String(category)}`, 'i');

        // If page and limit are provided, return paginated response
        const pageNum = page ? parseInt(page, 10) : null;
        const limitNum = limit ? parseInt(limit, 10) : null;

        if (pageNum && limitNum) {
            const skip = (pageNum - 1) * limitNum;
            const [items, total] = await Promise.all([
                Product.find(q).skip(skip).limit(limitNum).lean(),
                Product.countDocuments(q),
            ]);
            const pages = Math.max(1, Math.ceil(total / limitNum));
            return res.json({ products: items, total, page: pageNum, pages });
        }

        // Default: return all products (backwards compatible)
        let products = await Product.find(q).lean();

        // Attach active offers (simple application logic)
        try {
            const Offer = require('../offers/Offer');
            const now = new Date();
            const offers = await Offer.find({ active: true }).lean();

            const activeOffers = offers.filter((o) => {
                if (o.status && o.status !== 'active') return false;
                if (o.startsAt && new Date(o.startsAt) > now) return false;
                if (o.endsAt && new Date(o.endsAt) < now) return false;
                return true;
            });

            products = products.map((p) => {
                const applicable = activeOffers.filter((o) => {
                    if (o.appliesTo === 'all') return true;
                    if (o.productId && String(o.productId) === String(p._id)) return true;
                    if (Array.isArray(o.productIds) && o.productIds.find((id) => String(id) === String(p._id))) return true;
                    return false;
                });
                if (!applicable || applicable.length === 0) return p;

                let best = null;
                let bestSaving = 0;
                for (const o of applicable) {
                    const amt = Number(o.amount || 0);
                    let saving = 0;
                    if (o.discountType === 'fixed') saving = amt;
                    else saving = (p.price || 0) * (amt / 100);
                    if (saving > bestSaving) {
                        bestSaving = saving;
                        best = o;
                    }
                }

                if (!best) return p;
                const copy = {...p };
                copy.originalPrice = copy.price;
                if (best.discountType === 'fixed') {
                    copy.price = Math.max(0, copy.price - Number(best.amount || 0));
                } else {
                    copy.price = Math.max(0, Math.round(copy.price * (1 - Number(best.amount || 0) / 100)));
                }
                copy.appliedOffer = { id: best._id, title: best.title, discountType: best.discountType, amount: best.amount, bannerImage: best.bannerImage };
                return copy;
            });
        } catch (e) {
            console.warn('offers not applied:', e.message || e);
        }

        return res.json(products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const searchProducts = async(req, res) => {
    try {
        const { q, category, size, color, minPrice, maxPrice, page = 1, limit = 24 } = req.query;
        const pageNum = Math.max(1, Number(page));
        const per = Math.min(100, Number(limit) || 24);

        const match = {};
        if (q) match.$text = { $search: q };
        if (category) match.category = category;
        if (size) match.sizes = size;
        if (color) match.colors = color;
        if (minPrice || maxPrice) match.price = {};
        if (minPrice) match.price.$gte = Number(minPrice);
        if (maxPrice) match.price.$lte = Number(maxPrice);

        const agg = [
            { $match: match },
            {
                $facet: {
                    results: [{ $skip: (pageNum - 1) * per }, { $limit: per }],
                    counts: [{ $group: { _id: null, total: { $sum: 1 } } }],
                    facets: [{ $group: { _id: null, sizes: { $addToSet: '$sizes' }, colors: { $addToSet: '$colors' }, categories: { $addToSet: '$category' } } }],
                },
            },
        ];

        const out = await Product.aggregate(agg);
        const results = (out[0] && out[0].results) || [];
        const total = (out[0] && out[0].counts && out[0].counts[0] && out[0].counts[0].total) || 0;
        const facetRaw = (out[0] && out[0].facets && out[0].facets[0]) || {};

        const sizes = Array.isArray(facetRaw.sizes) ? [].concat(...facetRaw.sizes).filter(Boolean) : [];
        const colors = Array.isArray(facetRaw.colors) ? [].concat(...facetRaw.colors).filter(Boolean) : [];
        const categories = Array.isArray(facetRaw.categories) ? [].concat(...facetRaw.categories).filter(Boolean) : [];

        return res.json({ results, total, page: pageNum, per, facets: { sizes, colors, categories } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Search failed' });
    }
};

const suggest = async(req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);
        const limit = 8;
        const safe = String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // 1) prefix matches on name
        const prefix = new RegExp('^' + safe, 'i');
        let items = await Product.find({ name: prefix }).limit(limit).select('name slug').lean();
        if (items && items.length >= limit) return res.json(items.map((i) => ({ name: i.name, slug: i.slug })));

        // 2) contains match on name, description or tags
        const contains = new RegExp(safe, 'i');
        const others = await Product.find({ $or: [{ name: contains }, { description: contains }, { tags: contains }] }).limit(limit * 2).select('name slug').lean();
        const merged = (items || []).concat(others.filter(o => !(items || []).find(i => String(i._id) === String(o._id))));
        if (merged.length >= limit) return res.json(merged.slice(0, limit).map((i) => ({ name: i.name, slug: i.slug })));

        // 3) fuzzy-ish match: allow characters in between (approximate subsequence match)
        if ((q || '').length >= 3) {
            const fuzzyPattern = safe.split('').map(ch => ch).join('.*');
            const fuzzy = new RegExp(fuzzyPattern, 'i');
            const fuzzyItems = await Product.find({ $or: [{ name: fuzzy }, { description: fuzzy }, { tags: fuzzy }] }).limit(limit * 2).select('name slug').lean();
            for (const fi of fuzzyItems) {
                if (!merged.find(m => String(m._id) === String(fi._id))) merged.push(fi);
                if (merged.length >= limit) break;
            }
        }

        // 4) last-resort: recent/popular products (fallback)
        if (merged.length < limit) {
            const more = await Product.find({}).sort({ createdAt: -1 }).limit(limit).select('name slug').lean();
            for (const m of more) {
                if (!merged.find(x => String(x._id) === String(m._id))) merged.push(m);
                if (merged.length >= limit) break;
            }
        }

        return res.json(merged.slice(0, limit).map((i) => ({ name: i.name, slug: i.slug })));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Suggest failed' });
    }
};

const visualSearch = async(req, res) => {
    try {
        const { imageUrl, category } = req.body || {};
        if (!imageUrl) return res.status(400).json({ message: 'imageUrl required' });
        let products = [];
        if (category) products = await Product.find({ category }).limit(12).lean();
        else products = await Product.find({}).limit(12).lean();
        return res.json({ ok: true, note: 'This is a visual search stub — integrate an image-embedding service for real results', products });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Visual search failed' });
    }
};

const getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.json(product);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getProductBySlug = async(req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug }).lean();
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.json(product);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getFilters = async(req, res) => {
    try {
        const { category } = req.query;
        const match = {};
        if (category) match.category = new RegExp(`^${String(category)}`, 'i');

        const pipeline = [
            { $match: match },
            { $project: { variants: 1, subCategory: 1 } },
            { $unwind: { path: '$variants.colors', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$variants.sizes', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: null,
                    colors: { $addToSet: { name: '$variants.colors.name', hex: '$variants.colors.hex' } },
                    sizes: { $addToSet: '$variants.sizes' },
                    subCategories: { $addToSet: '$subCategory' },
                },
            },
            { $project: { _id: 0, colors: 1, sizes: 1, subCategories: 1 } },
        ];

        const [result] = await Product.aggregate(pipeline);
        return res.json(result || { colors: [], sizes: [], subCategories: [] });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const createProduct = async(req, res) => {
    try {
        const payload = req.body || {};

        if (req.files && Array.isArray(req.files) && req.files.length) {
            const uploadedUrls = [];
            for (const file of req.files) {
                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                uploadedUrls.push(dataUrl);
            }
            payload.images = (payload.images || []).concat(uploadedUrls);
        }

        if (payload.image && !payload.images) payload.images = [payload.image];

        if (!payload.name) return res.status(400).json({ message: 'Missing required field: name' });

        const slugify = (str) => {
            return String(str).toLowerCase().trim().replace(/[^a-z0-9\\s-]/g, '').replace(/\\s+/g, '-').replace(/-+/g, '-');
        };

        let baseSlug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
        let slug = baseSlug;
        let i = 1;
        while (await Product.findOne({ slug })) {
            slug = `${baseSlug}-${i++}`;
        }
        payload.slug = slug;

        const product = new Product(payload);
        await product.save();
        return res.status(200).json(product);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const updateProduct = async(req, res) => {
    try {
        const payload = req.body || {};
        if (req.files && Array.isArray(req.files) && req.files.length) {
            const uploadedUrls = [];
            for (const file of req.files) {
                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                uploadedUrls.push(dataUrl);
            }
            payload.images = (payload.images || []).concat(uploadedUrls);
        }
        if (payload.image && !payload.images) payload.images = [payload.image];

        const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.json(product);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const deleteProduct = async(req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Product not found' });
        return res.status(200).json({ ok: true });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getProducts,
    searchProducts,
    suggest,
    visualSearch,
    getProductById,
    getProductBySlug,
    getFilters,
    createProduct,
    updateProduct,
    deleteProduct,
};

// Recommendations: try category -> tags -> co-purchase fallback
const Order = require('../orders/Order');

const getRecommendations = async(req, res) => {
    try {
        const id = req.params.id;
        const limit = Math.min(24, Number(req.query.limit) || 8);
        const prod = await Product.findById(id).lean();
        if (!prod) return res.status(404).json({ message: 'Product not found' });

        // 1) same category (exclude current)
        let candidates = await Product.find({ category: prod.category, _id: { $ne: prod._id } }).limit(limit).lean();
        if (candidates.length >= limit) return res.json(candidates.slice(0, limit));

        // 2) by tags/variants
        const tags = (prod.tags || []).slice(0, 5);
        if (tags.length) {
            const byTags = await Product.find({ _id: { $ne: prod._id }, tags: { $in: tags } }).limit(limit).lean();
            candidates = candidates.concat(byTags.filter(p => !candidates.find(c => String(c._id) === String(p._id))));
            if (candidates.length >= limit) return res.json(candidates.slice(0, limit));
        }

        // 3) co-purchase: find orders that contain this product and tally other products
        const orders = await Order.find({ 'items.productId': String(prod._id) }).limit(500).lean();
        const counter = new Map();
        for (const o of orders) {
            for (const it of o.items || []) {
                const pid = String(it.productId);
                if (pid === String(prod._id)) continue;
                counter.set(pid, (counter.get(pid) || 0) + (it.quantity || 1));
            }
        }
        const sorted = Array.from(counter.entries()).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([pid]) => pid);
        if (sorted.length) {
            const coProds = await Product.find({ _id: { $in: sorted } }).lean();
            // keep original sort order
            const ordered = sorted.map(sid => coProds.find(p => String(p._id) === String(sid))).filter(Boolean);
            candidates = candidates.concat(ordered.filter(p => !candidates.find(c => String(c._id) === String(p._id))));
        }

        // 4) last-resort: most recent products
        if (candidates.length < limit) {
            const more = await Product.find({ _id: { $ne: prod._id, $nin: candidates.map(c => c._id) } }).sort({ createdAt: -1 }).limit(limit - candidates.length).lean();
            candidates = candidates.concat(more);
        }

        return res.json(candidates.slice(0, limit));
    } catch (err) {
        console.error('recommendations error', err);
        return res.status(500).json({ message: 'Recommendations failed' });
    }
};

module.exports.getRecommendations = getRecommendations;