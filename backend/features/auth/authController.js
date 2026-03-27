const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/User');

const signup = async(req, res) => {
    try {
        const { name, email, mobile, password } = req.body || {};
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: 'Email already in use' });
        const hashed = bcrypt.hashSync(password, 10);
        const user = new User({ name, email: email.toLowerCase(), mobile, password: hashed });
        await user.save();
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'luxeva_secret', { expiresIn: '7d' });
        const safeUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role };
        return res.json({ user: safeUser, token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });
        const match = bcrypt.compareSync(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid email or password' });
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'luxeva_secret', { expiresIn: '7d' });
        const safeUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role };
        return res.json({ user: safeUser, token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { signup, login };