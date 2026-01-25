const express = require('express');
const router = express.Router();
console.log("--> Loading News Routes...");
const newsController = require('../controllers/newsController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// ============ PUBLIC ROUTES ============
router.get('/', newsController.listNews);
router.get('/:id', newsController.getNews);

// ============ ADMIN ROUTES ============
router.get('/admin/all', requireAuth, requireAdmin, newsController.listAllNews);
router.post('/', requireAuth, requireAdmin, newsController.createNews);
router.patch('/:id', requireAuth, requireAdmin, newsController.updateNews);
router.delete('/:id', requireAuth, requireAdmin, newsController.deleteNews);

module.exports = router;
