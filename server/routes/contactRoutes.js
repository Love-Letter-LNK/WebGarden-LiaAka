const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// ============ PUBLIC ROUTES ============
router.post('/', contactController.submitMessage);

// ============ ADMIN ROUTES ============
router.get('/', requireAuth, requireAdmin, contactController.listMessages);
router.get('/stats', requireAuth, requireAdmin, contactController.getStats);
router.get('/:id', requireAuth, requireAdmin, contactController.getMessage);
router.patch('/:id/read', requireAuth, requireAdmin, contactController.markAsRead);
router.delete('/:id', requireAuth, requireAdmin, contactController.deleteMessage);

module.exports = router;
