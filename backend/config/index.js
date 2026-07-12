'use strict';

/**
 * Central configuration module.
 * All environment variables are validated and defaulted here.
 * Import this module instead of reading process.env directly anywhere else.
 */

const config = {
  /** Server */
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  /**
   * CORS allowed origins.
   * Supports comma-separated values: "http://localhost:5173,https://app.example.com"
   */
  corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  /** OpenAI */
  openaiApiKey: process.env.OPENAI_API_KEY || '',

  /** File upload */
  maxFileSizeMb: parseFloat(process.env.MAX_FILE_SIZE_MB) || 10,

  /** Rate limiting */
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  /** Upload directory (relative to project root) */
  uploadDir: 'uploads/',
};

module.exports = config;
