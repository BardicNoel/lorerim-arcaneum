import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'

interface SpellBadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'school' | 'level' | 'effect' | 'cost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantStyles = {
  default: 'bg-primary text-primary-foreground',
  school: 'bg-blue-100 text-blue-800',
  level: 'bg-purple-100 text-purple-800',
  effect: 'bg-green-100 text-green-800',
  cost: 'bg-orange-100 text-orange-800',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
}

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
}

export function SpellBadge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: SpellBadgeProps) {
  return (
    <Badge 
      variant={variant === 'outline' ? 'outline' : 'default'}
      className={cn(
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </Badge>
  )
}

// Specialized badge components
export function SchoolBadge({ school, className }: { school: string; className?: string }) {
  return (
    <SpellBadge variant="school" className={className}>
      {school}
    </SpellBadge>
  )
}

export function LevelBadge({ level, className }: { level: string; className?: string }) {
  const levelColors = {
    'Novice': 'bg-green-100 text-green-800',
    'Apprentice': 'bg-blue-100 text-blue-800',
    'Adept': 'bg-purple-100 text-purple-800',
    'Expert': 'bg-orange-100 text-orange-800',
    'Master': 'bg-red-100 text-red-800'
  }

  return (
    <SpellBadge 
      variant="level" 
      className={cn(levelColors[level as keyof typeof levelColors], className)}
    >
      {level}
    </SpellBadge>
  )
}

export function CostBadge({ cost, className }: { cost: number; className?: string }) {
  const costVariant = cost === 0 ? 'effect' : cost <= 50 ? 'default' : 'cost'
  
  return (
    <SpellBadge variant={costVariant} className={className}>
      {cost} MP
    </SpellBadge>
  )
}

export function EffectBadge({ effect, className }: { effect: string; className?: string }) {
  return (
    <SpellBadge variant="effect" className={className}>
      {effect}
    </SpellBadge>
  )
} 