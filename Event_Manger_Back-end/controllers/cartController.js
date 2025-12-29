// controllers/cartController.js
const CartItem = require('../models/CartItem');
const Event = require('../models/Event');

const getCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const cartItems = await CartItem.findByUser(userId);
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const { eventId, quantity = 1 } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    if (event.status !== 'published') {
      return res.status(400).json({ error: 'Event is not available' });
    }

    await CartItem.add(userId, eventId, quantity);
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const eventId = req.params.eventId;
    const { quantity } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await CartItem.update(userId, eventId, quantity);
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const eventId = req.params.eventId;
    await CartItem.remove(userId, eventId);
    res.status(200).json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };