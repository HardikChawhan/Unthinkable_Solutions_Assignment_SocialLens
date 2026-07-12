'use strict';

const { getMimeCategory, cleanupFile } = require('../utils/fileUtils');
const { extractFromPdf } = require('./pdfService');
const { extractFromImage } = require('./ocrService');
const { log } = require('../utils/logger');

/**
 * Orchestrates file-type detection and routes to the correct extraction service.
 * Always cleans up the temporary file when done, even on failure.
 *
 * @param {string} filePath  - Path to the uploaded file on disk.
 * @param {string} mimeType  - MIME type reported by Multer (from the Accept header + magic bytes).
 * @returns {Promise<{
 *   text: string,
 *   metadata: {
 *     mimeType: string,
 *     category: 'pdf' | 'image',
 *     pageCount?: number,
 *     info?: object,
 *     confidence?: number,
 *     lowConfidence?: boolean
 *   }
 * }>}
 * @throws {Error} If the MIME type is unsupported or the underlying service throws.
 */
async function extract(filePath, mimeType) {
  const category = getMimeCategory(mimeType);

  if (category === 'unsupported') {
    const err = new Error(
      `Unsupported file type "${mimeType}". Only PDF and images (JPEG, PNG) are accepted.`
    );
    err.code = 'UNSUPPORTED_MIME_TYPE';
    err.statusCode = 400;
    // Still clean up the file that was already saved to disk
    await cleanupFile(filePath);
    throw err;
  }

  log.info(`Extracting text from ${category} file: ${filePath}`);

  try {
    if (category === 'pdf') {
      const { text, pageCount, info } = await extractFromPdf(filePath);
      return {
        text,
        metadata: {
          mimeType,
          category,
          pageCount,
          info,
        },
      };
    }

    // category === 'image'
    const { text, confidence, lowConfidence } = await extractFromImage(filePath);
    return {
      text,
      metadata: {
        mimeType,
        category,
        confidence,
        lowConfidence,
      },
    };
  } finally {
    // Clean up the temporary file regardless of success or failure.
    // Errors from cleanupFile are logged but not re-thrown.
    await cleanupFile(filePath);
  }
}

module.exports = { extract };
