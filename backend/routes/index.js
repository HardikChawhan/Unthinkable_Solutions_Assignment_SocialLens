'use strict';

const express = require('express');
const { getHealth } = require('../controllers/healthController');
const { uploadFile } = require('../controllers/uploadController');
const { analyzeText, analyzeValidation } = require('../controllers/analyzeController');
const { uploadSingle, handleMulterError } = require('../middleware/upload');

const router = express.Router();

// ---------------------------------------------------------------------------
// Health check — no auth, no rate-limit (skipped in security.js)
// ---------------------------------------------------------------------------
router.get('/health', getHealth);

// ---------------------------------------------------------------------------
// File upload → text extraction
// Step 1: uploadSingle  — Multer saves file and populates req.file
// Step 2: handleMulterError — converts Multer errors to 400 JSON responses
// Step 3: uploadFile    — business logic controller
// ---------------------------------------------------------------------------
router.post('/upload', uploadSingle, handleMulterError, uploadFile);

// ---------------------------------------------------------------------------
// Text analysis
// analyzeValidation array runs express-validator rules before the handler
// ---------------------------------------------------------------------------
router.post('/analyze', analyzeValidation, analyzeText);

module.exports = router;
