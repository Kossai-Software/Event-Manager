// routes/orders.js
const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrderById } = require('../controllers/orderController');
const validate = require('../middleware/validate');
const { checkoutSchema } = require('../validation/orderValidation');

// Create new order (checkout)
router.post('/', validate(checkoutSchema), createOrder);

// Get user's order history
router.get('/', getUserOrders);

// Get single order
router.get('/:id', getOrderById);

module.exports = router;