const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { authenticate } = require('../../utils/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage to save files to `public/uploads`
const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
        const safeName = file.originalname.replace(/[^a-z0-9.\-()_]/gi, '_');
        cb(null, Date.now() + '-' + safeName);
    }
});
const upload = multer({ storage });

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
// Accept multipart/form-data with field name `images` (one or multiple files).
// File handling is performed in the controller using express-fileupload.
// Accept multipart/form-data with field name `images` (one or multiple files).
router.post('/', authenticate, upload.array('images'), productController.createProduct);
router.put('/:id', authenticate, upload.array('images'), productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;