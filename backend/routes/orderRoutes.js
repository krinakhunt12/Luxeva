const orderController = require('../controllers/orderController');

async function orderRoutes(fastify, options) {
    fastify.get('/', orderController.getOrders);
    fastify.get('/:id', orderController.getOrderById);
    fastify.post('/', orderController.createOrder);
    fastify.post('/:id/cancel', orderController.cancelOrder);
}

module.exports = orderRoutes;