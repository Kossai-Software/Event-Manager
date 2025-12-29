// controllers/favoriteController.js
const Favorite = require('../models/Favorite');
const Event = require('../models/Event');
const Notification = require('../models/Notification');

const addFavorite = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const { eventId } = req.body;

    // Ensure event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await Favorite.add(userId, eventId);

    // Create notification
    await Notification.create({
      userId,
      message: `Added "${event.title}" to your favorites!`,
      type: 'info'
    });

    res.status(201).json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const eventId = req.params.eventId;

    await Favorite.remove(userId, eventId);
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const favorites = await Favorite.findByUser(userId);
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addFavorite, removeFavorite, getUserFavorites };