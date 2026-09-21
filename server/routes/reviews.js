const express = require('express');
const router = express.Router();
const { createReview, getMyReviews, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/my', protect, getMyReviews);
router.get('/:productId', getProductReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
