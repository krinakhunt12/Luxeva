const crypto = require('crypto');
const GiftCard = require('./GiftCard');

const createGiftCard = async(req, res) => {
    try {
        const { initialAmount, code, expiresAt } = req.body || {};
        if (!initialAmount) return res.status(400).json({ message: 'initialAmount required' });
        const giftCode = code || crypto.randomBytes(4).toString('hex').toUpperCase();
        const g = new GiftCard({ code: giftCode, initialAmount, balance: initialAmount, expiresAt, createdBy: req.user ? .id });
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

module.exports = { createGiftCard, getByCode, redeem };