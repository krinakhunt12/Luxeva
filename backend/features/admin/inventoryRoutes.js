const express = require('express');
const router = express.Router();
const { lowStock, report } = require('./inventoryController');
const { authenticate } = require('../../utils/authMiddleware');

// admin only
router.get('/low-stock', authenticate, async(req, res, next) => {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    return lowStock(req, res, next);
});

router.get('/report', authenticate, async(req, res, next) => {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    return report(req, res, next);
});

router.post('/restock/:id', authenticate, async(req, res, next) => {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { restock } = require('./inventoryController');
    return restock(req, res, next);
});

module.exports = router;