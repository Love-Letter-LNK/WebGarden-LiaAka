const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Define Routes
router.get('/milestones', apiController.getMilestones);
router.get('/memories', apiController.getMemories);

module.exports = router;
