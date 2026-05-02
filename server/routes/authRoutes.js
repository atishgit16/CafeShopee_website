// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getCurrentUser, 
  getAllUsers 
} = require('../controller/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/me', authMiddleware, getCurrentUser);

// Admin only routes
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;