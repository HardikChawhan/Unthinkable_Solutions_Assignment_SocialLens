'use strict';

const { body } = require('express-validator');
const { analyze } = require('../services/analysisService');
const { extractValidationErrors } = require('../middleware/errorHandler');
const { log } = require('../utils/logger');

/**
 * Validation rules for the POST /api/analyze body.
 * Must be mounted as middleware before the handler.
 */
const analyzeValidation = [
  body('text')
    .exists({ checkFalsy: true })
    .withMessage('The "text" field is required and must not be empty.')
    .isString()
    .withMessage('The "text" field must be a string.')
    .isLength({ min: 20 })
    .withMessage('Text must be at least 20 characters long to produce a meaningful analysis.')
    .isLength({ max: 10000 })
    .withMessage('Text must not exceed 10,000 characters.')
    .trim(),
];

/**
 * POST /api/analyze
 *
 * Accepts a JSON body { text: string } and returns a full content analysis
 * using either the OpenAI GPT-4o-mini model or the built-in rule-based engine.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function analyzeText(req, res, next) {
  try {
    // Check express-validator results
    const validationError = extractValidationErrors(req);
    if (validationError) return next(validationError);

    const { text } = req.body;

    log.info(`Analyzing post: ${text.length} chars`);

    const analysis = await analyze(text);

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyzeText, analyzeValidation };
