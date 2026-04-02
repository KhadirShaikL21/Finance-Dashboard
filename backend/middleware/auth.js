const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate user via JWT token
const auth = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.body.token) {
      // Alternative: token in request body (for testing)
      token = req.body.token;
    } else if (req.headers['x-auth-token']) {
      // Alternative: token in custom header
      token = req.headers['x-auth-token'];
    }

    // If no token, return error
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No authentication token, access denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        status: 'error',
        message: 'User account is inactive',
      });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired',
      });
    }
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = auth;
