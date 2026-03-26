const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    productId: String,
    name: String,
    price: Number,
    quantity: Number
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [OrderItemSchema],
    shippingAddress: Object,
    paymentMethod: String,
    total: Number,
    status: { type: String, default: 'created' },
    createdAt: { type: Date, default: Date.now },
    cancelledAt: Date
});

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);