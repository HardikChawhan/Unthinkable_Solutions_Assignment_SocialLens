import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { getScoreHexColor } from '../../utils/formatters'

function ProgressRing({
  score = 0,
  size = 80,
  strokeWidth = 6,
  color,
  showLabel = true,
  animate: shouldAnimate = true,
  className = '',
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const motionScore = useMotionValue(0)
  const strokeDashoffset = useTransform(
    motionScore,
    [0, 100],
    [circumference, 0]
  )

  const displayScore = useRef(null)

  const resolvedColor = color || getScoreHexColor(score)

  useEffect(() => {
    if (shouldAnimate) {
      const controls = animate(motionScore, score, {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.2,
      })

      // Update the displayed number
      const unsubscribe = motionScore.on('change', (latest) => {
        if (displayScore.current) {
          displayScore.current.textContent = Math.round(latest)
        }
      })

      return () => {
        controls.stop()
        unsubscribe()
      }
    } else {
      motionScore.set(score)
    }
  }, [score, shouldAnimate, motionScore])

  const center = size / 2
  const fontSize = size < 60 ? size * 0.22 : size * 0.2

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Score: ${score} out of 100`}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1E1E2E"
          strokeWidth={strokeWidth}
        />
        {/* Glow filter */}
        <defs>
          <filter id={`glow-${size}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          filter={`url(#glow-${size})`}
        />
      </svg>

      {/* Center content */}
      {showLabel && (
        <div
          className="absolute inset-0 flex items-center justify-center flex-col"
          aria-hidden="true"
        >
          <span
            ref={displayScore}
            className="font-bold tabular-nums"
            style={{
              fontSize: `${fontSize}px`,
              color: resolvedColor,
              lineHeight: 1,
            }}
          >
            0
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressRing
