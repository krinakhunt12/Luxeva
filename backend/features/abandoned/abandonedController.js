const AbandonedCart = require('./AbandonedCart');
const nodemailer = require('nodemailer');

function createTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: !!process.env.SMTP_SECURE,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
    }
    return { sendMail: async(opts) => { return Promise.resolve(); } };
}

const transporter = createTransporter();

const listCarts = async(req, res) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        const q = {};
        if (status === 'pending') q.recovered = false, q.notifiedAt = { $exists: false };
        if (status === 'notified') q.recovered = false, q.notifiedAt = { $exists: true };
        if (status === 'recovered') q.recovered = true;
        const p = Math.max(1, Number(page));
        const lim = Math.min(200, Number(limit));
        const items = await AbandonedCart.find(q).skip((p - 1) * lim).limit(lim).sort({ lastUpdated: -1 }).lean();
        const total = await AbandonedCart.countDocuments(q);
        return res.json({ items, total, page: p, pages: Math.max(1, Math.ceil(total / lim)) });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not list abandoned carts' });
    }
};

const sendNow = async(req, res) => {
    try {
        const id = req.params.id;
        const cart = await AbandonedCart.findById(id).lean();
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        if (!cart.email) return res.status(400).json({ message: 'No email for this cart' });

        const url = `${process.env.APP_URL || 'http://localhost:3000'}/wishlists/${cart.token}`;
        const html = `<p>We saved your cart. Complete your purchase: <a href="${url}">Resume Purchase</a></p>`;
        await transporter.sendMail({ from: process.env.EMAIL_FROM || 'noreply@luxeva.test', to: cart.email, subject: 'You left items in your bag', html });
        await AbandonedCart.updateOne({ _id: cart._id }, { notifiedAt: new Date() });
        return res.json({ ok: true });
    } catch (err) {
        console.error('sendNow error', err);
        return res.status(500).json({ message: 'Send failed' });
    }
};

const previewTemplate = async(req, res) => {
    try {
        const id = req.query.id;
        const cart = id ? await AbandonedCart.findById(id).lean() : null;
        const token = cart ? cart.token : 'demo-token';
        const url = `${process.env.APP_URL || 'http://localhost:3000'}/wishlists/${token}`;
        const html = `<p>We saved your cart. Complete your purchase: <a href="${url}">Resume Purchase</a></p>`;
        return res.json({ html });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Preview failed' });
    }
};

const crypto = require('crypto');

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


module.exports = { upsertCart, listCarts, sendNow, previewTemplate };