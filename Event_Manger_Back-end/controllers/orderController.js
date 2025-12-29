// controllers/orderController.js
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const CartItem = require('../models/CartItem');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/email');

const createOrder = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const { items, billing } = req.body;

    // Validate events exist and are published
    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const event = await Event.findById(item.eventId);
      if (!event || event.status !== 'published') {
        return res.status(400).json({ error: `Event ${item.eventId} is not available` });
      }
      totalAmount += event.price * item.quantity;
      orderItems.push({
        eventId: event.id,
        quantity: item.quantity,
        priceAtTime: event.price
      });
    }

    // Create order
    const serviceFee = totalAmount * 0.025; // 2.5%
    const processingFee = 1.50;
    const order = await Order.create({
      userId,
      totalAmount,
      serviceFee,
      processingFee,
      status: 'confirmed'
    });

    // Create order items
    await OrderItem.createMany(order.id, orderItems);

    // Clear user's cart
    await CartItem.clear(userId);

    // Send confirmation email (via Ethereal)
    const emailHtml = `
      <h2>🎉 Order Confirmed!</h2>
      <p>Thank you for your purchase, ${billing.name}!</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Total:</strong> $${(totalAmount + serviceFee + processingFee).toFixed(2)}</p>
    `;
    await sendEmail(billing.email, 'Your EventPro Order Confirmation', emailHtml);

    // Create notification
    await Notification.create({
      userId,
      message: `Order #${order.id} confirmed! Check your email for details.`,
      type: 'success'
    });

    res.status(201).json({ orderId: order.id, total: totalAmount + serviceFee + processingFee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 1;
    const orders = await Order.findByUser(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const items = await OrderItem.findByOrder(order.id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrderById };