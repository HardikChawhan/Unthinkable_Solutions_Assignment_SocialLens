import clsx from 'clsx'

const variantStyles = {
  default: 'bg-border2 text-secondary border border-border',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  error: 'bg-error/10 text-error border border-error/20',
  info: 'bg-info/10 text-info border border-info/20',
  indigo: 'bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20',
  violet: 'bg-accent-violet/10 text-accent-violet border border-accent-violet/20',
}

const sizeStyles = {
  xs: 'px-1.5 py-0.5 text-2xs font-medium rounded-md',
  sm: 'px-2 py-0.5 text-xs font-medium rounded-lg',
  md: 'px-2.5 py-1 text-xs font-semibold rounded-lg',
  lg: 'px-3 py-1 text-sm font-semibold rounded-xl',
}

const dotColors = {
  default: 'bg-muted',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  info: 'bg-info',
  indigo: 'bg-accent-indigo',
  violet: 'bg-accent-violet',
}

function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
  ...rest
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...rest}
    >
      {dot && (
        <span
          className={clsx(
            'flex-shrink-0 rounded-full',
            size === 'xs' || size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotColors[variant]
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

export default Badge
