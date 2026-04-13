const Product = require('./Product');
const path = require('path');
const fs = require('fs');

const getProducts = async(req, res) => {
    const { search } = req.query;
    const q = {};
    if (search) q.$or = [{ name: new RegExp(search, 'i') }, { slug: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
    const products = await Product.find(q).lean();
    return res.json(products);
};

const searchProducts = async(req, res) => {
    try {
        const { q, category, size, color, minPrice, maxPrice, page = 1, limit = 24 } = req.query;
        const pageNum = Math.max(1, Number(page));
        const per = Math.min(100, Number(limit) || 24);

        const match = {};
        if (q) {
            // use text score if available
            match.$text = { $search: q };
        }
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
                    counts: [
                        { $group: { _id: null, total: { $sum: 1 } } }
                    ],
                    facets: [
                        { $group: { _id: null, sizes: { $addToSet: '$sizes' }, colors: { $addToSet: '$colors' }, categories: { $addToSet: '$category' } } }
                    ]
                }
            }
        ];

        const out = await Product.aggregate(agg);
        const results = (out[0] && out[0].results) || [];
        const total = (out[0] && out[0].counts && out[0].counts[0] && out[0].counts[0].total) || 0;
        const facetRaw = (out[0] && out[0].facets && out[0].facets[0]) || {};

        // normalize facet arrays (flatten)
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
        const regex = new RegExp('^' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const items = await Product.find({ name: regex }).limit(8).select('name slug').lean();
        return res.json(items.map(i => ({ name: i.name, slug: i.slug })));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Suggest failed' });
    }
};

const visualSearch = async(req, res) => {
    try {
        // simple stub: accept `imageUrl` in body and return top products from same category if provided
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
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
};

const createProduct = async(req, res) => {
    const payload = req.body || {};

    // If files are uploaded via multer, they will be in req.files as an array.
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const uploaded = [];
        for (const file of req.files) {
            // multer saved file.filename
            uploaded.push(`/uploads/${file.filename}`);
        }
        payload.images = (payload.images || []).concat(uploaded);
    }

    if (!payload.name) return res.status(400).json({ message: 'Missing required field: name' });

    // If a single `image` is provided in JSON, convert to `images` array expected by the model
    if (payload.image && !payload.images) payload.images = [payload.image];

    // Simple slugify helper
    const slugify = (str) => {
        return String(str).toLowerCase().trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    // Ensure slug exists; generate from name if missing
    let baseSlug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
    let slug = baseSlug;
    let i = 1;
    // Ensure uniqueness by appending a suffix if needed
    while (await Product.findOne({ slug })) {
        slug = `${baseSlug}-${i++}`;
    }
    payload.slug = slug;

    const product = new Product(payload);
    await product.save();
    return res.status(200).json(product);
};

const updateProduct = async(req, res) => {
    const payload = req.body || {};
    // If files uploaded via multer, they will be in req.files as an array.
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const uploaded = [];
        for (const file of req.files) {
            uploaded.push(`/uploads/${file.filename}`);
        }
        payload.images = (payload.images || []).concat(uploaded);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
};

const deleteProduct = async(req, res) => {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ ok: true });
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
module.exports.searchProducts = searchProducts;
module.exports.suggest = suggest;
module.exports.visualSearch = visualSearch;