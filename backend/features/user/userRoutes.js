const express = require('express');
const router = express.Router();
const userController = require('./userController');
const { authenticate } = require('../../utils/authMiddleware');

router.get('/', authenticate, userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/:id/address', authenticate, userController.addUserAddress);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;