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
        const updated = await Offer.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
        if (!updated) return res.status(404).json({ message: 'Offer not found' });
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ message: err.message });
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

module.exports = { createOffer, getOffers, getOfferById, updateOffer, deleteOffer };