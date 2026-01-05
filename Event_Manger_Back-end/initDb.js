// initDb.js
const db = require('./config/db');

const init = async () => {
  try {
    // Users Table
    await db.query(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Events Table
    await db.query(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      date TEXT,
      time TEXT,
      location TEXT,
      venue_name TEXT,
      venue_address TEXT,
      venue_capacity INTEGER,
      price REAL,
      image_url TEXT,
      organizer_id INTEGER,
      status TEXT DEFAULT 'published',
      tags TEXT, -- SQLite handles arrays as strings
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Cart Items Table
    await db.query(`CREATE TABLE IF NOT EXISTS cart_items (
      user_id INTEGER,
      event_id INTEGER,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, event_id)
    )`);

    console.log("Tables created successfully!");
    
    // Create a default user so your frontend works immediately
    await db.query("INSERT OR IGNORE INTO users (id, name, email) VALUES (1, 'Alex Johnson', 'alex@example.com')");
    console.log("Default user created!");

  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

init();
