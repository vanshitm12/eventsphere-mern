const express = require('express');
const router = express.Router();
const { authMiddleware, requireRole } = require('../utils/authMiddleware');
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAll);
router.get('/:id', eventController.getOne);

// ✅ Admin + Organizer allowed to create/update events
router.post('/', authMiddleware, requireRole('organizer', 'admin'), eventController.create);
router.put('/:id', authMiddleware, requireRole('organizer', 'admin'), eventController.update);

// Admin only can delete ✅
router.delete('/:id', authMiddleware, requireRole('admin'), eventController.remove);

// Registration & participants
router.post('/register/:eventId', authMiddleware, eventController.registerForEvent);
router.get('/participants/:eventId', authMiddleware, requireRole('organizer', 'admin'), eventController.getParticipants);

module.exports = router;