const orderController = require('./orderController');

const express = require('express');
const router = express.Router();
const { authenticate } = require('../../utils/authMiddleware');

router.get('/', authenticate, orderController.getOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);
router.post('/buy-now', authenticate, orderController.buyNow);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);
router.patch('/:id/status', authenticate, orderController.updateOrderStatus);

module.exports = router;