const crypto = require('crypto');
const AbandonedCart = require('./AbandonedCart');

const upsertCart = async(req, res) => {
    try {
        const { userId, email, cart } = req.body || {};
        if (!cart || !Array.isArray(cart)) return res.status(400).json({ message: 'Cart required' });
        const token = crypto.randomBytes(6).toString('hex');
        // upsert by userId or email
        const query = userId ? { userId } : { email };
        const update = { userId, email, cart, lastUpdated: new Date(), token };
        const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
        const doc = await AbandonedCart.findOneAndUpdate(query, update, opts);
        return res.json({ ok: true, token: doc.token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not save cart' });
    }
};

const listCarts = async(req, res) => {
    try {
        const carts = await AbandonedCart.find({ recovered: false }).sort({ lastUpdated: -1 }).limit(200).lean();
        return res.json({ ok: true, carts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not list carts' });
    }
};

module.exports = { upsertCart, listCarts };