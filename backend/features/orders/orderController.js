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

        const { items, shippingAddress, paymentMethod, total, saveAddress, appliedOffer, appliedGiftCard } = req.body || {};
        if (!Array.isArray(items) || items.length === 0 || !shippingAddress) return res.status(400).json({ message: 'Missing required fields' });

        const order = new Order({ userId: authUserId, items, shippingAddress, paymentMethod: paymentMethod || 'unknown', total: total || 0, appliedOffer: appliedOffer || null, appliedGiftCard: appliedGiftCard || null, status: 'created' });
        await order.save();

        // award loyalty points: 1 point per ₹100 spent
        try {
            const earn = Math.floor((Number(total || 0)) / 100);
            if (earn > 0) {
                const u = await User.findById(authUserId);
                if (u) {
                    u.points = (u.points || 0) + earn;
                    await u.save();
                }
            }
        } catch (e) {
            console.warn('points award failed', e.message || e);
        }

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

// buy-now: create order using user's default address and single product payload
const buyNow = async(req, res) => {
    try {
        const authUserId = req.user && (req.user.id || req.user._id);
        if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });

        const { productId, quantity = 1, selectedColor, selectedSize } = req.body || {};
        if (!productId) return res.status(400).json({ message: 'productId required' });

        const Product = require('../products/Product');
        const prod = await Product.findById(productId).lean();
        if (!prod) return res.status(404).json({ message: 'Product not found' });

        const User = require('../user/User');
        const user = await User.findById(authUserId).lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        const shippingAddress = (user.addresses && user.addresses[0]) || null;
        if (!shippingAddress) return res.status(400).json({ message: 'No shipping address on file' });

        const itemPrice = prod.price || 0;
        const items = [{ productId: prod._id, name: prod.name, price: itemPrice, quantity: Number(quantity || 1) }];
        const total = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);

        const order = new Order({ userId: authUserId, items, shippingAddress, paymentMethod: 'one-click', total, status: 'created' });
        await order.save();

        // award loyalty points for buy-now
        try {
            const earn = Math.floor((Number(total || 0)) / 100);
            if (earn > 0) {
                const u = await User.findById(authUserId);
                if (u) {
                    u.points = (u.points || 0) + earn;
                    await u.save();
                }
            }
        } catch (e) {
            console.warn('points award failed', e.message || e);
        }

        return res.status(200).json({ ok: true, order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Buy now failed' });
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

// update order status (e.g., processing, shipped, delivered, cancelled)
const updateOrderStatus = async(req, res) => {
    try {
        const { status } = req.body || {};
        if (!status) return res.status(400).json({ message: 'Missing status' });
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.status = status;
        if (status === 'cancelled') order.cancelledAt = new Date();
        if (status === 'delivered') order.deliveredAt = new Date();
        await order.save();
        return res.json(order);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getOrders, getOrderById, createOrder, cancelOrder, updateOrderStatus, buyNow };