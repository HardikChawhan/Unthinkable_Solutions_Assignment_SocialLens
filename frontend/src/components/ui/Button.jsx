import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const variants = {
  primary:
    'bg-gradient-to-r from-accent-indigo to-accent-violet text-white shadow-glow-sm hover:shadow-glow border border-transparent',
  ghost:
    'bg-transparent text-secondary hover:text-primary hover:bg-white/5 border border-transparent',
  outline:
    'bg-transparent text-primary border border-border2 hover:border-accent-indigo hover:text-accent-indigo',
  danger:
    'bg-transparent text-error border border-error/30 hover:bg-error/10 hover:border-error',
  subtle:
    'bg-surface2 text-secondary hover:text-primary border border-border hover:border-border2',
  link:
    'bg-transparent text-accent-indigo hover:text-accent-violet border border-transparent underline-offset-4 hover:underline p-0',
}

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1.5',
  sm: 'h-8 px-3 text-sm gap-2',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  xl: 'h-14 px-8 text-lg gap-3',
}

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    children,
    onClick,
    type = 'button',
    'aria-label': ariaLabel,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || isLoading

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={clsx(
        // Base styles
        'relative inline-flex items-center justify-center font-medium rounded-xl',
        'select-none transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        // Variant
        variants[variant],
        // Size
        size !== 'link' && sizes[size],
        // Disabled
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        // Full width option
        rest.fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {/* Loading spinner */}
      {isLoading && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        </motion.span>
      )}

      {/* Content */}
      <span
        className={clsx(
          'inline-flex items-center gap-inherit',
          sizes[size],
          'p-0 h-auto',
          isLoading && 'opacity-0'
        )}
      >
        {leftIcon && (
          <span className="flex-shrink-0 flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="flex-shrink-0 flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </span>
    </motion.button>
  )
})

export default Button
