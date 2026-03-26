const bcrypt = require('bcrypt');
const User = require('../models/User');

const signup = async(request, reply) => {
    const { name, email, mobile, password } = request.body || {};
    if (!name || !email || !password) return reply.status(400).send({ message: 'Missing fields' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return reply.status(400).send({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email: email.toLowerCase(), mobile, password: hashed });
    await user.save();
    const token = request.server.jwt.sign({ id: user._id, email: user.email });
    const safeUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile };
    return reply.send({ user: safeUser, token });
};

const login = async(request, reply) => {
    const { email, password } = request.body || {};
    if (!email || !password) return reply.status(400).send({ message: 'Missing credentials' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return reply.status(401).send({ message: 'Invalid email or password' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return reply.status(401).send({ message: 'Invalid email or password' });
    const token = request.server.jwt.sign({ id: user._id, email: user.email });
    const safeUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile };
    return reply.send({ user: safeUser, token });
};

module.exports = { signup, login };