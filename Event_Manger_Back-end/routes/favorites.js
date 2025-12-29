// routes/favorites.js
const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getUserFavorites } = require('../controllers/favoriteController');
const validate = require('../middleware/validate');
const { favoriteSchema } = require('../validation/userValidation');

// Add to favorites
router.post('/', validate(favoriteSchema), addFavorite);

// Remove from favorites
router.delete('/:eventId', removeFavorite);

// Get user's favorites
router.get('/', getUserFavorites);

module.exports = router;