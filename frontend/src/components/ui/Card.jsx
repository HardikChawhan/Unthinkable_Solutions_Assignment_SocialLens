import { motion } from 'framer-motion'
import clsx from 'clsx'
import { cardHover } from '../../animations/variants'

const variantStyles = {
  default:
    'bg-surface border border-border shadow-card',
  glass:
    'glass',
  elevated:
    'bg-surface2 border border-border2 shadow-card-elevated',
  outline:
    'bg-transparent border border-border hover:border-border2',
  ghost:
    'bg-transparent',
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
}

function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
  hover = false,
  onClick,
  as: Component = 'div',
  ...rest
}) {
  const isInteractive = hover || onClick

  if (isInteractive) {
    return (
      <motion.div
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        onClick={onClick}
        className={clsx(
          'rounded-xl overflow-hidden transition-colors duration-200',
          variantStyles[variant],
          paddingStyles[padding],
          onClick && 'cursor-pointer',
          className
        )}
        {...rest}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div
      className={clsx(
        'rounded-xl overflow-hidden',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card
