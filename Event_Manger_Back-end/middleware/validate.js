// middleware/validate.js
const Joi = require('joi');

// This middleware factory takes a Joi schema and returns Express middleware
const validate = (schema) => {
  return (req, res, next) => {
    // Validate request body (you can extend to validate params/query too)
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: 'Validation failed', details: errorMessage });
    }

    next(); // validation passed
  };
};

module.exports = validate;