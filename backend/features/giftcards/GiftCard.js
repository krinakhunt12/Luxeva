const mongoose = require('mongoose');

const GiftCardSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    initialAmount: { type: Number, required: true },
    balance: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdBy: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.GiftCard || mongoose.model('GiftCard', GiftCardSchema);