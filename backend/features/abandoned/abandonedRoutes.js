const express = require('express');
const router = express.Router();
const controller = require('./abandonedController');
const { authenticate } = require('../../utils/authMiddleware');

// Admin-only routes
router.get('/', authenticate, controller.listCarts);
router.post('/send/:id', authenticate, controller.sendNow);
router.get('/template', authenticate, controller.previewTemplate);

// clients post cart snapshots (auth optional but recommended)
// clients post cart snapshots (auth optional but recommended)
router.post('/', authenticate, controller.upsertCart);
// Note: admin listing is handled above via controller.listCarts

module.exports = router;