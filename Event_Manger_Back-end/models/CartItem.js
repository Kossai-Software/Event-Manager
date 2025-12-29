// models/CartItem.js
const db = require('../config/db');

class CartItem {
  static async add(userId, eventId, quantity = 1) {
    const result = await db.query(
      `INSERT INTO cart_items (user_id, event_id, quantity) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, event_id) 
       DO UPDATE SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [userId, eventId, quantity]
    );
    return result.rows[0];
  }

  static async update(userId, eventId, quantity) {
    const result = await db.query(
      `UPDATE cart_items 
       SET quantity = $3, created_at = NOW() 
       WHERE user_id = $1 AND event_id = $2 
       RETURNING *`,
      [userId, eventId, quantity]
    );
    return result.rows[0];
  }

  static async remove(userId, eventId) {
    await db.query('DELETE FROM cart_items WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
  }

  static async findByUser(userId) {
    const result = await db.query(
      `SELECT ci.*, e.title, e.price, e.image_url, e.date, e.time, e.location
       FROM cart_items ci
       INNER JOIN events e ON ci.event_id = e.id
       WHERE ci.user_id = $1 AND e.status = 'published'`,
      [userId]
    );
    return result.rows;
  }

  static async clear(userId) {
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  }
}

module.exports = CartItem;