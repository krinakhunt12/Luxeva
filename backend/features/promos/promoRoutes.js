const express = require('express');
const router = express.Router();
const controller = require('./promoController');

router.get('/context', controller.getContext);

module.exports = router;