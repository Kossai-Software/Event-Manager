const Joi = require('joi');

const cartItemSchema = Joi.object({
  eventId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).max(10).default(1)
});

const checkoutSchema = Joi.object({
  items: Joi.array().items(cartItemSchema).min(1).required(),
  billing: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required()
  }).required()
});

module.exports = { cartItemSchema, checkoutSchema };