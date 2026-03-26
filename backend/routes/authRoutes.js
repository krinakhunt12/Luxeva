const authController = require('../controllers/authController');

async function authRoutes(fastify, options) {
    fastify.post('/signup', authController.signup);
    fastify.post('/login', authController.login);
}

module.exports = authRoutes;