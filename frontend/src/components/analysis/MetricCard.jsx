import { useEffect, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function MetricCard({
  label,
  value,
  unit = '',
  icon: Icon,
  trend,
  color = 'text-primary',
  bgColor = 'bg-surface2',
  subtitle,
  className,
}) {
  const motionValue = useMotionValue(0)
  const displayRef = useRef(null)

  const numericValue = parseFloat(value) || 0
  const isNumeric = !isNaN(numericValue) && typeof value === 'number'

  useEffect(() => {
    if (!isNumeric) return

    const controls = animate(motionValue, numericValue, {
      duration: 1.0,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.1,
    })

    const unsubscribe = motionValue.on('change', (latest) => {
      if (displayRef.current) {
        const formatted =
          numericValue % 1 === 0
            ? Math.round(latest).toLocaleString()
            : latest.toFixed(1)
        displayRef.current.textContent = formatted
      }
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [numericValue, isNumeric, motionValue])

  const TrendIcon =
    trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const trendColor =
    trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={clsx(
        'bg-surface border border-border rounded-xl p-5 space-y-3',
        'hover:border-border2 hover:shadow-card-hover transition-all duration-200',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">
          {label}
        </p>
        {Icon && (
          <div
            className={clsx(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              bgColor
            )}
            aria-hidden="true"
          >
            <Icon size={15} className={color} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5">
        <span
          ref={displayRef}
          className={clsx('text-2xl font-bold tabular-nums', color)}
          aria-label={`${label}: ${value}${unit}`}
        >
          {isNumeric ? '0' : value}
        </span>
        {unit && (
          <span className="text-sm text-muted mb-0.5">{unit}</span>
        )}
      </div>

      {/* Subtitle / trend */}
      <div className="flex items-center justify-between gap-2">
        {subtitle && (
          <p className="text-xs text-muted truncate">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className={clsx('flex items-center gap-1 text-xs font-medium', trendColor)}>
            <TrendIcon size={12} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MetricCard
