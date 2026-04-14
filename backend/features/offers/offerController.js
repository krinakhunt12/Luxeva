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
const User = require('../user/User');

const validateOffer = async(req, res) => {
    try {
        const { code, items = [], total = 0, userId, email, paymentMethod, paymentBank } = req.body || {};
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
        // If offer has bank/payment constraints, ensure request provides matching payment info
        if (offer.bank || (Array.isArray(offer.paymentMethods) && offer.paymentMethods.length > 0)) {
            // Require either paymentMethod or paymentBank in request
            const pm = paymentMethod || '';
            const pb = paymentBank || '';
            if (offer.bank && pb) {
                if (String(pb).toLowerCase() !== String(offer.bank).toLowerCase()) {
                    return res.status(400).json({ valid: false, message: 'Coupon only valid for selected bank/payment method' });
                }
            } else if (offer.bank && !pb) {
                return res.status(400).json({ valid: false, message: 'Coupon requires bank/payment information' });
            }
            if (Array.isArray(offer.paymentMethods) && offer.paymentMethods.length > 0) {
                if (!pm || !offer.paymentMethods.map(x => String(x).toLowerCase()).includes(String(pm).toLowerCase())) {
                    return res.status(400).json({ valid: false, message: 'Coupon requires specific payment method' });
                }
            }
        }

        let discount = 0;
        if (offer.discountType === 'percentage') {
            discount = Math.round((offer.amount / 100) * applicableSubtotal);
        } else {
            discount = Math.min(offer.amount, applicableSubtotal);
        }

        // If a user is provided (or from authenticated request), check if they are a "new user".
        // New user definition: account created within last 30 days. For new users, cap discount to $10.
        try {
            const possibleUserId = req.user.id || req.user._id || userId;
            const possibleEmail = email || req.user.email;
            let foundUser = null;
            if (possibleUserId) foundUser = await User.findById(possibleUserId).lean();
            if (!foundUser && possibleEmail) foundUser = await User.findOne({ email: possibleEmail }).lean();
            if (foundUser) {
                const created = new Date(foundUser.createdAt || Date.now());
                const ageMs = Date.now() - created.getTime();
                const days = Math.floor(ageMs / (1000 * 60 * 60 * 24));
                const NEW_USER_DAYS = 30; // configurable threshold
                const NEW_USER_CAP = 10; // cap amount in dollars for new users
                if (days <= NEW_USER_DAYS) {
                    // cap discount to NEW_USER_CAP
                    discount = Math.min(discount, NEW_USER_CAP);
                }
            }
        } catch (e) {
            // ignore user-check errors and proceed with computed discount
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