// server/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { sendContactMessage, getAllMessages } = require('../controller/contactController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Public route - anyone can send a message
router.post('/', sendContactMessage);

// Admin route - get all messages
router.get('/', authMiddleware, adminMiddleware, getAllMessages);

module.exports = router;