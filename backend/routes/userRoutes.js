const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { authLimiter } = require('../middleware/rateLimit');
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
} = require('../controllers/userController');

// Public routes with strict rate limiting
router.post('/register', authLimiter, createUser);
router.post('/login', authLimiter, loginUser);

// Private routes (require authentication)
router.get('/profile/me', auth, getCurrentUserProfile);

// Admin routes
router.get('/', auth, roleCheck('admin'), getAllUsers);
router.get('/:id', auth, roleCheck('admin'), getUserById);
router.put('/:id', auth, roleCheck('admin'), updateUser);
router.delete('/:id', auth, roleCheck('admin'), deleteUser);

module.exports = router;
