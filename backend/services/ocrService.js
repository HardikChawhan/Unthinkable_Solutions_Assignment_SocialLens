'use strict';

const { createWorker } = require('tesseract.js');
const { log } = require('../utils/logger');

/** Minimum acceptable OCR confidence (percentage) before we warn the caller */
const LOW_CONFIDENCE_THRESHOLD = 40;

/**
 * Extracts text from an image file using Tesseract OCR.
 *
 * @param {string} filePath - Absolute or relative path to the image on disk.
 * @returns {Promise<{ text: string, confidence: number }>}
 *   - text: extracted text (may be empty string if nothing recognised)
 *   - confidence: 0-100 percentage reported by Tesseract
 * @throws {Error} If Tesseract itself fails (worker crash, corrupt image, etc.)
 */
async function extractFromImage(filePath) {
  let worker;

  try {
    // Create a fresh worker for every request so there are no state-leak issues
    // under concurrent requests.
    worker = await createWorker('eng', 1, {
      // Suppress verbose Tesseract logs in production
      logger: () => {},
    });

    const { data } = await worker.recognize(filePath);

    const rawText = data.text || '';
    const confidence = Math.round(data.confidence || 0);

    // Clean up OCR artefacts: excessive blank lines and trailing whitespace
    const cleanedText = rawText
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .trim();

    if (confidence < LOW_CONFIDENCE_THRESHOLD) {
      log.warn(
        `Low OCR confidence (${confidence}%) for ${filePath}. ` +
          `Results may be inaccurate. Consider using a higher-resolution image.`
      );
    } else {
      log.info(`OCR completed: confidence=${confidence}%, chars=${cleanedText.length} — ${filePath}`);
    }

    return {
      text: cleanedText,
      confidence,
      lowConfidence: confidence < LOW_CONFIDENCE_THRESHOLD,
    };
  } catch (err) {
    log.error(`Tesseract OCR failed on ${filePath}: ${err.message}`);
    const error = new Error(
      `OCR processing failed: ${err.message}. ` +
        `Ensure the uploaded image is clear and not corrupted.`
    );
    error.code = 'OCR_PROCESSING_ERROR';
    error.statusCode = 422;
    throw error;
  } finally {
    // Always terminate the worker to free memory regardless of success/failure
    if (worker) {
      try {
        await worker.terminate();
      } catch (terminateErr) {
        log.warn(`Failed to terminate Tesseract worker: ${terminateErr.message}`);
      }
    }
  }
}

module.exports = { extractFromImage };
