import { createContext, useContext, useState, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AnalysisContext = createContext(null)

const MAX_HISTORY = 20

export function AnalysisProvider({ children }) {
  const [uploadHistory, setUploadHistory] = useLocalStorage('sociallens_history', [])
  const [currentFile, setCurrentFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [analysis, setAnalysis] = useState(null)

  const addToHistory = useCallback(
    (entry) => {
      setUploadHistory((prev) => {
        const newEntry = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          ...entry,
        }
        const updated = [newEntry, ...prev].slice(0, MAX_HISTORY)
        return updated
      })
    },
    [setUploadHistory]
  )

  const clearHistory = useCallback(() => {
    setUploadHistory([])
  }, [setUploadHistory])

  const removeFromHistory = useCallback(
    (id) => {
      setUploadHistory((prev) => prev.filter((item) => item.id !== id))
    },
    [setUploadHistory]
  )

  const value = {
    uploadHistory,
    currentFile,
    setCurrentFile,
    extractedText,
    setExtractedText,
    analysis,
    setAnalysis,
    addToHistory,
    clearHistory,
    removeFromHistory,
  }

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysisContext() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysisContext must be used within an AnalysisProvider')
  }
  return context
}

export default AnalysisContext
