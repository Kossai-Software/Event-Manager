// routes/events.js
const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent, incrementAttendees } = require('../controllers/eventController');
const validate = require('../middleware/validate');
const { createEventSchema, updateEventSchema } = require('../validation/eventValidation');
const upload = require('../middleware/upload');

// POST /api/events — create a new event
router.post('/', upload.single('image'), validate(createEventSchema), createEvent);

// GET /api/events — list all events (with filters)
router.get('/', getEvents);

// GET /api/events/:id — get single event
router.get('/:id', getEventById);

router.put('/:id', upload.single('image'), validate(updateEventSchema), updateEvent);
router.delete('/:id', deleteEvent);

router.patch('/:id/register', incrementAttendees);

module.exports = router;
