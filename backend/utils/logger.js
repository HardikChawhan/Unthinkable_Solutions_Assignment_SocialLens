'use strict';

const morgan = require('morgan');

/**
 * Returns a formatted ISO timestamp string for log prefixes.
 */
function timestamp() {
  return new Date().toISOString();
}

/**
 * Simple structured logger with info / warn / error levels.
 * Outputs to stdout with a timestamp prefix so logs are easy to parse
 * by log-aggregation tools (Datadog, CloudWatch, etc.).
 */
const log = {
  info(message, ...args) {
    console.log(`[${timestamp()}] [INFO]  ${message}`, ...args);
  },

  warn(message, ...args) {
    console.warn(`[${timestamp()}] [WARN]  ${message}`, ...args);
  },

  error(message, ...args) {
    console.error(`[${timestamp()}] [ERROR] ${message}`, ...args);
  },
};

/**
 * Custom write stream so Morgan's output goes through our logger
 * rather than calling process.stdout.write directly.
 */
const morganStream = {
  write(message) {
    // Morgan appends a newline — trim it before passing to our logger.
    log.info(message.trimEnd());
  },
};

/**
 * Pre-configured Morgan HTTP request logger middleware.
 * Use 'dev' format in development for coloured output, 'combined'
 * (Apache-style) in production for maximum detail.
 */
const httpLogger = morgan('combined', { stream: morganStream });

module.exports = { httpLogger, log };
