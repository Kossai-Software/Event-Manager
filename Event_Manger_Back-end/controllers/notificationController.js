// controllers/notificationController.js
const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const notifications = await Notification.findByUser(userId);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.markAsRead(req.params.id);
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    await Notification.markAllAsRead(userId);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.delete(req.params.id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };