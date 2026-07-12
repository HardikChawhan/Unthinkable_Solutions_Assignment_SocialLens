import clsx from 'clsx'

function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  count = 1,
  ...rest
}) {
  const baseClass = 'shimmer bg-surface2'

  const variantClass = {
    text: 'rounded-md',
    rect: 'rounded-xl',
    circle: 'rounded-full',
    line: 'rounded-full h-3',
  }

  if (count > 1) {
    return (
      <div className={clsx('flex flex-col gap-2', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              baseClass,
              variantClass[variant],
              i === count - 1 && variant === 'text' ? 'w-3/4' : 'w-full'
            )}
            style={{
              width: i === count - 1 && variant === 'text' ? undefined : width,
              height: height || (variant === 'text' || variant === 'line' ? '1rem' : '1.5rem'),
            }}
            aria-hidden="true"
            {...rest}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={clsx(
        baseClass,
        variantClass[variant],
        className
      )}
      style={{
        width: width || (variant === 'circle' ? height : undefined),
        height: height || (variant === 'circle' ? width : '1rem'),
      }}
      aria-hidden="true"
      {...rest}
    />
  )
}

// Preset skeleton layouts
export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width="2.5rem" height="2.5rem" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" height="1rem" />
          <Skeleton variant="text" width="40%" height="0.75rem" />
        </div>
      </div>
      <Skeleton variant="rect" height="6rem" />
      <Skeleton variant="text" count={3} />
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return <Skeleton variant="text" count={lines} />
}

export function SkeletonMetricCard() {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width="40%" height="0.875rem" />
        <Skeleton variant="circle" width="2rem" height="2rem" />
      </div>
      <Skeleton variant="text" width="50%" height="2rem" />
      <Skeleton variant="text" width="30%" height="0.75rem" />
    </div>
  )
}

export default Skeleton
