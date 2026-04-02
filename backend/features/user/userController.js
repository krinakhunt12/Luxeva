const bcrypt = require('bcryptjs');
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
    try {
        const { id } = req.params;
        const addr = req.body || {};
        const requesterId = req.user && req.user.id;
        if (!requesterId) return res.status(401).json({ message: 'Unauthorized' });

        // allow if self or admin
        let allowed = requesterId === id;
        if (!allowed) {
            const requester = await User.findById(requesterId).lean();
            if (requester && requester.role === 'admin') allowed = true;
        }
        if (!allowed) return res.status(403).json({ message: 'Forbidden' });

        if (!addr.line1 || !addr.city || !addr.postalCode) return res.status(400).json({ message: 'Address requires line1, city, postalCode' });
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.addresses = user.addresses || [];
        user.addresses.push({...addr, createdAt: new Date() });
        await user.save();
        return res.status(200).json(user.addresses[user.addresses.length - 1]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update user (self or admin)
const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const updaterId = req.user && req.user.id;
        if (!updaterId) return res.status(401).json({ message: 'Unauthorized' });

        // allow if self
        let allowed = updaterId === id;

        // if not self, check if requester is admin
        if (!allowed) {
            const requester = await User.findById(updaterId).lean();
            if (requester && requester.role === 'admin') allowed = true;
        }

        if (!allowed) return res.status(403).json({ message: 'Forbidden' });

        const updates = {...(req.body || {}) };
        // prevent direct role elevation unless admin
        if (updates.role) {
            const requester = await User.findById(updaterId).lean();
            if (!requester || requester.role !== 'admin') delete updates.role;
        }

        // handle password hashing
        if (updates.password) {
            updates.password = bcrypt.hashSync(updates.password, 10);
        }

        // if updating email, normalize
        if (updates.email) updates.email = updates.email.toLowerCase();

        // ensure email uniqueness
        if (updates.email) {
            const existing = await User.findOne({ email: updates.email, _id: { $ne: id } });
            if (existing) return res.status(400).json({ message: 'Email already in use' });
        }

        const updated = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password').lean();
        if (!updated) return res.status(404).json({ message: 'User not found' });
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete user (self or admin)
const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const requesterId = req.user && req.user.id;
        if (!requesterId) return res.status(401).json({ message: 'Unauthorized' });

        // allow if self
        let allowed = requesterId === id;

        if (!allowed) {
            const requester = await User.findById(requesterId).lean();
            if (requester && requester.role === 'admin') allowed = true;
        }

        if (!allowed) return res.status(403).json({ message: 'Forbidden' });

        const deleted = await User.findByIdAndDelete(id).lean();
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        return res.json({ message: 'User deleted', id: deleted._id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getUsers, getUserById, addUserAddress, updateUser, deleteUser };