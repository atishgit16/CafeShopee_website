// server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  confirmPayment, 
  createPaymentIntentWithoutConfirm 
} = require('../controller/paymentController'); // ← Change 'controller' to 'controllers'
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', authMiddleware, createPaymentIntent);
router.post('/confirm-payment', authMiddleware, confirmPayment);
router.post('/create-payment-intent-without-confirm', authMiddleware, createPaymentIntentWithoutConfirm);

module.exports = router;