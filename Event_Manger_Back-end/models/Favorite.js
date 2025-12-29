// models/Event.js
const db = require('../config/db');

class Event {
  static async create(data) {
    const {
      title, description, category, date, time, location,
      venue_name, venue_address, venue_capacity, price,
      image_url, organizer_id, tags = [], status = 'published'
    } = data;

    const result = await db.query(
      `INSERT INTO events (
        title, description, category, date, time, location,
        venue_name, venue_address, venue_capacity, price,
        image_url, organizer_id, tags, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [title, description, category, date, time, location,
       venue_name, venue_address, venue_capacity, price,
       image_url, organizer_id, tags, status]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    let index = 1;

    if (filters.category && filters.category !== 'All') {
      query += ` AND category = $${index++}`;
      params.push(filters.category);
    }
    if (filters.price === 'Free') query += ' AND price = 0';
    if (filters.price === 'Paid') query += ' AND price > 0';
    if (filters.featured === 'true') query += ' AND featured = true';
    if (filters.search) {
      query += ` AND (title ILIKE $${index} OR location ILIKE $${index})`;
      params.push(`%${filters.search}%`);
      index++;
    }
    if (filters.organizerId) {
      query += ` AND organizer_id = $${index++}`;
      params.push(filters.organizerId);
    }
    if (filters.status) {
      query += ` AND status = $${index++}`;
      params.push(filters.status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const {
      title, description, category, date, time, location,
      venue_name, venue_address, venue_capacity, price,
      image_url, tags, status
    } = data;

    // Build dynamic SET clause
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) { fields.push(`title = $${paramIndex++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description = $${paramIndex++}`); values.push(description); }
    if (category !== undefined) { fields.push(`category = $${paramIndex++}`); values.push(category); }
    if (date !== undefined) { fields.push(`date = $${paramIndex++}`); values.push(date); }
    if (time !== undefined) { fields.push(`time = $${paramIndex++}`); values.push(time); }
    if (location !== undefined) { fields.push(`location = $${paramIndex++}`); values.push(location); }
    if (venue_name !== undefined) { fields.push(`venue_name = $${paramIndex++}`); values.push(venue_name); }
    if (venue_address !== undefined) { fields.push(`venue_address = $${paramIndex++}`); values.push(venue_address); }
    if (venue_capacity !== undefined) { fields.push(`venue_capacity = $${paramIndex++}`); values.push(venue_capacity); }
    if (price !== undefined) { fields.push(`price = $${paramIndex++}`); values.push(price); }
    if (image_url !== undefined) { fields.push(`image_url = $${paramIndex++}`); values.push(image_url); }
    if (tags !== undefined) { fields.push(`tags = $${paramIndex++}`); values.push(tags); }
    if (status !== undefined) { fields.push(`status = $${paramIndex++}`); values.push(status); }

    if (fields.length === 0) {
      return await this.findById(id);
    }

    values.push(id); // for WHERE clause
    const query = `UPDATE events SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      `UPDATE events SET status = 'archived' WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Event;