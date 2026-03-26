const Product = require('./Product');

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
    if (!payload.name || !payload.slug) return res.status(400).json({ message: 'Missing required fields: name or slug' });
    const product = new Product(payload);
    await product.save();
    return res.status(201).json(product);
};

const updateProduct = async(req, res) => {
    const payload = req.body || {};
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
};

const deleteProduct = async(req, res) => {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Product not found' });
    return res.status(204).end();
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };