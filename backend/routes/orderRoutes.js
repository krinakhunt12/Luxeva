const orderController = require('../features/orders/orderController');

const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/authMiddleware');

router.get('/', authenticate, orderController.getOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.post('/', authenticate, orderController.createOrder);
router.post('/:id/cancel', authenticate, orderController.cancelOrder);

module.exports = router;