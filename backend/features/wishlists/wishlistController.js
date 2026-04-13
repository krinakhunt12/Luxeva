const crypto = require('crypto');
const Wishlist = require('./Wishlist');
const Product = require('../products/Product');

const createWishlist = async(req, res) => {
    try {
        const { name, products = [], createdBy } = req.body || {};
        const token = crypto.randomBytes(6).toString('hex');
        const w = new Wishlist({ token, name, products, createdBy });
        await w.save();
        return res.json({ ok: true, token, url: `/wishlists/${token}` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not create wishlist' });
    }
};

const getWishlist = async(req, res) => {
    try {
        const { token } = req.params;
        const w = await Wishlist.findOne({ token }).lean();
        if (!w) return res.status(404).json({ message: 'Wishlist not found' });
        // populate product details
        const products = await Product.find({ _id: { $in: w.products } }).lean();
        return res.json({...w, products });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch wishlist' });
    }
};

module.exports = { createWishlist, getWishlist };