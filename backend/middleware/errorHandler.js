'use strict';

const { validationResult } = require('express-validator');
const config = require('../config');
const { log } = require('../utils/logger');

/**
 * Global error-handling middleware (must be registered with 4 arguments).
 * Normalises every error type into a consistent JSON envelope so the client
 * always receives: { success: false, error: { code, message, details? } }
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next - Required by Express signature, even if unused.
 */
function errorHandler(err, req, res, _next) {
  // Always log the full error server-side
  log.error(`[${req.method} ${req.path}] ${err.stack || err.message}`);

  const isProd = config.nodeEnv === 'production';

  // ---------------------------------------------------------------------------
  // express-validator ValidationError
  // ---------------------------------------------------------------------------
  if (err.type === 'validation') {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed.',
        details: err.details || [],
      },
    });
  }

  // ---------------------------------------------------------------------------
  // SyntaxError — malformed JSON body
  // ---------------------------------------------------------------------------
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'The request body contains invalid JSON.',
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Known application errors carrying an explicit statusCode
  // ---------------------------------------------------------------------------
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'APP_ERROR',
        message: err.message || 'An application error occurred.',
        ...(err.details && !isProd ? { details: err.details } : {}),
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Generic / unhandled errors
  // ---------------------------------------------------------------------------
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd
        ? 'An unexpected error occurred. Please try again later.'
        : err.message || 'Internal server error.',
      ...(!isProd && err.stack ? { stack: err.stack } : {}),
    },
  });
}

/**
 * Utility: Run express-validator checks and forward any failures as a
 * structured validation error to the global error handler.
 *
 * Usage in a controller:
 *   const errors = extractValidationErrors(req);
 *   if (errors) return next(errors);
 *
 * @param {import('express').Request} req
 * @returns {null | Error} null if valid, Error object if not
 */
function extractValidationErrors(req) {
  const result = validationResult(req);
  if (result.isEmpty()) return null;

  const err = new Error('Validation failed');
  err.type = 'validation';
  err.details = result.array().map((e) => ({
    field: e.path || e.param,
    message: e.msg,
    value: e.value,
  }));
  return err;
}

module.exports = { errorHandler, extractValidationErrors };
