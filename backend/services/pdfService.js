'use strict';

const fs = require('fs');
const pdfParse = require('pdf-parse');
const { log } = require('../utils/logger');

/**
 * Extracts text content and metadata from a PDF file.
 *
 * @param {string} filePath - Absolute or relative path to the PDF on disk.
 * @returns {Promise<{
 *   text: string,
 *   pageCount: number,
 *   info: { title: string, author: string, subject: string }
 * }>}
 * @throws {Error} If the file cannot be read, is corrupted, or produces no text.
 */
async function extractFromPdf(filePath) {
  let dataBuffer;

  try {
    dataBuffer = fs.readFileSync(filePath);
  } catch (err) {
    const error = new Error(`Cannot read PDF file: ${err.message}`);
    error.code = 'PDF_READ_ERROR';
    error.statusCode = 422;
    throw error;
  }

  let parsed;
  try {
    parsed = await pdfParse(dataBuffer);
  } catch (err) {
    log.error(`pdf-parse failed on ${filePath}: ${err.message}`);
    const error = new Error(
      'The uploaded PDF appears to be corrupted or password-protected and cannot be parsed.'
    );
    error.code = 'PDF_PARSE_ERROR';
    error.statusCode = 422;
    throw error;
  }

  const rawText = parsed.text || '';

  if (!rawText.trim()) {
    const error = new Error(
      'No extractable text found in this PDF. ' +
        'It may be a scanned image PDF. Please use the image upload option for OCR.'
    );
    error.code = 'PDF_EMPTY_TEXT';
    error.statusCode = 422;
    throw error;
  }

  // Clean and normalise whitespace while preserving paragraph structure.
  // pdf-parse often introduces excessive whitespace and blank lines.
  const cleanedText = rawText
    // Collapse runs of spaces / tabs (but not newlines) into a single space
    .replace(/[ \t]+/g, ' ')
    // Reduce more than two consecutive newlines to exactly two (paragraph break)
    .replace(/\n{3,}/g, '\n\n')
    // Trim each individual line
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();

  const info = {
    title: (parsed.info && parsed.info.Title) || '',
    author: (parsed.info && parsed.info.Author) || '',
    subject: (parsed.info && parsed.info.Subject) || '',
  };

  log.info(
    `PDF extracted: ${parsed.numpages} page(s), ${cleanedText.length} chars — ${filePath}`
  );

  return {
    text: cleanedText,
    pageCount: parsed.numpages || 0,
    info,
  };
}

module.exports = { extractFromPdf };
