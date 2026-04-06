const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    appliesTo: { type: String, enum: ['product', 'all'], default: 'all' },
    productId: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    amount: { type: Number, required: true },
    active: { type: Boolean, default: true },
    startsAt: Date,
    endsAt: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);