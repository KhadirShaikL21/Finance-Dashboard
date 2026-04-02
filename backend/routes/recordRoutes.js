const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { createLimiter, readLimiter } = require('../middleware/rateLimit');
const {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');

// All routes require authentication
router.use(auth);

// Read endpoints for all authenticated users (with moderate rate limiting)
router.get('/', readLimiter, getAllRecords);
router.get('/:id', readLimiter, getRecordById);

// Write endpoints for Admin ONLY (with create rate limiting)
router.post('/', createLimiter, roleCheck('admin'), createRecord);
router.put('/:id', createLimiter, roleCheck('admin'), updateRecord);
router.delete('/:id', createLimiter, roleCheck('admin'), deleteRecord);

module.exports = router;
