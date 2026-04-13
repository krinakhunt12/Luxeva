const express = require('express');
const router = express.Router();
const { createGiftCard, getByCode, redeem } = require('./giftcardController');
const { authenticate } = require('../../utils/authMiddleware');

// create gift card (admin)
router.post('/', authenticate, async(req, res, next) => {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    return createGiftCard(req, res, next);
});

// get by code
router.get('/:code', getByCode);

// redeem (public during checkout)
router.post('/redeem', authenticate, redeem);

module.exports = router;