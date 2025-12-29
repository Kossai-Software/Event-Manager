// routes/cart.js
const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const validate = require('../middleware/validate');
const { cartItemSchema } = require('../validation/orderValidation');

router.get('/', getCart);
router.post('/', validate(cartItemSchema), addToCart);
router.put('/:eventId', validate(cartItemSchema), updateCartItem);
router.delete('/:eventId', removeFromCart);

module.exports = router;