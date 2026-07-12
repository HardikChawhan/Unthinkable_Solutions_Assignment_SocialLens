import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s — OCR can be slow
  headers: {
    Accept: 'application/json',
  },
})

// ─── Request Interceptor ───────────────────────────────────────────────
let requestCounter = 0

api.interceptors.request.use(
  (config) => {
    // Add unique request ID header
    requestCounter++
    config.headers['X-Request-ID'] = `sl-${Date.now()}-${requestCounter}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ─── Response Interceptor ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Normalize error messages
    let message = 'An unexpected error occurred. Please try again.'

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. The server is taking too long to respond.'
    } else if (error.code === 'ERR_NETWORK') {
      message = 'Network error. Please check your connection and ensure the server is running.'
    } else if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (data?.error) {
        message = data.error
      } else if (data?.message) {
        message = data.message
      } else {
        switch (status) {
          case 400:
            message = 'Bad request. Please check your input.'
            break
          case 413:
            message = 'File too large. Please upload a file smaller than 10 MB.'
            break
          case 415:
            message = 'Unsupported file type. Please upload a JPEG, PNG, or PDF.'
            break
          case 422:
            message = 'Unable to extract text from this file. Please try another image or PDF.'
            break
          case 429:
            message = 'Too many requests. Please wait a moment before trying again.'
            break
          case 500:
            message = 'Server error. Please try again in a moment.'
            break
          case 503:
            message = 'Service temporarily unavailable. Please try again later.'
            break
          default:
            message = `Server returned error ${status}.`
        }
      }
    }

    const normalizedError = new Error(message)
    normalizedError.originalError = error
    normalizedError.status = error.response?.status
    normalizedError.data = error.response?.data

    return Promise.reject(normalizedError)
  }
)

// ─── API Functions ─────────────────────────────────────────────────────

/**
 * Upload a file for OCR/extraction
 * @param {File} file
 * @param {Function} onUploadProgress - callback(percent)
 * @returns {Promise<{ text: string, metadata: object }>}
 */
export async function uploadFile(file, onUploadProgress) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onUploadProgress?.(percent)
      }
    },
  })

  // Unwrap the { success, data } envelope — return the inner data object
  return response.data?.data ?? response.data
}

/**
 * Analyze extracted text for social media engagement metrics
 * @param {string} text
 * @returns {Promise<object>} Analysis result
 */
export async function analyzeText(text) {
  const response = await api.post('/analyze', { text })

  // Unwrap the { success, data } envelope
  const raw = response.data?.data ?? response.data

  // Normalize backend camelCase schema → frontend snake_case schema
  // Backend: { overallScore, grade, metrics: { engagementScore, ... }, improvedVersion, ... }
  // Frontend (AnalysisReport): { overall_score, scores: { engagement, ... }, improved_version, ... }
  const m = raw?.metrics ?? {}
  return {
    overall_score: raw?.overallScore ?? raw?.overall_score ?? 0,
    grade: raw?.grade ?? 'N/A',
    platform: raw?.platform ?? 'general',
    word_count: m.wordCount ?? raw?.word_count ?? 0,
    char_count: m.charCount ?? raw?.char_count ?? 0,
    reading_time: m.estimatedReadingTime ?? raw?.reading_time ?? '< 1 min',
    sentiment: {
      score: m.sentimentScore ?? 0,
      label: m.sentimentLabel ?? 'Neutral',
    },
    scores: {
      engagement: m.engagementScore ?? 0,
      readability: m.readabilityScore ?? 0,
      hook: m.hookStrength ?? 0,
      cta: m.ctaScore ?? 0,
      hashtag: m.hashtagScore ?? 0,
      clarity: m.clarityScore ?? 0,
    },
    strengths: raw?.strengths ?? [],
    weaknesses: raw?.weaknesses ?? [],
    suggestions: raw?.suggestions ?? [],
    improved_version: raw?.improvedVersion ?? raw?.improved_version ?? '',
    // Pass full metrics for any component that needs them
    metrics: m,
  }
}

/**
 * Health check
 * @returns {Promise<object>}
 */
export async function checkHealth() {
  const response = await api.get('/health')
  return response.data
}

export default api
