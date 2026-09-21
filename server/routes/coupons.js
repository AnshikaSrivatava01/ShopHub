const express = require('express');
const router = express.Router();
const { validateCoupon, getAllCoupons, createCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/validate', protect, validateCoupon);
router.get('/', protect, isAdmin, getAllCoupons);
router.post('/', protect, isAdmin, createCoupon);
router.delete('/:id', protect, isAdmin, deleteCoupon);

module.exports = router;
