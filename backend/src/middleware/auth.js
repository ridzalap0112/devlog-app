const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware = fungsi yang berjalan DI ANTARA request masuk dan handler
// Seperti satpam yang cek ID sebelum kamu boleh masuk gedung
const authMiddleware = (req, res, next) => {
  // Ambil token dari header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token tidak ditemukan.',
    });
  }

  try {
    // Verifikasi token — apakah valid dan belum expired?
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user ke request
    next(); // Lanjut ke handler berikutnya
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token tidak valid atau sudah expired.',
    });
  }
};

module.exports = authMiddleware;
