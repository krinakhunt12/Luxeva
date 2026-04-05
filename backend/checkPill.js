require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./features/products/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const product = await Product.findOne({ slug: /pill/i }).lean();
        if (!product) {
            console.log('Product not found');
            process.exit(0);
        }
        console.log(`Product: ${product.name}`);
        console.log(`Images count: ${product.images?.length || 0}`);
        if (product.images && product.images.length > 0) {
            const img = product.images[0];
            console.log(`Image length: ${img.length}`);
            console.log(`Image start: ${img.substring(0, 100)}`);
            console.log(`Image end: ${img.substring(img.length - 100)}`);
            
            // Check if it's a valid data URL
            if (img.startsWith('data:image/')) {
                console.log('Valid data URL prefix');
            } else {
                console.log('INVALID data URL prefix');
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
