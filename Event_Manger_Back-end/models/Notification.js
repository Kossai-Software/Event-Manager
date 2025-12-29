// models/Notification.js
const db = require('../config/db');

class Notification {
  static async create({ userId, message, type = 'info' }) {
    const result = await db.query(
      `INSERT INTO notifications (user_id, message, type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, message, type]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await db.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async markAsRead(id) {
    await db.query('UPDATE notifications SET read = true WHERE id = $1', [id]);
  }

  static async markAllAsRead(userId) {
    await db.query('UPDATE notifications SET read = true WHERE user_id = $1', [userId]);
  }

  static async delete(id) {
    await db.query('DELETE FROM notifications WHERE id = $1', [id]);
  }
}

module.exports = Notification;