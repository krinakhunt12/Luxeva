const express = require('express');
const router = express.Router();
const productController = require('./productController');
const { authenticate } = require('../../utils/authMiddleware');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
// Accept multipart/form-data with field name `images` (one or multiple files).
// File handling is performed in the controller using express-fileupload.
router.post('/', authenticate, productController.createProduct);
router.put('/:id', authenticate, productController.updateProduct);
router.delete('/:id', authenticate, productController.deleteProduct);

module.exports = router;