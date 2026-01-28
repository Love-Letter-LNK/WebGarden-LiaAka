const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { submitMessageValidation, guestbookValidation } = require('../middleware/validationMiddleware');

// ============ PUBLIC ROUTES ============
router.post('/', submitMessageValidation, contactController.submitMessage);
router.post('/guestbook-notify', guestbookValidation, contactController.notifyGuestbook);

// ============ ADMIN ROUTES ============
router.get('/', requireAuth, requireAdmin, contactController.listMessages);
router.get('/stats', requireAuth, requireAdmin, contactController.getStats);
router.get('/:id', requireAuth, requireAdmin, contactController.getMessage);
router.patch('/:id/read', requireAuth, requireAdmin, contactController.markAsRead);
router.delete('/:id', requireAuth, requireAdmin, contactController.deleteMessage);

module.exports = router;
