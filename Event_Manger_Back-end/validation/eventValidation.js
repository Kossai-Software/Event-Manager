// validation/eventValidation.js
const Joi = require('joi');

const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Title must be at least 3 characters',
    'string.max': 'Title cannot exceed 100 characters',
    'any.required': 'Title is required'
  }),
  description: Joi.string().max(1000).optional(),
  category: Joi.string()
    .valid('Technology', 'Business', 'Entertainment', 'Healthcare', 'Marketing', 'Education', 'Sports')
    .required(),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  location: Joi.string().max(200).required(),
  venue_name: Joi.string().max(100).required(),
  venue_address: Joi.string().max(300).required(),
  venue_capacity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
  organizer_id: Joi.number().integer().required(),
  tags: Joi.array().items(Joi.string().max(30)).max(10).optional(),
  status: Joi.string().valid('draft', 'published').default('published')
});

module.exports = { createEventSchema };