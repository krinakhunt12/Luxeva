const Offer = require('../offers/Offer');
const Product = require('../products/Product');
const User = require('../user/User');

// GET /api/promos/context?productId=xxx
const getContext = async(req, res) => {
    try {
        const { productId } = req.query || {};
        // find an active offer that applies to this product or global
        const now = new Date();
        const offers = await Offer.find({ status: 'active' }).lean();
        let selected = null;
        for (const o of offers) {
            if (o.startsAt && new Date(o.startsAt) > now) continue;
            if (o.endsAt && new Date(o.endsAt) < now) continue;
            if (o.appliesTo === 'all') { selected = o; break; }
            if (o.productId && String(o.productId) === String(productId)) { selected = o; break; }
            if (Array.isArray(o.productIds) && o.productIds.find(id => String(id) === String(productId))) { selected = o; break; }
        }

        // basic recommendations: same category products
        let recommendations = [];
        if (productId) {
            const product = await Product.findById(productId).lean();
            if (product) {
                recommendations = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(4).select('name slug images price').lean();
            }
        }

        // detect new user
        let newUser = false;
        let newUserCap = 10;
        try {
            const possibleUserId = req.user.id || req.user._id || req.query.userId || req.body.userId;
            const possibleEmail = req.query.email || req.body.email || req.user.email;
            let foundUser = null;
            if (possibleUserId) foundUser = await User.findById(possibleUserId).lean();
            if (!foundUser && possibleEmail) foundUser = await User.findOne({ email: possibleEmail }).lean();
            if (foundUser) {
                const created = new Date(foundUser.createdAt || Date.now());
                const ageMs = Date.now() - created.getTime();
                const days = Math.floor(ageMs / (1000 * 60 * 60 * 24));
                if (days <= 30) newUser = true;
            }
        } catch (e) { /* ignore */ }

        // prepare offer payload with cap info
        let offerPayload = null;
        if (selected) {
            offerPayload = {...selected };
            if (newUser) {
                offerPayload.newUserCap = newUserCap;
            }
        }

        return res.json({ offer: offerPayload, recommendations });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch promos' });
    }
};

module.exports = { getContext };