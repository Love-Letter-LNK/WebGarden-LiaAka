const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// ============ PUBLIC ROUTES ============
router.get('/', memoryController.listMemories);
router.get('/:idOrSlug', memoryController.getMemory);

// ============ ADMIN ROUTES ============
router.post('/', requireAuth, requireAdmin, memoryController.createMemory);
router.patch('/:id', requireAuth, requireAdmin, memoryController.updateMemory);
router.delete('/:id', requireAuth, requireAdmin, memoryController.deleteMemory);

// ============ IMAGE ROUTES (Admin only) ============
router.post('/:id/images', requireAuth, requireAdmin, upload.array('images', 10), memoryController.uploadImages);
router.delete('/:id/images/:imageId', requireAuth, requireAdmin, memoryController.deleteImage);
router.patch('/:id/images/reorder', requireAuth, requireAdmin, memoryController.reorderImages);

module.exports = router;
