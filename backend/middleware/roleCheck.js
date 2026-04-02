// Role-based access control middleware
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      // Convert single role to array for consistent checking
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Check if user has required role
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  };
};

module.exports = roleCheck;
