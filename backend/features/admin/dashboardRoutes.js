const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentOrders } = require('./dashboardController');
const { authenticate } = require('../../utils/authMiddleware');

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};

router.get('/stats', authenticate, adminOnly, getDashboardStats);
router.get('/recent-orders', authenticate, adminOnly, getRecentOrders);

module.exports = router;
