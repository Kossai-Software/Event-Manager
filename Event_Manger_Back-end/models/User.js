// models/User.js
const db = require('../config/db');

class User {
  static async findById(id) {
    const result = await db.query('SELECT id, name, email, avatar_url FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, { name, avatar_url }) {
    const result = await db.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           avatar_url = COALESCE($2, avatar_url),
           updated_at = NOW()
       WHERE id = $3 
       RETURNING id, name, email, avatar_url`,
      [name, avatar_url, id]
    );
    return result.rows[0];
  }

  // For dev: ensure user exists (since no real signup)
  static async ensureUserExists(id = 1) {
    const user = await this.findById(id);
    if (!user) {
      const result = await db.query(
        `INSERT INTO users (id, name, email) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (id) DO NOTHING 
         RETURNING *`,
        [id, 'Alex Johnson', 'alex@example.com']
      );
      return result.rows[0] || { id, name: 'Alex Johnson', email: 'alex@example.com' };
    }
    return user;
  }
}

module.exports = User;