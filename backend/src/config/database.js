const { Pool } = require('pg');
require('dotenv').config();

// Pool = kumpulan koneksi ke database
// Bayangkan seperti antrian kasir — bisa layani banyak request sekaligus
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test koneksi saat pertama kali app dijalankan
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
  } else {
    console.log('✅ Database terhubung!');
    release();
  }
});

module.exports = pool;
