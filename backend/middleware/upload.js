'use strict';

const path = require('path');
const multer = require('multer');
const config = require('../config');
const { generateUniqueFilename } = require('../utils/fileUtils');
const { log } = require('../utils/logger');

/** MIME types accepted by the platform */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];

// ---------------------------------------------------------------------------
// Multer disk storage configuration
// ---------------------------------------------------------------------------
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, config.uploadDir);
  },

  filename(_req, file, cb) {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  },
});

// ---------------------------------------------------------------------------
// File filter — reject unsupported MIME types immediately
// ---------------------------------------------------------------------------
function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }

  log.warn(`Rejected upload — unsupported MIME type: ${file.mimetype}`);

  // Passing an error (not null) with cb tells Multer to reject the file.
  // We attach a custom flag so the error handler can return a 400 response.
  const err = new Error(
    `Unsupported file type "${file.mimetype}". ` +
      `Allowed types: JPEG, PNG, PDF.`
  );
  err.code = 'UNSUPPORTED_FILE_TYPE';
  err.statusCode = 400;
  cb(err, false);
}

// ---------------------------------------------------------------------------
// Multer instance
// ---------------------------------------------------------------------------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024,
    files: 1, // Only one file per request
  },
});

/**
 * Single-file upload middleware that reads from the 'file' field.
 */
const uploadSingle = upload.single('file');

/**
 * Error-handling middleware that must come directly after uploadSingle.
 * Catches Multer-specific errors and converts them to a friendly JSON response.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function handleMulterError(err, req, res, next) {
  if (!err) return next();

  // MulterError has a `code` property such as LIMIT_FILE_SIZE, LIMIT_UNEXPECTED_FILE
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: `File too large. Maximum allowed size is ${config.maxFileSizeMb} MB.`,
      LIMIT_FILE_COUNT: 'Only one file can be uploaded at a time.',
      LIMIT_UNEXPECTED_FILE: 'Unexpected field name. Use the field name "file".',
      LIMIT_PART_COUNT: 'Too many parts in the multipart form.',
    };

    return res.status(400).json({
      success: false,
      error: {
        code: err.code,
        message: messages[err.code] || `Upload error: ${err.message}`,
      },
    });
  }

  // Custom errors thrown from fileFilter
  if (err.code === 'UNSUPPORTED_FILE_TYPE') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'UNSUPPORTED_FILE_TYPE',
        message: err.message,
      },
    });
  }

  // Pass any other errors to the global error handler
  next(err);
}

module.exports = { uploadSingle, handleMulterError };
