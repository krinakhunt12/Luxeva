const express = require('express');
const router = express.Router();
const controller = require('./abandonedController');
const { authenticate } = require('../../utils/authMiddleware');

// Admin-only routes
router.get('/', authenticate, controller.listCarts);
router.post('/send/:id', authenticate, controller.sendNow);
router.get('/template', authenticate, controller.previewTemplate);

module.exports = router;
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