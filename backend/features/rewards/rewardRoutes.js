const express = require('express');
const router = express.Router();
const { getPoints, redeemPoints } = require('./rewardController');
const { authenticate } = require('../../utils/authMiddleware');

router.get('/', authenticate, async(req, res, next) => {
    return getPoints(req, res, next);
});

router.post('/redeem', authenticate, async(req, res, next) => {
    return redeemPoints(req, res, next);
});

module.exports = router;