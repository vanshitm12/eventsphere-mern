const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../utils/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/stats', authMiddleware, requireRole('admin'), adminController.stats);

module.exports = router;
