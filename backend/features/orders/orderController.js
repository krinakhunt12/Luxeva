const Order = require('./Order');

const getOrders = async(req, res) => {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const orders = await Order.find(filter).lean();
    return res.json(orders);
};

const getOrderById = async(req, res) => {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
};

const createOrder = async(req, res) => {
    const { userId, items, shippingAddress, paymentMethod, total } = req.body || {};
    if (!userId || !Array.isArray(items) || items.length === 0 || !shippingAddress) return res.status(400).json({ message: 'Missing required fields' });
    const order = new Order({ userId, items, shippingAddress, paymentMethod: paymentMethod || 'unknown', total: total || 0, status: 'created' });
    await order.save();
    return res.status(201).json(order);
};

const cancelOrder = async(req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status === 'cancelled') return res.status(400).json({ message: 'Order already cancelled' });
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();
    return res.json(order);
};

module.exports = { getOrders, getOrderById, createOrder, cancelOrder };