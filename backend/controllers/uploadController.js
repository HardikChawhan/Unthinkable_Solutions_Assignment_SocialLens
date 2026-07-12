'use strict';

const { extract } = require('../services/extractionService');
const { formatBytes } = require('../utils/fileUtils');
const { log } = require('../utils/logger');

/**
 * POST /api/upload
 *
 * Accepts a multipart file upload (field: 'file'), extracts text from it
 * (PDF via pdf-parse, images via Tesseract OCR), and returns the raw text
 * along with file and extraction metadata.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function uploadFile(req, res, next) {
  try {
    // Multer attaches the file to req.file after uploadSingle runs
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE_PROVIDED',
          message: 'No file was provided. Please attach a file using the "file" form field.',
        },
      });
    }

    const { path: filePath, mimetype, originalname, size } = req.file;

    log.info(`Processing upload: ${originalname} (${formatBytes(size)}, ${mimetype})`);

    const { text, metadata } = await extract(filePath, mimetype);

    return res.status(200).json({
      success: true,
      data: {
        extractedText: text,
        metadata,
        fileInfo: {
          name: originalname,
          size: formatBytes(size),
          sizeBytes: size,
          type: mimetype,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadFile };
