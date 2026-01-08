import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config();

import { initDatabase } from './db/init.js';
import searchRoutes from './routes/search.js';
import userRoutes from './routes/users.js';
import alertRoutes from './routes/alerts.js';
import webhookRoutes from './routes/webhooks.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
try {
  initDatabase();
  console.log('Database initialized');
} catch (error) {
  console.error('Failed to initialize database:', error);
}

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
}));

// Parse JSON bodies (except for webhooks which need raw body)
app.use((req, res, next) => {
  if (req.originalUrl === '/webhooks/stripe') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/v1/search', searchRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/alerts', alertRoutes);
app.use('/webhooks', webhookRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      code: err.code || 'INTERNAL_ERROR',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Not found',
      code: 'NOT_FOUND',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
