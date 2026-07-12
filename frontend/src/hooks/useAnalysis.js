import { useState, useCallback } from 'react'
import { analyzeText } from '../services/api'

/**
 * Hook for managing text analysis state
 */
export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analysisError, setAnalysisError] = useState(null)

  const analyze = useCallback(async (text) => {
    if (!text || !text.trim()) {
      setAnalysisError('No text to analyze. Please upload a file first.')
      return null
    }

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const result = await analyzeText(text)
      setAnalysis(result)
      return result
    } catch (error) {
      const message =
        error.message || 'Analysis failed. Please try again.'
      setAnalysisError(message)
      throw error
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsAnalyzing(false)
    setAnalysis(null)
    setAnalysisError(null)
  }, [])

  return {
    analyze,
    analysis,
    isAnalyzing,
    analysisError,
    reset,
  }
}

export default useAnalysis
