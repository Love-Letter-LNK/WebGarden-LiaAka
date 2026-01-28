const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/stats', visitorController.getStats);
router.post('/track', visitorController.track);

// Admin Routes
router.get('/', requireAuth, requireAdmin, visitorController.list);
router.get('/analytics', requireAuth, requireAdmin, visitorController.analytics);
router.delete('/clear', requireAuth, requireAdmin, visitorController.clearOld);

module.exports = router;
