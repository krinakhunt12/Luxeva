const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { authenticate } = require('../../utils/authMiddleware');
const multer = require('multer');

// Use memory storage so files are available as buffers on `req.files` and
// nothing is written to disk.
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);
// Accept multipart/form-data with field name `images` (one or multiple files).
// File handling is performed in the controller using express-fileupload.
// Accept multipart/form-data with field name `images` (one or multiple files).
router.post('/', authenticate, upload.array('images'), productController.createProduct);
router.put('/:id', authenticate, upload.array('images'), productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;