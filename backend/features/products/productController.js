const Product = require('./Product');

const getProducts = async(req, res) => {
    try {
        const { search } = req.query;
        const q = {};
        if (search) q.$or = [{ name: new RegExp(search, 'i') }, { slug: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
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

module.exports = { getProducts, getProductById, getProductBySlug, createProduct, updateProduct, deleteProduct };