/**
 * File and text validation utilities
 */

export const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
]

export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf']

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export const MIN_TEXT_LENGTH = 10
export const MAX_TEXT_LENGTH = 10000

/**
 * Validate a file for upload
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file provided.' }
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type not supported. Please upload a JPEG, PNG, or PDF file.`,
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)
    return {
      valid: false,
      error: `File size exceeds ${sizeMB} MB limit. Please choose a smaller file.`,
    }
  }

  // Check for empty file
  if (file.size === 0) {
    return {
      valid: false,
      error: 'The file appears to be empty. Please select a valid file.',
    }
  }

  return { valid: true }
}

/**
 * Validate text for analysis
 * @param {string} text
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateText(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'No text provided for analysis.' }
  }

  const trimmed = text.trim()

  if (trimmed.length < MIN_TEXT_LENGTH) {
    return {
      valid: false,
      error: `Text is too short. Please provide at least ${MIN_TEXT_LENGTH} characters for meaningful analysis.`,
    }
  }

  if (trimmed.length > MAX_TEXT_LENGTH) {
    return {
      valid: false,
      error: `Text is too long. Maximum ${MAX_TEXT_LENGTH.toLocaleString()} characters allowed.`,
    }
  }

  return { valid: true }
}

/**
 * Get friendly file type label
 * @param {string} mimeType
 * @returns {string}
 */
export function getFileTypeLabel(mimeType) {
  const labels = {
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPG Image',
    'image/png': 'PNG Image',
    'application/pdf': 'PDF Document',
  }
  return labels[mimeType] || mimeType
}

/**
 * Get file extension from file
 * @param {File} file
 * @returns {string}
 */
export function getFileExtension(file) {
  if (!file || !file.name) return ''
  return file.name.split('.').pop()?.toLowerCase() || ''
}
