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
    // Store only valid base64 data URLs directly
    images: {
        type: [String],
        validate: {
            validator: function(v) {
                return v.every(img => typeof img === 'string' && img.startsWith('data:image/'));
            },
            message: props => `${props.value} contains invalid image format. Only base64 data URLs are allowed.`
        }
    },
    description: String,
    variants: VariantSchema,
    tags: [String],
    colors: [String],
    sizes: [String],
    isSale: Boolean,
    isNew: Boolean,
    inStock: Boolean,
    stock: Number,
    createdAt: { type: Date, default: Date.now }
});

// text index for search
ProductSchema.index({ name: 'text', description: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);