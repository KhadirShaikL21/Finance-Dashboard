require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const { generalLimiter, authLimiter, createLimiter, readLimiter } = require('./middleware/rateLimit');

// Import routes
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const summaryRoutes = require('./routes/summaryRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all API routes
app.use('/api/', generalLimiter);

// Health check route (no rate limiting)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '✅ Finance Dashboard Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Finance Dashboard Backend',
    version: '1.0.0',
    documentation: 'POST /api/users/register or POST /api/users/login to get started',
    endpoints: {
      users: '/api/users',
      records: '/api/records',
      summary: '/api/summary',
    },
  });
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/summary', summaryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Finance Dashboard Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`📚 API Routes:`);
  console.log(`   - Users: POST /api/users/register or POST /api/users/login`);
  console.log(`   - Records: /api/records`);
  console.log(`   - Summary: /api/summary\n`);
});

module.exports = app;
