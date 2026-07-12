/**
 * Utility functions for formatting values in the SocialLens app.
 */

/**
 * Format bytes into human-readable string
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string} e.g. '1.4 MB'
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Count words in text
 * @param {string} text
 * @returns {number}
 */
export function formatWordCount(text) {
  if (!text || typeof text !== 'string') return 0
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).filter(Boolean).length
}

/**
 * Count characters in text (excluding whitespace optionally)
 * @param {string} text
 * @returns {number}
 */
export function formatCharCount(text) {
  if (!text || typeof text !== 'string') return 0
  return text.length
}

/**
 * Estimate reading time for a text
 * @param {string} text
 * @returns {string} e.g. '< 1 min' or '3 min read'
 */
export function formatReadingTime(text) {
  const words = formatWordCount(text)
  const wordsPerMinute = 200
  const minutes = Math.ceil(words / wordsPerMinute)
  if (minutes < 1) return '< 1 min'
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}

/**
 * Format score to integer string
 * @param {number} score
 * @returns {string}
 */
export function formatScore(score) {
  if (score === null || score === undefined) return '—'
  return Math.round(score).toString()
}

/**
 * Get Tailwind color class based on score range
 * @param {number} score 0-100
 * @returns {string} tailwind text color class
 */
export function getScoreColor(score) {
  if (score === null || score === undefined) return 'text-muted'
  if (score >= 80) return 'text-success'
  if (score >= 60) return 'text-warning'
  if (score >= 40) return 'text-orange-400'
  return 'text-error'
}

/**
 * Get score label based on range
 * @param {number} score 0-100
 * @returns {string}
 */
export function getScoreLabel(score) {
  if (score === null || score === undefined) return 'N/A'
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

/**
 * Get color class for grade letter
 * @param {string} grade 'A+', 'A', 'B', 'C', 'D', 'F'
 * @returns {string} tailwind color class
 */
export function getGradeColor(grade) {
  if (!grade) return 'text-muted'
  const upper = grade.toUpperCase()
  if (upper.startsWith('A')) return 'text-success'
  if (upper.startsWith('B')) return 'text-accent-indigo'
  if (upper.startsWith('C')) return 'text-warning'
  if (upper.startsWith('D')) return 'text-orange-400'
  return 'text-error'
}

/**
 * Format sentiment score to label, color, icon name
 * @param {number} score -1 to 1 (or 0-100)
 * @returns {{ label: string, color: string, emoji: string }}
 */
export function formatSentiment(score) {
  if (score === null || score === undefined) {
    return { label: 'Neutral', color: 'text-secondary', emoji: '😐' }
  }

  // Normalize: if score is 0-100, convert to -1 to 1
  const normalized = score > 1 ? (score - 50) / 50 : score

  if (normalized >= 0.5) return { label: 'Very Positive', color: 'text-success', emoji: '😄' }
  if (normalized >= 0.1) return { label: 'Positive', color: 'text-green-400', emoji: '🙂' }
  if (normalized >= -0.1) return { label: 'Neutral', color: 'text-secondary', emoji: '😐' }
  if (normalized >= -0.5) return { label: 'Negative', color: 'text-warning', emoji: '😟' }
  return { label: 'Very Negative', color: 'text-error', emoji: '😞' }
}

/**
 * Truncate text to maxLength, adding ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength).trim()}…`
}

/**
 * Format a date to a readable string
 * @param {string|Date} date
 * @returns {string} e.g. 'Jul 12, 2024'
 */
export function formatDate(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format time to 12h readable string
 * @param {string|Date} date
 * @returns {string} e.g. '2:30 PM'
 */
export function formatTime(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Calculate percentage change between two values
 * @param {number} current
 * @param {number} previous
 * @returns {number}
 */
export function calcPercentChange(current, previous) {
  if (!previous) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Get hex color for score (for SVG/inline use)
 * @param {number} score 0-100
 * @returns {string}
 */
export function getScoreHexColor(score) {
  if (score >= 80) return '#10B981'
  if (score >= 60) return '#F59E0B'
  if (score >= 40) return '#F97316'
  return '#EF4444'
}

/**
 * Format a number with commas
 * @param {number} n
 * @returns {string}
 */
export function formatNumber(n) {
  if (n === null || n === undefined) return '0'
  return n.toLocaleString('en-US')
}
