// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cloud Kitchen API is running',
    timestamp: new Date().toISOString(),
    database: 'Oracle Database Connected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Cloud Kitchen Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      menu: '/api/menu',
      orders: '/api/orders',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection pool
    await db.initialize();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('=========================================');
      console.log('🚀 Cloud Kitchen API Server Started');
      console.log('=========================================');
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`🔗 API Endpoints:`);
      console.log(`   - Health: http://localhost:${PORT}/api/health`);
      console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
      console.log(`   - Menu: http://localhost:${PORT}/api/menu`);
      console.log(`   - Orders: http://localhost:${PORT}/api/orders`);
      console.log('=========================================');
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Shutting down gracefully...');
  await db.close();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();