import { cn } from '@/lib/utils'

interface AttributeStatBarProps {
  value: number
  label: string
  color?: 'red' | 'blue' | 'green'
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
  maxValue?: number // Optional max value for scaling
}

const colorClasses = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

export function AttributeStatBar({
  value,
  label,
  color = 'blue',
  size = 'md',
  showValue = true,
  className,
  maxValue,
}: AttributeStatBarProps) {
  // Calculate percentage based on the provided maxValue or use 100% as base
  const percentage = maxValue ? Math.min((value / maxValue) * 100, 100) : 100

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        {showValue && (
          <span className="text-xs font-medium text-muted-foreground">
            {value}
          </span>
        )}
      </div>
      <div className="w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'transition-all duration-300 ease-out',
            colorClasses[color],
            sizeClasses[size]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
