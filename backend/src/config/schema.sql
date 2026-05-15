-- File ini berisi struktur tabel database kita
-- Jalankan sekali untuk membuat tabel

-- Tabel users: menyimpan data akun pengguna
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,              -- ID unik, otomatis bertambah
  name VARCHAR(100) NOT NULL,         -- Nama pengguna
  email VARCHAR(150) UNIQUE NOT NULL, -- Email (harus unik)
  password VARCHAR(255) NOT NULL,     -- Password (sudah di-hash, bukan teks biasa)
  created_at TIMESTAMP DEFAULT NOW()  -- Waktu akun dibuat
);

-- Tabel logs: menyimpan catatan harian belajar
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Relasi ke tabel users
  title VARCHAR(200) NOT NULL,        -- Judul catatan
  content TEXT,                       -- Isi catatan (bebas panjang)
  mood VARCHAR(20),                   -- Mood belajar: great/good/okay/bad
  tags TEXT[],                        -- Array tag topik: ['React', 'CSS', 'Git']
  study_minutes INTEGER DEFAULT 0,    -- Durasi belajar dalam menit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
