const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth'); // JWT auth middleware
const { registerForEvent } = require('../controllers/registerController');

router.post('/:eventId', authenticateUser, registerForEvent);

module.exports = router;