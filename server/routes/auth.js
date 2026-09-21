const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getAllUsers, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

// ✅ Test route (fix for "Cannot GET /api/auth")
router.get('/', (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, isAdmin, getAllUsers);

module.exports = router;
