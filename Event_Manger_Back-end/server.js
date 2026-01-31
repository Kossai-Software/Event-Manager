// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, process.env.UPLOADS_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const app = express();

// Middleware - Update CORS for production
const allowedOrigins = [
  'http://localhost:5173', // Local development
  /\.vercel\.app$/ // Allow all Vercel preview deployments
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.some(allowed => 
      (typeof allowed === 'string' && allowed === origin) || 
      (allowed instanceof RegExp && allowed.test(origin))
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir)); // serve uploaded files

// Routes
app.use('/api/events', require('./routes/events'));
app.use('/api/users', require('./routes/users'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/drafts', require('./routes/drafts'));

// Test route
app.get('/', (req, res) => res.json({ message: 'EventPro Backend Running!' }));

// CRITICAL: Remove app.listen() for Vercel
// Vercel handles the server lifecycle automatically

module.exports = app;
