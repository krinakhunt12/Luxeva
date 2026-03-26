const productController = require('../controllers/productController');

async function productRoutes(fastify, options) {
    fastify.get('/', productController.getProducts);
    fastify.get('/:id', productController.getProductById);
    fastify.post('/', { preHandler: [fastify.authenticate] }, productController.createProduct);
    fastify.put('/:id', { preHandler: [fastify.authenticate] }, productController.updateProduct);
    fastify.delete('/:id', { preHandler: [fastify.authenticate] }, productController.deleteProduct);
}

module.exports = productRoutes;