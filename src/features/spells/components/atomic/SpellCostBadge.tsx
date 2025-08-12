import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'

interface SpellCostBadgeProps {
  cost: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  showIcon?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

const variantClasses = {
  default: 'bg-primary text-primary-foreground',
  outline: 'border border-border bg-background text-foreground',
  ghost: 'bg-muted text-muted-foreground',
}

const getCostTier = (cost: number): string => {
  if (cost === 0) return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
  if (cost <= 25) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
  if (cost <= 50) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
  if (cost <= 100) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
  return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
}

export function SpellCostBadge({ 
  cost, 
  size = 'md', 
  variant = 'default',
  showIcon = true,
  className 
}: SpellCostBadgeProps) {
  const colorClass = getCostTier(cost)
  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        sizeClasses[size],
        variant === 'default' ? colorClass : variantClasses[variant],
        className
      )}
      title={`${cost} Magicka`}
    >
      {showIcon && <Zap className={iconSize} />}
      {cost === 0 ? 'Free' : cost}
    </span>
  )
}
