const Order = require('./Order');
const User = require('../user/User');

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

// create order: uses authenticated user (req.user.id). Optionally save shippingAddress to user's addresses when `saveAddress=true`.
const createOrder = async(req, res) => {
    try {
        const authUserId = req.user && req.user.id;
        if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });

        const { items, shippingAddress, paymentMethod, total, saveAddress } = req.body || {};
        if (!Array.isArray(items) || items.length === 0 || !shippingAddress) return res.status(400).json({ message: 'Missing required fields' });

        const order = new Order({ userId: authUserId, items, shippingAddress, paymentMethod: paymentMethod || 'unknown', total: total || 0, status: 'created' });
        await order.save();

        // optionally save shipping address to user's saved addresses
        if (saveAddress) {
            const user = await User.findById(authUserId);
            if (user) {
                user.addresses = user.addresses || [];
                user.addresses.push({...shippingAddress, createdAt: new Date() });
                await user.save();
            }
        }

        return res.status(200).json(order);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
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