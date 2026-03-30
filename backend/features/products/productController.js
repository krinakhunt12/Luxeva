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