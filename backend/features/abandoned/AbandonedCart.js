const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: String,
    name: String,
    slug: String,
    price: Number,
    quantity: Number,
    selectedColor: String,
    selectedSize: String
}, { _id: false });

const AbandonedCartSchema = new mongoose.Schema({
    userId: { type: String },
    email: { type: String },
    token: { type: String },
    cart: [CartItemSchema],
    lastUpdated: { type: Date, default: Date.now },
    notifiedAt: { type: Date },
    recovered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', AbandonedCartSchema);