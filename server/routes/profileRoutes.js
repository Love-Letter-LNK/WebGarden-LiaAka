const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// ============ PUBLIC ROUTES ============
router.get('/', profileController.listProfiles);
router.get('/:slug', profileController.getProfile);

// ============ ADMIN ROUTES ============
router.patch('/:slug', requireAuth, requireAdmin, profileController.updateProfile);

module.exports = router;
