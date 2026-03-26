const User = require('../models/User');

const getUsers = async(request, reply) => {
    const users = await User.find().select('-password').lean();
    return reply.send(users);
};

const getUserById = async(request, reply) => {
    const user = await User.findById(request.params.id).select('-password').lean();
    if (!user) return reply.status(404).send({ message: 'User not found' });
    return reply.send(user);
};

const addUserAddress = async(request, reply) => {
    const { id } = request.params;
    const addr = request.body || {};
    if (!addr.line1 || !addr.city || !addr.postalCode) return reply.status(400).send({ message: 'Address requires line1, city, postalCode' });
    const user = await User.findById(id);
    if (!user) return reply.status(404).send({ message: 'User not found' });
    user.addresses = user.addresses || [];
    user.addresses.push({...addr, createdAt: new Date() });
    await user.save();
    return reply.status(201).send(user.addresses[user.addresses.length - 1]);
};

module.exports = { getUsers, getUserById, addUserAddress };