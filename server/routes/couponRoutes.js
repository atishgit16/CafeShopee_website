// server/routes/couponRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require('../controller/couponController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCoupons);
router.post('/validate', authMiddleware, validateCoupon);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createCoupon);
router.get('/:id', authMiddleware, adminMiddleware, getCouponById);
router.put('/:id', authMiddleware, adminMiddleware, updateCoupon);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCoupon);

module.exports = router;