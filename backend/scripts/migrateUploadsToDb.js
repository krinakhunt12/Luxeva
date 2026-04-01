const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Product = require('../features/products/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

function mimeForExt(ext) {
    switch ((ext || '').toLowerCase()) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.webp':
            return 'image/webp';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}

async function run() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const products = await Product.find({ 'images.0': { $exists: true } }).lean();
        let migratedCount = 0;
        for (const p of products) {
            let changed = false;
            const newImages = [];
            for (const img of(p.images || [])) {
                if (!img) continue;
                // Already a data URL
                if (String(img).startsWith('data:')) {
                    newImages.push(img);
                    continue;
                }

                // Only migrate paths that look like uploads
                const normalized = String(img).replace(/^\//, '');
                if (!/^uploads[\\/]/i.test(normalized)) {
                    newImages.push(img);
                    continue;
                }

                const full = path.join(__dirname, '..', 'public', normalized);
                if (!fs.existsSync(full)) {
                    console.warn('File not found, skipping:', full);
                    newImages.push(img);
                    continue;
                }

                try {
                    const buf = fs.readFileSync(full);
                    const ext = path.extname(full);
                    const mime = mimeForExt(ext);
                    const dataUrl = `data:${mime};base64,${buf.toString('base64')}`;
                    newImages.push(dataUrl);
                    changed = true;
                } catch (err) {
                    console.error('Failed to read file:', full, err.message);
                    newImages.push(img);
                }
            }

            if (changed) {
                await Product.findByIdAndUpdate(p._id, { images: newImages });
                migratedCount++;
                console.log('Migrated product:', p._id.toString());
            }
        }

        console.log(`Migration complete. Products migrated: ${migratedCount}`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

run();