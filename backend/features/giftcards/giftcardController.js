const crypto = require('crypto');
const GiftCard = require('./GiftCard');

const createGiftCard = async(req, res) => {
    try {
        const { initialAmount, code, expiresAt } = req.body || {};
        if (!initialAmount) return res.status(400).json({ message: 'initialAmount required' });
        const giftCode = code || crypto.randomBytes(4).toString('hex').toUpperCase();
        const createdBy = req.user && (req.user.id || req.user._id) ? (req.user.id || req.user._id) : undefined;
        const g = new GiftCard({ code: String(giftCode).toUpperCase(), initialAmount, balance: initialAmount, expiresAt, createdBy });
        await g.save();
        return res.json({ ok: true, gift: g });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not create gift card' });
    }
};

const getByCode = async(req, res) => {
    try {
        const { code } = req.params;
        const g = await GiftCard.findOne({ code }).lean();
        if (!g) return res.status(404).json({ message: 'Not found' });
        return res.json({ ok: true, gift: g });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error' });
    }
};

const redeem = async(req, res) => {
    try {
        const { code, amount } = req.body || {};
        if (!code || !amount) return res.status(400).json({ message: 'code and amount required' });
        const g = await GiftCard.findOne({ code });
        if (!g || !g.active) return res.status(404).json({ message: 'Invalid gift card' });
        if (g.expiresAt && new Date(g.expiresAt) < new Date()) return res.status(400).json({ message: 'Expired' });
        const deduct = Math.min(Number(amount), g.balance);
        g.balance = g.balance - deduct;
        await g.save();
        return res.json({ ok: true, deducted: deduct, remaining: g.balance });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not redeem' });
    }
};

// purchase endpoint: create a gift card for the authenticated buyer
const purchaseGiftCard = async(req, res) => {
    try {
        const authUserId = req.user && (req.user.id || req.user._id);
        if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });
        const { amount, code, expiresAt } = req.body || {};
        if (!amount || Number(amount) <= 0) return res.status(400).json({ message: 'amount required' });
        const giftCode = code ? String(code).toUpperCase() : crypto.randomBytes(4).toString('hex').toUpperCase();
        const g = new GiftCard({ code: giftCode, initialAmount: Number(amount), balance: Number(amount), expiresAt, createdBy: authUserId });
        await g.save();
        // In a real app, you'd create an order/payment record here. We just return the code.
        return res.json({ ok: true, gift: { code: g.code, amount: g.initialAmount } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not purchase gift card' });
    }
};

module.exports = { createGiftCard, getByCode, redeem, purchaseGiftCard };