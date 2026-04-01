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
    // Store image references as short hashes (strings) that point to Image docs
    // Legacy entries may still be data URLs or file paths and are handled on read
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