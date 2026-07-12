import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Zap,
  BookOpen,
  Hash,
  Target,
  Eye,
  MessageSquare,
  Lightbulb,
  ArrowRight,
} from 'lucide-react'
import clsx from 'clsx'
import Badge from '../ui/Badge'

const priorityConfig = {
  high: {
    badge: 'error',
    label: 'High Priority',
    dot: true,
    border: 'border-error/20',
    bg: 'bg-error/5',
    glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]',
  },
  medium: {
    badge: 'warning',
    label: 'Medium',
    dot: true,
    border: 'border-warning/20',
    bg: 'bg-warning/5',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
  },
  low: {
    badge: 'success',
    label: 'Low',
    dot: true,
    border: 'border-success/20',
    bg: 'bg-success/5',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
  },
}

const categoryIcons = {
  engagement: Zap,
  readability: BookOpen,
  hashtag: Hash,
  cta: Target,
  hook: Eye,
  general: Lightbulb,
  tone: MessageSquare,
  default: Lightbulb,
}

function SuggestionCard({ suggestion }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!suggestion) return null

  const {
    category = 'general',
    priority = 'medium',
    title = '',
    description = '',
    example = '',
  } = suggestion

  const config = priorityConfig[priority] || priorityConfig.medium
  const IconComponent = categoryIcons[category?.toLowerCase()] || categoryIcons.default

  const handleCopy = async () => {
    if (!example) return
    try {
      await navigator.clipboard.writeText(example)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = example
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        'border rounded-xl overflow-hidden transition-all duration-200',
        config.border,
        isExpanded ? config.bg : 'bg-surface hover:bg-surface2',
        config.glow
      )}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setIsExpanded((p) => !p)}
        className="w-full flex items-center gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-inset"
        aria-expanded={isExpanded}
        aria-controls={`suggestion-body-${suggestion.id || title}`}
      >
        {/* Category icon */}
        <div
          className={clsx(
            'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center',
            isExpanded ? 'bg-background' : 'bg-surface2'
          )}
          aria-hidden="true"
        >
          <IconComponent size={16} className="text-secondary" />
        </div>

        {/* Title and badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-primary truncate">{title}</p>
          </div>
          {!isExpanded && (
            <p className="text-xs text-muted mt-0.5 line-clamp-2">{description}</p>
          )}
        </div>

        {/* Priority badge */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Badge variant={config.badge} size="sm" dot={config.dot}>
            {config.label}
          </Badge>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-muted" aria-hidden="true" />
          </motion.div>
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`suggestion-body-${suggestion.id || title}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border/50 pt-3">
              {/* Description */}
              <p className="text-sm text-secondary leading-relaxed">
                {description}
              </p>

              {/* Example */}
              {example && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <ArrowRight size={12} />
                      <span>Example improvement</span>
                    </div>
                    <motion.button
                      onClick={handleCopy}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={clsx(
                        'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium',
                        'transition-all duration-200 border',
                        copied
                          ? 'text-success border-success/30 bg-success/10'
                          : 'text-secondary border-border hover:text-primary hover:border-border2'
                      )}
                      aria-label="Copy example text"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {copied ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check size={11} />
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Copy size={11} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {copied ? 'Copied!' : 'Copy'}
                    </motion.button>
                  </div>

                  {/* Code-like example box */}
                  <div className="relative bg-background border border-border rounded-lg p-3 font-mono text-xs text-secondary leading-relaxed overflow-auto max-h-32">
                    <span className="absolute top-2 right-2 text-2xs text-muted uppercase tracking-wider font-sans">
                      suggestion
                    </span>
                    <pre className="whitespace-pre-wrap break-words">{example}</pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default SuggestionCard
