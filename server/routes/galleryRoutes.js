const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// ============ PUBLIC ROUTES ============
router.get('/', galleryController.listGallery);
router.get('/:id', galleryController.getGalleryItem);

// ============ ADMIN ROUTES ============
router.post('/', requireAuth, requireAdmin, upload.array('images', 10), galleryController.uploadGallery);
router.patch('/:id', requireAuth, requireAdmin, galleryController.updateGalleryItem);
router.delete('/:id', requireAuth, requireAdmin, galleryController.deleteGalleryItem);

module.exports = router;
