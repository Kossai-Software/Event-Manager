// routes/users.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const upload = require('../middleware/upload');

router.get('/:id', getUserProfile);
router.patch('/:id', upload.single('avatar'), updateUserProfile);

module.exports = router;