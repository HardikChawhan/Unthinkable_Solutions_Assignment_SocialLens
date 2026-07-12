'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { v4: uuidv4 } = require('uuid');
const { log } = require('./logger');

const unlinkAsync = promisify(fs.unlink);

/**
 * Strips dangerous characters from a filename and prevents path traversal.
 * Preserves the original file extension.
 *
 * @param {string} filename - Original filename from the client.
 * @returns {string} Safe filename.
 */
function sanitizeFilename(filename) {
  if (!filename || typeof filename !== 'string') return 'file';

  // Extract extension first, then sanitize basename separately
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext);

  // Remove path separators, null bytes, and other dangerous sequences.
  // Allow only alphanumerics, hyphens, underscores, and dots.
  const safeBase = basename
    .replace(/\.\./g, '')          // prevent path traversal
    .replace(/[^a-zA-Z0-9_\-. ]/g, '_') // replace forbidden chars
    .replace(/\s+/g, '_')          // collapse spaces
    .replace(/^[._]+/, '')         // no leading dots or underscores
    .slice(0, 200)                 // cap length
    || 'file';

  // Allow only known safe extensions
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
  const safeExt = allowedExtensions.includes(ext) ? ext : '';

  return `${safeBase}${safeExt}`;
}

/**
 * Maps a MIME type to a processing category.
 *
 * @param {string} mimeType
 * @returns {'pdf' | 'image' | 'unsupported'}
 */
function getMimeCategory(mimeType) {
  if (!mimeType) return 'unsupported';

  const normalized = mimeType.toLowerCase().trim();

  if (normalized === 'application/pdf') return 'pdf';
  if (['image/jpeg', 'image/jpg', 'image/png'].includes(normalized)) return 'image';

  return 'unsupported';
}

/**
 * Safely deletes a file from disk.
 * Logs a warning if deletion fails rather than throwing, so cleanup
 * errors never mask the real business error.
 *
 * @param {string} filePath - Absolute or relative path to the file.
 */
async function cleanupFile(filePath) {
  if (!filePath) return;

  try {
    await unlinkAsync(filePath);
    log.info(`Cleaned up temp file: ${filePath}`);
  } catch (err) {
    // ENOENT means the file was already gone — not an error worth logging loudly.
    if (err.code !== 'ENOENT') {
      log.warn(`Failed to clean up file ${filePath}: ${err.message}`);
    }
  }
}

/**
 * Converts a byte count into a human-readable string.
 *
 * @param {number} bytes
 * @returns {string} E.g. '2.4 MB', '512 KB'
 */
function formatBytes(bytes) {
  if (typeof bytes !== 'number' || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);

  // Show one decimal place for KB and above
  const formatted = exponent === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${formatted} ${units[exponent]}`;
}

/**
 * Generates a unique filename by prepending a UUID to the sanitized original name.
 * Safe to use as a Multer `filename` callback result.
 *
 * @param {string} originalName - The original filename from the client.
 * @returns {string} Unique filename, e.g. '550e8400-e29b-41d4-a716-446655440000-my_file.pdf'
 */
function generateUniqueFilename(originalName) {
  const safe = sanitizeFilename(originalName);
  return `${uuidv4()}-${safe}`;
}

module.exports = {
  sanitizeFilename,
  getMimeCategory,
  cleanupFile,
  formatBytes,
  generateUniqueFilename,
};
