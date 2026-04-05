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
                Product.countDocuments(q)
            ]);
            const pages = Math.max(1, Math.ceil(total / limitNum));
            return res.json({ products: items, total, page: pageNum, pages });
        }

        // Default: return all products (backwards compatible)
        const products = await Product.find(q).lean();
        return res.json(products);
    } catch (err) {
        return res.status(500).json({ message: err.message });
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
                    subCategories: { $addToSet: '$subCategory' }
                }
            },
            { $project: { _id: 0, colors: 1, sizes: 1, subCategories: 1 } }
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

        // If files are uploaded via multer, they will be in req.files
        if (req.files && Array.isArray(req.files) && req.files.length) {
            const uploadedUrls = [];
            for (const file of req.files) {
                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                uploadedUrls.push(dataUrl);
            }
            payload.images = (payload.images || []).concat(uploadedUrls);
        }

        // If a single `image` is provided in JSON, convert to `images` array
        if (payload.image && !payload.images) payload.images = [payload.image];

        if (!payload.name) return res.status(400).json({ message: 'Missing required field: name' });

        const slugify = (str) => {
            return String(str).toLowerCase().trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
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

module.exports = { getProducts, getProductById, getProductBySlug, getFilters, createProduct, updateProduct, deleteProduct };