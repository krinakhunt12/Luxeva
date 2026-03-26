require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const cors = require('@fastify/cors');
const fastifyJwt = require('fastify-jwt');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
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

        // --- Auth ---
        fastify.post('/api/signup', async(request, reply) => {
            const { name, email, mobile, password } = request.body || {};
            if (!name || !email || !password) return reply.status(400).send({ message: 'Missing fields' });
            const existing = await User.findOne({ email: email.toLowerCase() });
            if (existing) return reply.status(400).send({ message: 'Email already in use' });
            const hashed = await bcrypt.hash(password, 10);
            const user = new User({ name, email: email.toLowerCase(), mobile, password: hashed });
            await user.save();
            const token = fastify.jwt.sign({ id: user._id, email: user.email });
            const safeUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile };
            return reply.send({ user: safeUser, token });
        });

        fastify.post('/api/login', async(request, reply) => {
            const { email, password } = request.body || {};
            if (!email || !password) return reply.status(400).send({ message: 'Missing credentials' });
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) return reply.status(401).send({ message: 'Invalid email or password' });
            const match = await bcrypt.compare(password, user.password);
            if (!match) return reply.status(401).send({ message: 'Invalid email or password' });
            const token = fastify.jwt.sign({ id: user._id, email: user.email });
            const safeUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile };
            return reply.send({ user: safeUser, token });
        });

        // --- Products ---
        fastify.get('/api/products', async(request, reply) => {
            const { search } = request.query;
            const q = {};
            if (search) q.$or = [{ name: new RegExp(search, 'i') }, { slug: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
            const products = await Product.find(q).lean();
            return reply.send(products);
        });

        fastify.get('/api/products/:id', async(request, reply) => {
            const product = await Product.findById(request.params.id).lean();
            if (!product) return reply.status(404).send({ message: 'Product not found' });
            return reply.send(product);
        });

        fastify.post('/api/products', { preHandler: [fastify.authenticate] }, async(request, reply) => {
            const payload = request.body || {};
            if (!payload.name || !payload.slug) return reply.status(400).send({ message: 'Missing required fields: name or slug' });
            const product = new Product(payload);
            await product.save();
            return reply.status(201).send(product);
        });

        fastify.put('/api/products/:id', { preHandler: [fastify.authenticate] }, async(request, reply) => {
            const payload = request.body || {};
            const product = await Product.findByIdAndUpdate(request.params.id, payload, { new: true });
            if (!product) return reply.status(404).send({ message: 'Product not found' });
            return reply.send(product);
        });

        fastify.delete('/api/products/:id', { preHandler: [fastify.authenticate] }, async(request, reply) => {
            const res = await Product.findByIdAndDelete(request.params.id);
            if (!res) return reply.status(404).send({ message: 'Product not found' });
            return reply.status(204).send();
        });

        // --- Users ---
        fastify.get('/api/users', { preHandler: [fastify.authenticate] }, async(request, reply) => {
            const users = await User.find().select('-password').lean();
            return reply.send(users);
        });

        fastify.get('/api/users/:id', async(request, reply) => {
            const user = await User.findById(request.params.id).select('-password').lean();
            if (!user) return reply.status(404).send({ message: 'User not found' });
            return reply.send(user);
        });

        fastify.post('/api/users/:id/address', async(request, reply) => {
            const { id } = request.params;
            const addr = request.body || {};
            if (!addr.line1 || !addr.city || !addr.postalCode) return reply.status(400).send({ message: 'Address requires line1, city, postalCode' });
            const user = await User.findById(id);
            if (!user) return reply.status(404).send({ message: 'User not found' });
            user.addresses = user.addresses || [];
            user.addresses.push({...addr, createdAt: new Date() });
            await user.save();
            return reply.status(201).send(user.addresses[user.addresses.length - 1]);
        });

        // --- Orders ---
        fastify.get('/api/orders', async(request, reply) => {
            const { userId } = request.query;
            const filter = userId ? { userId } : {};
            const orders = await Order.find(filter).lean();
            return reply.send(orders);
        });

        fastify.get('/api/orders/:id', async(request, reply) => {
            const order = await Order.findById(request.params.id).lean();
            if (!order) return reply.status(404).send({ message: 'Order not found' });
            return reply.send(order);
        });

        fastify.post('/api/orders', async(request, reply) => {
            const { userId, items, shippingAddress, paymentMethod, total } = request.body || {};
            if (!userId || !Array.isArray(items) || items.length === 0 || !shippingAddress) return reply.status(400).send({ message: 'Missing required fields' });
            const order = new Order({ userId, items, shippingAddress, paymentMethod: paymentMethod || 'unknown', total: total || 0, status: 'created' });
            await order.save();
            return reply.status(201).send(order);
        });

        fastify.post('/api/orders/:id/cancel', async(request, reply) => {
            const order = await Order.findById(request.params.id);
            if (!order) return reply.status(404).send({ message: 'Order not found' });
            if (order.status === 'cancelled') return reply.status(400).send({ message: 'Order already cancelled' });
            order.status = 'cancelled';
            order.cancelledAt = new Date();
            await order.save();
            return reply.send(order);
        });

        // --- Pages & Contact ---
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