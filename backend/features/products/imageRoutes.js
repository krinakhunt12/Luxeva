const express = require('express');
const router = express.Router();
const Image = require('../../models/Image');

// Fetch image data URL by short hash
router.get('/:hash', async(req, res) => {
    try {
        const img = await Image.findOne({ hash: req.params.hash }).lean();
        if (!img) return res.status(404).json({ message: 'Image not found' });
        return res.json({ data: img.dataUrl, mime: img.mime });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;