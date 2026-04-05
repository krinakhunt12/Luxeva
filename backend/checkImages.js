require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const images = await db.collection('images').find({}).limit(5).toArray();
        console.log(`Total images in Image collection: ${await db.collection('images').countDocuments()}`);
        images.forEach(img => {
            console.log(`Hash: ${img.hash}`);
            console.log(`dataUrl type: ${typeof img.dataUrl}`);
            console.log(`dataUrl length: ${img.dataUrl?.length || 0}`);
            if (img.dataUrl && img.dataUrl.length > 0) {
                console.log(`dataUrl start: ${img.dataUrl.substring(0, 50)}`);
            }
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
