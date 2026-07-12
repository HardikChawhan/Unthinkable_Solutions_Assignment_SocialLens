'use strict';

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const config = require('../config');
const { httpLogger, log } = require('../utils/logger');

/**
 * Applies all security and common middleware to the Express app.
 * Extracted into a single function so server.js stays lean.
 *
 * @param {import('express').Application} app
 */
function applySecurity(app) {
  // Disable the default X-Powered-By header to avoid fingerprinting
  app.disable('x-powered-by');

  // ---------------------------------------------------------------------------
  // Helmet — sets security-focused HTTP response headers
  // ---------------------------------------------------------------------------
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow third-party embeds if needed
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      hsts: {
        maxAge: 31536000,       // 1 year
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // ---------------------------------------------------------------------------
  // CORS — whitelist origins from config
  // ---------------------------------------------------------------------------
  const corsOptions = {
    origin(origin, callback) {
      // Allow non-browser tools (Postman, curl), whitelisted origins, and any local dev server
      if (!origin || config.corsOrigin.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      log.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error(`CORS policy: origin ${origin} is not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Request-ID',
      'X-Client',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['X-Request-ID', 'X-Client'],
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Pre-flight for all routes

  // ---------------------------------------------------------------------------
  // Rate limiting — protects against brute-force and DoS
  // ---------------------------------------------------------------------------
  const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,   // Disable `X-RateLimit-*` headers
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    },
    skip(req) {
      // Never rate-limit health checks
      return req.path === '/api/health';
    },
  });

  app.use(limiter);

  // ---------------------------------------------------------------------------
  // Body parsers — strict size limits prevent large payload attacks
  // ---------------------------------------------------------------------------
  app.use(compression());
  app.use(require('express').json({ limit: '1mb' }));
  app.use(require('express').urlencoded({ extended: true, limit: '1mb' }));

  // ---------------------------------------------------------------------------
  // HTTP request logging via Morgan
  // ---------------------------------------------------------------------------
  app.use(httpLogger);
}

module.exports = applySecurity;
