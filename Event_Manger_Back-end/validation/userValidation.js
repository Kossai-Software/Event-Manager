const Joi = require('joi');
const favoriteSchema = Joi.object({
  eventId: Joi.number().integer().required()
});
module.exports = { favoriteSchema };