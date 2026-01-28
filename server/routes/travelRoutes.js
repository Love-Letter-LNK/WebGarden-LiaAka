const express = require('express');
const router = express.Router();
const travelController = require('../controllers/travelController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', travelController.list);
router.get('/:id', travelController.get);

// Admin Routes
router.post('/', requireAuth, requireAdmin, travelController.create);
router.put('/:id', requireAuth, requireAdmin, travelController.update);
router.delete('/:id', requireAuth, requireAdmin, travelController.delete);

// Image Routes (Admin only)
router.post('/:id/images', requireAuth, requireAdmin, travelController.uploadImages);
router.delete('/:id/images/:imageId', requireAuth, requireAdmin, travelController.deleteImage);

module.exports = router;
