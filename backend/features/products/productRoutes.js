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
// expose aggregated available filters (colors, sizes, subCategories)
router.get('/filters', productController.getFilters);
// place slug route before the generic `/:id` to avoid route collisions
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);
// Accept multipart/form-data with field name `images` (one or multiple files).
// File handling is performed in the controller using express-fileupload.
// Accept multipart/form-data with field name `images` (one or multiple files).
router.post('/', authenticate, upload.array('images'), productController.createProduct);
router.put('/:id', authenticate, upload.array('images'), productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;