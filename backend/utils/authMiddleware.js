const jwt = require('jsonwebtoken');
const User = require('../features/user/User');

const authenticate = async(req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'luxeva_secret');
        // attach user info including role by fetching from DB
        try {
            const user = await User.findById(decoded.id).lean();
            req.user = { id: decoded.id, email: decoded.email, role: user ? user.role : undefined };
        } catch (e) {
            req.user = decoded;
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticate };