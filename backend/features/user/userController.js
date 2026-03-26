const User = require('./User');

const getUsers = async(req, res) => {
    const users = await User.find().select('-password').lean();
    return res.json(users);
};

const getUserById = async(req, res) => {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
};

const addUserAddress = async(req, res) => {
    const { id } = req.params;
    const addr = req.body || {};
    if (!addr.line1 || !addr.city || !addr.postalCode) return res.status(400).json({ message: 'Address requires line1, city, postalCode' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.addresses = user.addresses || [];
    user.addresses.push({...addr, createdAt: new Date() });
    await user.save();
    return res.status(201).json(user.addresses[user.addresses.length - 1]);
};

module.exports = { getUsers, getUserById, addUserAddress };