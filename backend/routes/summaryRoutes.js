const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { readLimiter } = require('../middleware/rateLimit');
const {
  getTotals,
  getByCategory,
  getMonthlyTrends,
  getRecentActivity,
  getDashboardSummary,
  getViewerInsights,
  getAnalystInsights,
} = require('../controllers/summaryController');

// Public endpoint (no authentication required but with rate limiting)
router.get('/viewer-insights', readLimiter, getViewerInsights);

// All authenticated users (Viewer, Analyst, Admin) can see the shared dashboard
router.use(auth);

// Dashboard endpoints - accessible to all authenticated roles with read rate limiting
router.get('/totals', readLimiter, getTotals);
router.get('/by-category', readLimiter, getByCategory);
router.get('/monthly', readLimiter, getMonthlyTrends);
router.get('/recent', readLimiter, getRecentActivity);
router.get('/dashboard', readLimiter, getDashboardSummary);

// Analyst-specific endpoints (Analyst, Admin only) with read rate limiting
router.get('/analyst-insights', readLimiter, roleCheck(['analyst', 'admin']), getAnalystInsights);

module.exports = router;
