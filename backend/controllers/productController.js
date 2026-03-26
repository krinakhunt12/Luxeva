const Product = require('../models/Product');

const getProducts = async(request, reply) => {
    const { search } = request.query;
    const q = {};
    if (search) q.$or = [{ name: new RegExp(search, 'i') }, { slug: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
    const products = await Product.find(q).lean();
    return reply.send(products);
};

const getProductById = async(request, reply) => {
    const product = await Product.findById(request.params.id).lean();
    if (!product) return reply.status(404).send({ message: 'Product not found' });
    return reply.send(product);
};

const createProduct = async(request, reply) => {
    const payload = request.body || {};
    if (!payload.name || !payload.slug) return reply.status(400).send({ message: 'Missing required fields: name or slug' });
    const product = new Product(payload);
    await product.save();
    return reply.status(201).send(product);
};

const updateProduct = async(request, reply) => {
    const payload = request.body || {};
    const product = await Product.findByIdAndUpdate(request.params.id, payload, { new: true });
    if (!product) return reply.status(404).send({ message: 'Product not found' });
    return reply.send(product);
};

const deleteProduct = async(request, reply) => {
    const res = await Product.findByIdAndDelete(request.params.id);
    if (!res) return reply.status(404).send({ message: 'Product not found' });
    return reply.status(204).send();
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };