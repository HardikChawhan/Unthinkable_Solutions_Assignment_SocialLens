import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, RefreshCcw, History, Trash2, Clock, ChevronRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import DropZone from '../components/upload/DropZone'
import FilePreview from '../components/upload/FilePreview'
import UploadProgress from '../components/upload/UploadProgress'
import AnalysisReport from '../components/analysis/AnalysisReport'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { SkeletonCard, SkeletonMetricCard } from '../components/ui/Skeleton'
import { pageTransition, fadeUp, staggerContainer } from '../animations/variants'
import { useFileUpload } from '../hooks/useFileUpload'
import { useAnalysis } from '../hooks/useAnalysis'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useAnalysisContext } from '../context/AnalysisContext'
import { toast } from '../components/ui/Toast'
import { formatDate, formatTime, truncateText } from '../utils/formatters'

// Machine states
const STATE = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  EXTRACTING: 'extracting',
  ANALYZING: 'analyzing',
  COMPLETE: 'complete',
  ERROR: 'error',
}

function HistorySidebar({ history, onClear, onSelect }) {
  if (!history || history.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface border border-border rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <History size={14} className="text-accent-indigo" />
          Recent ({history.length})
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted hover:text-error transition-colors flex items-center gap-1"
          aria-label="Clear history"
        >
          <Trash2 size={11} />
          Clear
        </button>
      </div>
      <ul className="divide-y divide-border/50 max-h-80 overflow-y-auto">
        {history.slice(0, 10).map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSelect?.(item)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface2 transition-colors text-left group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-secondary truncate">
                  {truncateText(item.filename || 'Untitled', 28)}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock size={9} className="text-muted" />
                  <p className="text-2xs text-muted">
                    {formatDate(item.timestamp)} · {formatTime(item.timestamp)}
                  </p>
                </div>
              </div>
              {item.score !== undefined && (
                <Badge
                  variant={item.score >= 80 ? 'success' : item.score >= 60 ? 'warning' : 'error'}
                  size="xs"
                >
                  {Math.round(item.score)}
                </Badge>
              )}
              <ChevronRight size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function ErrorCard({ error, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-error/5 border border-error/20 rounded-2xl p-8 text-center space-y-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mx-auto">
        <AlertCircle size={28} className="text-error" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-primary">Something went wrong</h3>
        <p className="text-sm text-secondary max-w-md mx-auto">{error}</p>
      </div>
      <Button
        variant="outline"
        size="md"
        leftIcon={<RefreshCcw size={14} />}
        onClick={onRetry}
      >
        Try Again
      </Button>
    </motion.div>
  )
}

function AnalyzerPage() {
  const [appState, setAppState] = useState(STATE.IDLE)
  const [currentFile, setCurrentFile] = useState(null)
  const [dropzoneError, setDropzoneError] = useState(null)
  const resultsRef = useRef(null)
  const fileInputRef = useRef(null)

  const {
    upload,
    uploadProgress,
    extractedText,
    fileMetadata,
    isUploading,
    uploadError,
    reset: resetUpload,
  } = useFileUpload()

  const {
    analyze,
    analysis,
    isAnalyzing,
    analysisError,
    reset: resetAnalysis,
  } = useAnalysis()

  const { uploadHistory, addToHistory, clearHistory } = useAnalysisContext()

  useEffect(() => {
    document.title = 'Analyzer — SocialLens'
  }, [])

  // Auto-scroll to results when complete
  useEffect(() => {
    if (appState === STATE.COMPLETE && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [appState])

  // Keyboard shortcut: Ctrl+U to trigger file picker
  useKeyboardShortcuts([
    {
      key: 'u',
      ctrlKey: true,
      description: 'Upload file',
      handler: () => {
        if (appState === STATE.IDLE) {
          fileInputRef.current?.click()
        }
      },
    },
    {
      key: 'r',
      ctrlKey: true,
      description: 'Reset analyzer',
      handler: () => {
        handleReset()
      },
    },
  ])

  const handleReset = useCallback(() => {
    setAppState(STATE.IDLE)
    setCurrentFile(null)
    setDropzoneError(null)
    resetUpload()
    resetAnalysis()
  }, [resetUpload, resetAnalysis])

  const handleFileAccepted = useCallback(
    async (file) => {
      setCurrentFile(file)
      setDropzoneError(null)

      // Step 1: Upload
      setAppState(STATE.UPLOADING)
      toast.loading('Uploading file…', { id: 'upload' })

      try {
        const uploadResult = await upload(file)
        toast.dismiss('upload')
        toast.success('File uploaded! Extracting text…', { id: 'extract' })

        // Step 2: Show extract state briefly
        setAppState(STATE.EXTRACTING)

        // Small delay so user sees the extracting step
        await new Promise((r) => setTimeout(r, 600))
        toast.dismiss('extract')

        // extractedText is also stored in the hook's state, use result directly as primary
        const text = uploadResult?.extractedText || uploadResult?.text || ''

        if (!text || text.trim().length < 5) {
          throw new Error(
            'No text could be extracted from this file. Please try a clearer image or ensure the PDF contains selectable text.'
          )
        }

        // Step 3: Analyze
        setAppState(STATE.ANALYZING)
        toast.loading('Analyzing content…', { id: 'analyze' })

        const result = await analyze(text)
        toast.dismiss('analyze')
        toast.success('Analysis complete!', { id: 'done' })

        // Save to history
        addToHistory({
          filename: file.name,
          score: result?.overall_score,
          grade: result?.grade,
        })

        setAppState(STATE.COMPLETE)
      } catch (err) {
        toast.dismiss('upload')
        toast.dismiss('extract')
        toast.dismiss('analyze')
        toast.error(err.message || 'An error occurred. Please try again.')
        setAppState(STATE.ERROR)
      }
    },
    [upload, analyze, addToHistory]
  )

  const handleFileRejected = useCallback((error) => {
    setDropzoneError(error)
    toast.error(error)
  }, [])

  const getCurrentStep = () => {
    if (appState === STATE.UPLOADING) return 'upload'
    if (appState === STATE.EXTRACTING) return 'extract'
    if (appState === STATE.ANALYZING) return 'analyze'
    return 'upload'
  }

  const isProcessing =
    appState === STATE.UPLOADING ||
    appState === STATE.EXTRACTING ||
    appState === STATE.ANALYZING

  const errorMessage = uploadError || analysisError

  return (
    <motion.div
      key="analyzer"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-background flex flex-col"
    >
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Page header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-primary">Content Analyzer</h1>
              <p className="text-secondary mt-1 text-sm">
                Upload an image or PDF to get instant AI-powered analysis
              </p>
            </div>
            {appState !== STATE.IDLE && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCcw size={14} />}
                onClick={handleReset}
              >
                Start Over
              </Button>
            )}
          </div>

          {/* Keyboard hint */}
          <p className="text-2xs text-muted mt-2 hidden sm:block">
            Tip: Press{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-surface2 border border-border font-mono text-2xs">
              Ctrl+U
            </kbd>{' '}
            to open file picker ·{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-surface2 border border-border font-mono text-2xs">
              Ctrl+R
            </kbd>{' '}
            to reset
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Main content */}
          <div className="space-y-6 min-w-0">
            {/* IDLE: Drop zone */}
            <AnimatePresence mode="wait">
              {appState === STATE.IDLE && (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <DropZone
                    onFileAccepted={handleFileAccepted}
                    onFileRejected={handleFileRejected}
                  />

                  {dropzoneError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-error flex items-center gap-2"
                    >
                      <AlertCircle size={14} />
                      {dropzoneError}
                    </motion.p>
                  )}

                  {/* Supported formats note */}
                  <p className="text-xs text-muted text-center">
                    Supported: JPEG, PNG, PDF · Max 10 MB · Files are never stored
                  </p>
                </motion.div>
              )}

              {/* PROCESSING states */}
              {isProcessing && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* File preview */}
                  {currentFile && (
                    <FilePreview file={currentFile} />
                  )}

                  {/* Progress stepper */}
                  <UploadProgress
                    currentStep={getCurrentStep()}
                    uploadProgress={uploadProgress}
                  />

                  {/* Skeleton loading */}
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[...Array(4)].map((_, i) => (
                        <SkeletonMetricCard key={i} />
                      ))}
                    </div>
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                </motion.div>
              )}

              {/* ERROR state */}
              {appState === STATE.ERROR && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ErrorCard
                    error={errorMessage || 'An unexpected error occurred.'}
                    onRetry={handleReset}
                  />
                </motion.div>
              )}

              {/* COMPLETE state */}
              {appState === STATE.COMPLETE && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                  ref={resultsRef}
                >
                  {/* File info bar */}
                  {currentFile && (
                    <FilePreview file={currentFile} onRemove={handleReset} />
                  )}

                  {/* Full analysis report */}
                  <AnalysisReport
                    analysis={analysis}
                    extractedText={extractedText}
                    fileMetadata={fileMetadata}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 hidden lg:block">
            {/* Info card */}
            <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                How to use
              </h3>
              <ol className="space-y-2 text-xs text-secondary">
                {[
                  'Upload a JPEG, PNG, or PDF',
                  'Text is extracted automatically',
                  'AI analyzes engagement metrics',
                  'Review your report & suggestions',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-accent-indigo/10 text-accent-indigo text-2xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* History */}
            <HistorySidebar
              history={uploadHistory}
              onClear={clearHistory}
              onSelect={(item) => {
                toast.info(`Selected: ${item.filename || 'item'}`)
              }}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </motion.div>
  )
}

export default AnalyzerPage
