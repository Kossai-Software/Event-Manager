// controllers/draftController.js
const Event = require('../models/Event');
const Notification = require('../models/Notification');

const getDrafts = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const drafts = await Event.findAll({ organizerId: userId, status: 'draft' });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const publishDraft = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.update(eventId, { status: 'published' });
    if (!event) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Notify user
    await Notification.create({
      userId: event.organizer_id,
      message: `Your event "${event.title}" is now published!`,
      type: 'success'
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDrafts, publishDraft };