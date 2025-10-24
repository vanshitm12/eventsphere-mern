const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../utils/authMiddleware');
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAll);
router.get('/:id', eventController.getOne);

// Protected CRUD
router.post('/', authMiddleware, requireRole('organizer'), eventController.create);
router.put('/:id', authMiddleware, requireRole('organizer'), eventController.update);
router.delete('/:id', authMiddleware, requireRole('admin'), eventController.remove);

// Registration & participants
router.post('/register/:eventId', authMiddleware, eventController.registerForEvent);
router.get('/participants/:eventId', authMiddleware, requireRole('organizer'), eventController.getParticipants);

module.exports = router;
