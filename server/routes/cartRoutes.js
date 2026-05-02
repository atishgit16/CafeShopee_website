const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controller/cartController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/:itemId', authMiddleware, updateCartItem);
router.delete('/:itemId', authMiddleware, removeFromCart);
router.delete('/', authMiddleware, clearCart);

module.exports = router;