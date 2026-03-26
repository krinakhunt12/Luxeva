const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
    colors: [{ name: String, hex: String }],
    sizes: [String]
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: Number,
    originalPrice: Number,
    category: String,
    subCategory: String,
    images: [String],
    description: String,
    variants: VariantSchema,
    isSale: Boolean,
    isNew: Boolean,
    inStock: Boolean,
    stock: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);