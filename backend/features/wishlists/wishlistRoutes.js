const express = require('express');
const router = express.Router();
const { createWishlist, getWishlist } = require('./wishlistController');
const { authenticate } = require('../../utils/authMiddleware');

// create shareable wishlist (optional auth)
router.post('/', authenticate, createWishlist);
// public fetch by token
router.get('/:token', getWishlist);

module.exports = router;