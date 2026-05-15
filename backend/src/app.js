const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();

// Middleware global
app.use(cors());                    // Izinkan request dari frontend (beda port)
app.use(express.json());            // Parse body JSON otomatis

// Routes — semua API diawali /api
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);

// Route test — untuk cek apakah server hidup
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 DevLog API berjalan!',
    timestamp: new Date()
  });
});

// Handler jika route tidak ditemukan
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route tidak ditemukan.' });
});

module.exports = app;
