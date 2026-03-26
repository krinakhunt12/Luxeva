const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    addresses: [AddressSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);