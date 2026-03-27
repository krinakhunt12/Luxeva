const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { authenticate } = require('../../utils/authMiddleware');

router.get('/', authenticate, userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/:id/address', userController.addUserAddress);

module.exports = router;