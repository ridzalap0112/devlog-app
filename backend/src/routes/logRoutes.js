const express = require('express');
const router = express.Router();
const {
  getAllLogs,
  getLogById,
  createLog,
  updateLog,
  deleteLog,
} = require('../controllers/logController');
const authMiddleware = require('../middleware/auth');

// Semua route logs butuh autentikasi
router.use(authMiddleware);

router.get('/', getAllLogs);      // GET    /api/logs
router.get('/:id', getLogById);  // GET    /api/logs/1
router.post('/', createLog);     // POST   /api/logs
router.put('/:id', updateLog);   // PUT    /api/logs/1
router.delete('/:id', deleteLog);// DELETE /api/logs/1

module.exports = router;
