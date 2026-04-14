require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./features/products/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

async function fix() {
    try {
        await mongoose.connect(MONGO_URI);
        const product = await Product.findOne({ slug: /pill/i });
        if (!product) {

            process.exit(0);
        }

        const db = mongoose.connection.db;
        const images = await db.collection('images').find({}).toArray();


        // Filter and sort by size to find the "realest" images
        const realImages = images
            .filter(img => img.dataUrl && img.dataUrl.length > 5000) // skip placeholders
            .sort((a, b) => b.dataUrl.length - a.dataUrl.length)
            .map(img => img.dataUrl);

        if (realImages.length > 0) {

            product.images = realImages;
            await product.save();

        } else {


            // Generate a placeholder that looks better than 1x1 if we can't find anything
            const PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
            product.images = [PLACEHOLDER];
            await product.save();
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();