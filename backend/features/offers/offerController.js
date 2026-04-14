const Offer = require('./Offer');

const createOffer = async(req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const payload = req.body || {};
        if (!payload.title || !payload.amount) return res.status(400).json({ message: 'Missing title or amount' });
        // normalize appliesTo/productIds for backward compatibility
        if (payload.appliesTo === 'product' && payload.productId) {
            payload.appliesTo = 'selected';
            payload.productIds = [payload.productId];
        }
        // normalize coupon code
        if (payload.code) payload.code = String(payload.code).toUpperCase();
        const offer = new Offer(payload);
        await offer.save();
        return res.status(200).json(offer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

const getOffers = async(req, res) => {
    try {
        const offers = await Offer.find({}).lean();
        return res.json(offers);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getOfferById = async(req, res) => {
    try {
        const { id } = req.params;
        const offer = await Offer.findById(id).lean();
        if (!offer) return res.status(404).json({ message: 'Offer not found' });
        return res.json(offer);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const updateOffer = async(req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const { id } = req.params;
        const payload = req.body || {};
        // normalize productId -> productIds if needed
        if (payload.appliesTo === 'product' && payload.productId) {
            payload.appliesTo = 'selected';
            payload.productIds = [payload.productId];
        }
        if (payload.code) payload.code = String(payload.code).toUpperCase();
        const updated = await Offer.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
        if (!updated) return res.status(404).json({ message: 'Offer not found' });
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// validate coupon code against cart payload
// body: { code: string, items: [{ productId, price, quantity }], total }
const validateOffer = async(req, res) => {
    try {
        const { code, items = [], total = 0 } = req.body || {};
        if (!code) return res.status(400).json({ valid: false, message: 'Missing coupon code' });
        const lookup = String(code).toUpperCase();
        const offer = await Offer.findOne({ code: lookup, status: 'active' }).lean();
        if (!offer) return res.status(404).json({ valid: false, message: 'Coupon not found or inactive' });

        const now = new Date();
        if (offer.startsAt && new Date(offer.startsAt) > now) return res.status(400).json({ valid: false, message: 'Coupon not active yet' });
        if (offer.endsAt && new Date(offer.endsAt) < now) return res.status(400).json({ valid: false, message: 'Coupon expired' });

        // determine applicable subtotal
        let applicableSubtotal = 0;
        if (offer.appliesTo === 'all') {
            applicableSubtotal = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
        } else if (Array.isArray(offer.productIds) && offer.productIds.length > 0) {
            const set = new Set(offer.productIds.map(String));
            applicableSubtotal = items.reduce((s, it) => set.has(String(it.productId)) ? s + (it.price || 0) * (it.quantity || 1) : s, 0);
        } else if (offer.productId) {
            applicableSubtotal = items.reduce((s, it) => String(it.productId) === String(offer.productId) ? s + (it.price || 0) * (it.quantity || 1) : s, 0);
        }

        if (applicableSubtotal <= 0) return res.status(400).json({ valid: false, message: 'Coupon does not apply to any items in the cart' });

        let discount = 0;
        if (offer.discountType === 'percentage') {
            discount = Math.round((offer.amount / 100) * applicableSubtotal);
        } else {
            discount = Math.min(offer.amount, applicableSubtotal);
        }

        const newTotal = Math.max(0, (total || 0) - discount);
        return res.json({ valid: true, discount, newTotal, offer });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ valid: false, message: 'Server error' });
    }
};

const deleteOffer = async(req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
        const { id } = req.params;
        const deleted = await Offer.findByIdAndDelete(id).lean();
        if (!deleted) return res.status(404).json({ message: 'Offer not found' });
        return res.json({ message: 'Deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { createOffer, getOffers, getOfferById, updateOffer, deleteOffer, validateOffer };