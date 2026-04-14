require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./features/products/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const product = await Product.findOne({ slug: /pill/i }).lean();
        if (!product) {

            process.exit(0);
        }


        if (product.images && product.images.length > 0) {
            const img = product.images[0];




            // Check if it's a valid data URL
            if (img.startsWith('data:image/')) {

            } else {

            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();