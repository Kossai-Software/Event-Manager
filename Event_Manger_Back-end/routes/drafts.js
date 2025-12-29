// routes/drafts.js
const express = require('express');
const router = express.Router();
const { getDrafts, publishDraft } = require('../controllers/draftController');
const validate = require('../middleware/validate');
const { createEventSchema } = require('../validation/eventValidation');
const upload = require('../middleware/upload');

// Get all drafts for current user
router.get('/', getDrafts);

// Create a new draft (status = 'draft')
router.post('/', upload.single('image'), validate(createEventSchema), (req, res, next) => {
  // Force status to 'draft'
  req.body.status = 'draft';
  next();
}, require('../controllers/eventController').createEvent);

// Publish a draft → update status to 'published'
router.patch('/:id/publish', publishDraft);

module.exports = router;