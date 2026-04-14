require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./features/auth/authRoutes');
const productRoutes = require('./features/products/productRoutes');
// userRoutes moved to feature folder
const userRoutes = require('./features/user/userRoutes');
const orderRoutes = require('./features/orders/orderRoutes');
const offerRoutes = require('./features/offers/offerRoutes');
const wishlistRoutes = require('./features/wishlists/wishlistRoutes');
const inventoryRoutes = require('./features/admin/inventoryRoutes');
const Contact = require('./models/Contact');

const PORT = process.env.PORT || 4000;
// Ensure database name is `Luxeva` by default. You can override with MONGO_URI in your environment.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

const app = express();
app.use(cors());
app.use(express.json());
// Images are stored in the database as Base64 strings directly in the Product collection.

async function start() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        app.use('/api', authRoutes);
        app.use('/api/products', productRoutes);
        app.use('/api/wishlists', wishlistRoutes);
        app.use('/api/admin/inventory', inventoryRoutes);
        app.use('/api/abandoned', require('./features/abandoned/abandonedRoutes'));
        app.use('/api/giftcards', require('./features/giftcards/giftcardRoutes'));
        app.use('/api/users', userRoutes);
        app.use('/api/orders', orderRoutes);
        app.use('/api/offers', offerRoutes);
        app.use('/api/promos', require('./features/promos/promoRoutes'));

        // start background jobs
        try { require('./jobs/abandonedCartWorker'); } catch (err) { console.error('Could not start abandoned worker', err); }

        app.get('/api/pages/about', (req, res) => {
            return res.json({
                eyebrow: 'Our Story',
                title: 'The Art of Minimalism',
                subtitle: 'Founded on the principle that quality matters more than quantity.',
                content: '<p>Luxeva was born in 2020 with a simple mission: to create a wardrobe of essentials that are as beautiful as they are sustainable. We believe that fashion should be slow, thoughtful, and enduring.</p>'
            });
        });

        app.post('/api/contact', async(req, res) => {
            const { firstName, lastName, email, subject, message } = req.body || {};
            if (!firstName || !email || !message) return res.status(400).json({ message: 'Missing required fields' });
            const contact = new Contact({ firstName, lastName, email, subject, message });
            await contact.save();
            return res.status(200).json({ ok: true });
        });

        app.listen(PORT, '0.0.0.0', () => console.log(`Luxeva backend listening on port ${PORT}`));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();