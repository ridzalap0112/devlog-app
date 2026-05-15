const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Route publik — tidak perlu login
router.post('/register', register);
router.post('/login', login);

// Route privat — harus login dulu (pakai authMiddleware sebagai "satpam")
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
