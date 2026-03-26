const Order = require('../models/Order');

const getOrders = async(request, reply) => {
    const { userId } = request.query;
    const filter = userId ? { userId } : {};
    const orders = await Order.find(filter).lean();
    return reply.send(orders);
};

const getOrderById = async(request, reply) => {
    const order = await Order.findById(request.params.id).lean();
    if (!order) return reply.status(404).send({ message: 'Order not found' });
    return reply.send(order);
};

const createOrder = async(request, reply) => {
    const { userId, items, shippingAddress, paymentMethod, total } = request.body || {};
    if (!userId || !Array.isArray(items) || items.length === 0 || !shippingAddress) return reply.status(400).send({ message: 'Missing required fields' });
    const order = new Order({ userId, items, shippingAddress, paymentMethod: paymentMethod || 'unknown', total: total || 0, status: 'created' });
    await order.save();
    return reply.status(201).send(order);
};

const cancelOrder = async(request, reply) => {
    const order = await Order.findById(request.params.id);
    if (!order) return reply.status(404).send({ message: 'Order not found' });
    if (order.status === 'cancelled') return reply.status(400).send({ message: 'Order already cancelled' });
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();
    return reply.send(order);
};

module.exports = { getOrders, getOrderById, createOrder, cancelOrder };