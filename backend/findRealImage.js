require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        const db = mongoose.connection.db;
        const images = await db.collection('images').find({}).toArray();
        for (const img of images) {
            console.log(`Hash: ${img.hash}, length: ${img.dataUrl?.length || 0}`);
            if (img.dataUrl && img.dataUrl.length > 1000) {
                console.log(`Start: ${img.dataUrl.substring(0, 100)}`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
