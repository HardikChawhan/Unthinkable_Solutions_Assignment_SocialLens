import { motion } from 'framer-motion'
import { FileImage, FileText, X, File } from 'lucide-react'
import clsx from 'clsx'
import { formatBytes } from '../../utils/formatters'
import { getFileTypeLabel } from '../../utils/validators'
import Badge from '../ui/Badge'
import { scaleIn } from '../../animations/variants'

function getFileIcon(type) {
  if (type?.startsWith('image/')) {
    return { Icon: FileImage, color: 'text-blue-400', bg: 'bg-blue-400/10' }
  }
  if (type === 'application/pdf') {
    return { Icon: FileText, color: 'text-rose-400', bg: 'bg-rose-400/10' }
  }
  return { Icon: File, color: 'text-secondary', bg: 'bg-surface2' }
}

function getBadgeVariant(type) {
  if (type?.startsWith('image/')) return 'info'
  if (type === 'application/pdf') return 'error'
  return 'default'
}

function truncateFilename(name, maxLength = 32) {
  if (!name || name.length <= maxLength) return name
  const ext = name.split('.').pop()
  const base = name.slice(0, maxLength - ext.length - 4)
  return `${base}…${ext}`
}

function FilePreview({ file, onRemove }) {
  if (!file) return null

  const { Icon, color, bg } = getFileIcon(file.type)
  const badgeVariant = getBadgeVariant(file.type)
  const displayName = truncateFilename(file.name)
  const typeLabel = getFileTypeLabel(file.type)

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="w-full"
    >
      <div className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl group">
        {/* File icon */}
        <div
          className={clsx(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
            bg
          )}
          aria-hidden="true"
        >
          <Icon size={22} className={color} />
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className="text-sm font-medium text-primary truncate"
              title={file.name}
            >
              {displayName}
            </p>
            <Badge variant={badgeVariant} size="sm">
              {typeLabel}
            </Badge>
          </div>
          <p className="text-xs text-muted">
            {formatBytes(file.size)}
            {file.lastModifiedDate && (
              <>
                {' · '}
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </>
            )}
          </p>
        </div>

        {/* Remove button */}
        {onRemove && (
          <motion.button
            onClick={onRemove}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={clsx(
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
              'text-muted hover:text-error hover:bg-error/10',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error'
            )}
            aria-label={`Remove file: ${file.name}`}
            title="Remove file"
          >
            <X size={15} />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default FilePreview
