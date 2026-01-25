const express = require('express');
const router = express.Router();
console.log("--> Loading Journey Routes...");
const journeyController = require('../controllers/journeyController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

// ============ PUBLIC ROUTES ============
router.get('/', journeyController.listJourney);
router.get('/:id', journeyController.getJourney);

// ============ ADMIN ROUTES ============
router.post('/', requireAuth, requireAdmin, journeyController.createJourney);
router.patch('/:id', requireAuth, requireAdmin, journeyController.updateJourney);
router.delete('/:id', requireAuth, requireAdmin, journeyController.deleteJourney);

module.exports = router;
