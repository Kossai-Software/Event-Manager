// models/Order.js
const db = require('../config/db');

class Order {
  static async create({ userId, totalAmount, serviceFee, processingFee, status = 'confirmed' }) {
    const result = await db.query(
      `INSERT INTO orders (user_id, total_amount, service_fee, processing_fee, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, totalAmount, serviceFee, processingFee, status]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await db.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    return result.rows[0];
  }
}

module.exports = Order;