import { motion } from 'framer-motion'
import ProgressRing from '../ui/ProgressRing'
import Badge from '../ui/Badge'
import { getScoreLabel, getGradeColor } from '../../utils/formatters'
import clsx from 'clsx'

function ScoreRing({
  score = 0,
  label = 'Overall Score',
  grade,
  size = 120,
  className,
}) {
  const scoreLabel = getScoreLabel(score)
  const gradeColorClass = grade ? getGradeColor(grade) : ''

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
      className={clsx('flex flex-col items-center gap-3', className)}
    >
      {/* Glow backdrop */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-gradient-to-br from-accent-indigo to-accent-violet"
          aria-hidden="true"
        />
        <ProgressRing score={score} size={size} strokeWidth={8} />
      </div>

      {/* Labels */}
      <div className="text-center space-y-1.5">
        <p className="text-sm font-medium text-secondary">{label}</p>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge
            variant={
              score >= 80
                ? 'success'
                : score >= 60
                ? 'warning'
                : score >= 40
                ? 'default'
                : 'error'
            }
            size="md"
          >
            {scoreLabel}
          </Badge>

          {grade && (
            <span
              className={clsx(
                'text-lg font-bold tabular-nums',
                gradeColorClass
              )}
              aria-label={`Grade: ${grade}`}
            >
              {grade}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ScoreRing
