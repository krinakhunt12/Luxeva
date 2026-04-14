const User = require('../user/User');

// get current user's points
const getPoints = async(req, res) => {
    try {
        const authUserId = req.user && (req.user.id || req.user._id);
        if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });
        const user = await User.findById(authUserId).lean();
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.json({ ok: true, points: user.points || 0 });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch points' });
    }
};

// redeem points: body { points }
// conversion: 1 point = 1 INR
const redeemPoints = async(req, res) => {
    try {
        const authUserId = req.user && (req.user.id || req.user._id);
        if (!authUserId) return res.status(401).json({ message: 'Unauthorized' });
        const { points = 0 } = req.body || {};
        const use = Math.max(0, Math.floor(Number(points || 0)));
        if (!use) return res.status(400).json({ message: 'Invalid points amount' });
        const user = await User.findById(authUserId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const available = Number(user.points || 0);
        if (available <= 0) return res.status(400).json({ message: 'No points available' });
        const deduct = Math.min(available, use);
        user.points = available - deduct;
        await user.save();
        // value in currency
        const value = deduct * 1; // 1 point = ₹1
        return res.json({ ok: true, deducted: deduct, value, pointsRemaining: user.points });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Redeem failed' });
    }
};

module.exports = { getPoints, redeemPoints };