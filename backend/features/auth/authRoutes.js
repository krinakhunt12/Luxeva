const express = require('express');
const router = express.Router();
const authController = require('./authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

module.exports = router;