const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    name: { type: String },
    products: [{ type: String }],
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);