// controllers/eventController.js
const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      price: req.query.price,
      featured: req.query.featured,
      search: req.query.search,
      status: req.query.status // for drafts
    };
    const events = await Event.findAll(filters);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title, description, category, date, time, location,
      venue_name, venue_address, venue_capacity, price,
      organizer_id, tags, status = 'published'
    } = req.body;

    let image_url = null;
    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title, description, category, date, time, location,
      venue_name, venue_address, venue_capacity, price,
      image_url, organizer_id: parseInt(organizer_id), tags: tags || [], status
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { organizer_id, ...updateData } = req.body;

    let image_url = req.body.image_url;
    if (req.file) {
      image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    if (image_url) updateData.image_url = image_url;

    const event = await Event.update(eventId, updateData);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.delete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event archived' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Increment attendees count for an event (used when user registers)
const incrementAttendees = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if ((event.attendees || 0) >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }
    
    // Increment attendees count
    const updatedEvent = await Event.update(eventId, {
      attendees: (event.attendees || 0) + 1
    });

    res.json(updatedEvent);
  } catch (err) {
    console.error('Error incrementing attendees:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  incrementAttendees
};
