'use strict';

// Load environment variables from .env before any other imports
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');

const config = require('./config');
const applySecurity = require('./middleware/security');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { log } = require('./utils/logger');

// ---------------------------------------------------------------------------
// Bootstrap uploads directory
// ---------------------------------------------------------------------------
const uploadDirPath = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadDirPath)) {
  fs.mkdirSync(uploadDirPath, { recursive: true });
  log.info(`Created upload directory: ${uploadDirPath}`);
}

// ---------------------------------------------------------------------------
// Create Express application
// ---------------------------------------------------------------------------
const app = express();

// ---------------------------------------------------------------------------
// Security, compression, logging, body-parsing middleware
// ---------------------------------------------------------------------------
applySecurity(app);

// ---------------------------------------------------------------------------
// Application routes — mounted at /api and / for maximum compatibility
// ---------------------------------------------------------------------------
app.use('/api', routes);
app.use('/', routes);

// ---------------------------------------------------------------------------
// 404 handler — catches any request that didn't match a route
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested endpoint does not exist.',
    },
  });
});

// ---------------------------------------------------------------------------
// Global error handler — must be registered last
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const server = app.listen(config.port, () => {
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log.info(`  SocialLens API — Social Media Content Analyzer`);
  log.info(`  Environment : ${config.nodeEnv}`);
  log.info(`  Port        : ${config.port}`);
  log.info(`  CORS origins: ${config.corsOrigin.join(', ')}`);
  log.info(`  OpenAI      : ${config.openaiApiKey ? '✅ enabled' : '⚠️  disabled (rule-based fallback)'}`);
  log.info(`  Upload dir  : ${uploadDirPath}`);
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// ---------------------------------------------------------------------------
// Graceful shutdown on SIGTERM / SIGINT (e.g. Docker stop, Ctrl+C)
// ---------------------------------------------------------------------------
function shutdown(signal) {
  log.info(`Received ${signal} — shutting down gracefully...`);
  server.close(() => {
    log.info('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force exit if server hasn't closed within 10 seconds
  setTimeout(() => {
    log.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Log unhandled promise rejections so they never silently disappear
process.on('unhandledRejection', (reason) => {
  log.error(`Unhandled promise rejection: ${reason}`);
});

process.on('uncaughtException', (err) => {
  log.error(`Uncaught exception: ${err.stack || err.message}`);
  process.exit(1);
});

module.exports = app; // exported for testing
