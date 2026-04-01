const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    hash: { type: String, required: true, unique: true },
    mime: String,
    dataUrl: String, // full data URL like 'data:image/jpeg;base64,...'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Image || mongoose.model('Image', ImageSchema);