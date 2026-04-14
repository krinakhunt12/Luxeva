const express = require('express');
const router = express.Router();
const offerController = require('./offerController');
const { authenticate } = require('../../utils/authMiddleware');

router.get('/', offerController.getOffers);
router.post('/validate', offerController.validateOffer);
router.post('/', authenticate, offerController.createOffer);
router.get('/:id', offerController.getOfferById);
router.patch('/:id', authenticate, offerController.updateOffer);
router.delete('/:id', authenticate, offerController.deleteOffer);

module.exports = router;