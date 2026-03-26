const userController = require('../controllers/userController');

async function userRoutes(fastify, options) {
    fastify.get('/', { preHandler: [fastify.authenticate] }, userController.getUsers);
    fastify.get('/:id', userController.getUserById);
    fastify.post('/:id/address', userController.addUserAddress);
}

module.exports = userRoutes;