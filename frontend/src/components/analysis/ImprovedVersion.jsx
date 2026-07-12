import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Sparkles, Type, Hash } from 'lucide-react'
import clsx from 'clsx'
import { formatWordCount, formatCharCount } from '../../utils/formatters'

function ImprovedVersion({ improvedText, className }) {
  const [copied, setCopied] = useState(false)

  if (!improvedText) return null

  const wordCount = formatWordCount(improvedText)
  const charCount = formatCharCount(improvedText)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(improvedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const el = document.createElement('textarea')
      el.value = improvedText
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={clsx(
        'relative bg-surface border border-border rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Gradient left accent border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-indigo to-accent-violet rounded-l-xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="pl-5 pr-5 py-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} className="text-accent-indigo" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary">
                AI-Improved Version
              </h4>
              <p className="text-xs text-muted">
                Optimized for engagement and clarity
              </p>
            </div>
          </div>

          {/* Copy button */}
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'border transition-all duration-200 flex-shrink-0',
              copied
                ? 'text-success border-success/30 bg-success/10'
                : 'text-secondary border-border hover:text-primary hover:border-border2 hover:bg-surface2'
            )}
            aria-label={copied ? 'Copied to clipboard' : 'Copy improved version'}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <Check size={12} />
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy size={12} />
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Improved text content */}
        <div className="bg-surface2 border border-border/50 rounded-lg p-4">
          <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap">
            {improvedText}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Hash size={11} />
            <span>{wordCount.toLocaleString()} words</span>
          </div>
          <div className="w-px h-3 bg-border" aria-hidden="true" />
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Type size={11} />
            <span>{charCount.toLocaleString()} characters</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ImprovedVersion
