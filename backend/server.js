require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');

const cors = require('@fastify/cors');
const fastifyJwt = require('fastify-jwt');

const Contact = require('./models/Contact');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/luxeva';
const JWT_SECRET = process.env.JWT_SECRET || 'luxeva_secret';

async function start() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        fastify.log.info('Connected to MongoDB');

        // Register plugins
        await fastify.register(cors, { origin: true });
        await fastify.register(fastifyJwt, { secret: JWT_SECRET });

        // JWT auth decorator
        fastify.decorate('authenticate', async function(request, reply) {
            try {
                await request.jwtVerify();
            } catch (err) {
                reply.send(err);
            }
        });

        // Register Routes
        await fastify.register(require('./routes/authRoutes'), { prefix: '/api' });
        await fastify.register(require('./routes/productRoutes'), { prefix: '/api/products' });
        await fastify.register(require('./routes/userRoutes'), { prefix: '/api/users' });
        await fastify.register(require('./routes/orderRoutes'), { prefix: '/api/orders' });

        // --- Static Pages & Contact ---
        fastify.get('/api/pages/about', async(request, reply) => {
            return {
                eyebrow: 'Our Story',
                title: 'The Art of Minimalism',
                subtitle: 'Founded on the principle that quality matters more than quantity.',
                content: '<p>Luxeva was born in 2020 with a simple mission: to create a wardrobe of essentials that are as beautiful as they are sustainable. We believe that fashion should be slow, thoughtful, and enduring.</p>'
            };
        });

        fastify.post('/api/contact', async(request, reply) => {
            const { firstName, lastName, email, subject, message } = request.body || {};
            if (!firstName || !email || !message) return reply.status(400).send({ message: 'Missing required fields' });
            const contact = new Contact({ firstName, lastName, email, subject, message });
            await contact.save();
            return reply.status(201).send({ ok: true });
        });

        // Start listening
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        fastify.log.info(`Luxeva backend listening on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();