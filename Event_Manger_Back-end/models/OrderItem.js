// models/OrderItem.js
const db = require('../config/db');

class OrderItem {
  static async createMany(orderId, items) {
    // items = [{ event_id, quantity, price_at_time }]
    const values = items.map(item => [orderId, item.eventId, item.quantity, item.priceAtTime]).flat();
    const placeholders = items.map((_, i) => 
      `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
    ).join(', ');

    const result = await db.query(
      `INSERT INTO order_items (order_id, event_id, quantity, price_at_time)
       VALUES ${placeholders}
       RETURNING *`,
      values
    );
    return result.rows;
  }

  static async findByOrder(orderId) {
    const result = await db.query(
      `SELECT oi.*, e.title, e.image_url, e.date, e.time, e.location
       FROM order_items oi
       INNER JOIN events e ON oi.event_id = e.id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    return result.rows;
  }
}

module.exports = OrderItem;