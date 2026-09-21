const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, getOrderStats, requestOrderReturn } = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/stats', protect, isAdmin, getOrderStats);
router.put('/:id/return', protect, requestOrderReturn);
router.get('/:id', protect, getOrderById);
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;
