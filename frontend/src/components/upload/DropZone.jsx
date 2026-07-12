import { useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Image, FileText, AlertCircle } from 'lucide-react'
import clsx from 'clsx'
import { validateFile, ALLOWED_EXTENSIONS } from '../../utils/validators'
import { shake } from '../../animations/variants'

const formatBadges = [
  { ext: 'JPG', color: 'text-blue-400 border-blue-400/30 bg-blue-400/5' },
  { ext: 'PNG', color: 'text-purple-400 border-purple-400/30 bg-purple-400/5' },
  { ext: 'PDF', color: 'text-rose-400 border-rose-400/30 bg-rose-400/5' },
]

function DropZone({ onFileAccepted, onFileRejected, disabled = false }) {
  const fileInputRef = useRef(null)

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        const error = rejectedFiles[0]?.errors?.[0]?.message || 'Invalid file.'
        onFileRejected?.(error)
        return
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const validation = validateFile(file)

        if (!validation.valid) {
          onFileRejected?.(validation.error)
          return
        }

        onFileAccepted?.(file)
      }
    },
    [onFileAccepted, onFileRejected]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled,
  })

  const hasError = isDragReject

  return (
    <motion.div
      animate={hasError ? shake.animate : {}}
      className="w-full"
    >
      <div
        {...getRootProps()}
        className={clsx(
          'relative min-h-64 flex flex-col items-center justify-center',
          'rounded-2xl border-2 border-dashed cursor-pointer',
          'transition-all duration-300 outline-none',
          'focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          isDragActive && !isDragReject
            ? 'border-accent-indigo bg-accent-indigo/5 scale-[1.01]'
            : hasError
            ? 'border-error bg-error/5'
            : 'border-border2 bg-surface hover:border-accent-indigo/50 hover:bg-accent-indigo/3',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        role="button"
        tabIndex={0}
        aria-label="Drop zone: Upload an image or PDF file for analysis"
        aria-disabled={disabled}
      >
        <input {...getInputProps()} aria-label="File input" />

        {/* Background grid pattern */}
        <div className="absolute inset-0 grid-overlay rounded-2xl opacity-30" aria-hidden="true" />

        {/* Drag active overlay */}
        <AnimatePresence>
          {isDragActive && !isDragReject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-indigo/10 to-accent-violet/10 border-2 border-accent-indigo"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-5 p-8 text-center">
          {/* Animated upload icon */}
          <motion.div
            animate={
              isDragActive
                ? { scale: 1.2, y: -8 }
                : { scale: 1, y: [0, -6, 0] }
            }
            transition={
              isDragActive
                ? { duration: 0.2 }
                : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
            }
            className={clsx(
              'w-16 h-16 rounded-2xl flex items-center justify-center',
              'shadow-card-elevated',
              isDragActive && !isDragReject
                ? 'bg-accent-indigo/20 text-accent-indigo'
                : hasError
                ? 'bg-error/10 text-error'
                : 'bg-surface2 text-secondary'
            )}
          >
            <AnimatePresence mode="wait">
              {hasError ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <AlertCircle size={28} />
                </motion.div>
              ) : isDragActive ? (
                <motion.div
                  key="drag"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Upload size={28} className="text-accent-indigo" />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <Upload size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Text */}
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              {isDragActive && !isDragReject ? (
                <motion.p
                  key="drop"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-lg font-semibold text-accent-indigo"
                >
                  Drop to upload
                </motion.p>
              ) : hasError ? (
                <motion.p
                  key="reject"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-lg font-semibold text-error"
                >
                  Invalid file type
                </motion.p>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <p className="text-lg font-semibold text-primary">
                    Drop your file here
                  </p>
                  <p className="text-sm text-secondary mt-1">
                    or{' '}
                    <span className="text-accent-indigo underline underline-offset-2 hover:text-accent-violet cursor-pointer transition-colors">
                      browse from your device
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* File format badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {formatBadges.map(({ ext, color }) => (
              <span
                key={ext}
                className={clsx(
                  'px-2.5 py-1 text-xs font-semibold rounded-lg border',
                  color
                )}
              >
                {ext}
              </span>
            ))}
            <span className="text-xs text-muted">· Max 10 MB</span>
          </div>

          {/* Type icons */}
          <div className="flex items-center gap-6 text-muted" aria-hidden="true">
            <div className="flex items-center gap-1.5 text-xs">
              <Image size={14} />
              <span>Images</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="flex items-center gap-1.5 text-xs">
              <FileText size={14} />
              <span>PDFs</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DropZone
