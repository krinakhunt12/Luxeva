const orderController = require('../controllers/orderController');

async function orderRoutes(fastify, options) {
    // List orders - optional admin or authenticated user filtering is handled in controller
    fastify.get('/', { preHandler: [fastify.authenticate] }, orderController.getOrders);
    fastify.get('/:id', { preHandler: [fastify.authenticate] }, orderController.getOrderById);
    // Creating an order requires authentication (only logged-in users can checkout/place orders)
    fastify.post('/', { preHandler: [fastify.authenticate] }, orderController.createOrder);
    // Cancelling an order requires authentication as well
    fastify.post('/:id/cancel', { preHandler: [fastify.authenticate] }, orderController.cancelOrder);
}

module.exports = orderRoutes;