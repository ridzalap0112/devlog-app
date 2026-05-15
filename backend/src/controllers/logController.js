const pool = require('../config/database');

// GET ALL LOGS — Ambil semua catatan milik user yang login
const getAllLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM logs WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET ONE LOG — Ambil satu catatan berdasarkan ID
const getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM logs WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// CREATE LOG — Buat catatan baru
const createLog = async (req, res) => {
  try {
    const { title, content, mood, tags, study_minutes } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Judul wajib diisi.' });
    }

    const result = await pool.query(
      `INSERT INTO logs (user_id, title, content, mood, tags, study_minutes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, title, content, mood, tags, study_minutes || 0]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// UPDATE LOG — Edit catatan yang sudah ada
const updateLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, mood, tags, study_minutes } = req.body;

    const result = await pool.query(
      `UPDATE logs SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        mood = COALESCE($3, mood),
        tags = COALESCE($4, tags),
        study_minutes = COALESCE($5, study_minutes),
        updated_at = NOW()
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [title, content, mood, tags, study_minutes, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE LOG — Hapus catatan
const deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM logs WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan.' });
    }

    res.json({ success: true, message: 'Catatan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAllLogs, getLogById, createLog, updateLog, deleteLog };
