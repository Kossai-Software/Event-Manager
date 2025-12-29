// controllers/userController.js
const User = require('../models/User');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name } = req.body;
    let avatar_url = null;
    if (req.file) {
      avatar_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }
    const user = await User.update(userId, { name, avatar_url });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserProfile, updateUserProfile };