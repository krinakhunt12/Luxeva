const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // appliesTo: 'all' or 'selected' (selected uses productIds)
    appliesTo: { type: String, enum: ['all', 'selected'], default: 'all' },
    // backward-compatible single product id
    productId: { type: String },
    // support multiple product ids for selection
    productIds: { type: [String], default: [] },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    amount: { type: Number, required: true },
    // optional coupon code (uppercase)
    code: { type: String, index: true },
    // optional bank or payment constraints (e.g., HDFC, ICICI) and allowed payment methods
    bank: { type: String },
    paymentMethods: { type: [String], default: [] }, // e.g., ['card', 'netbanking', 'upi']
    // banner image url or data URL
    bannerImage: { type: String },
    // status: active/inactive for admin control
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    startsAt: Date,
    endsAt: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);