// routes/auth.js
const express = require('express');
const router = express.Router();

// For dev: simulate user login by returning a mock user
router.get('/me', (req, res) => {
  const userId = req.headers['x-user-id'] || 1;
  res.json({ id: userId, name: 'Alex Johnson', email: 'alex@example.com' });
});

module.exports = router;