const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;
