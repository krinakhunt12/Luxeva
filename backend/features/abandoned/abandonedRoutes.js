const express = require('express');
const router = express.Router();
const { upsertCart, listCarts } = require('./abandonedController');
const { authenticate } = require('../../utils/authMiddleware');

// clients post cart snapshots (auth optional but recommended)
router.post('/', authenticate, upsertCart);

// admin list
router.get('/', authenticate, async(req, res, next) => {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    return listCarts(req, res, next);
});

module.exports = router;