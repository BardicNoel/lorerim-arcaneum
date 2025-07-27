import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'

interface SearchTypeBadgeProps {
  type: string
  className?: string
  variant?: 'default' | 'secondary' | 'outline'
}

const TYPE_CONFIG = {
  skill: {
    label: 'Skill',
    icon: '⚔️',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  race: {
    label: 'Race',
    icon: '👤',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  trait: {
    label: 'Trait',
    icon: '🎯',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
  religion: {
    label: 'Religion',
    icon: '⛪',
    color:
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
  birthsign: {
    label: 'Birthsign',
    icon: '⭐',
    color:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  },
  destiny: {
    label: 'Destiny',
    icon: '🌟',
    color:
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  },
  perk: {
    label: 'Perk',
    icon: '🔮',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  },
}

export function SearchTypeBadge({
  type,
  className,
  variant = 'default',
}: SearchTypeBadgeProps) {
  const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || {
    label: type.charAt(0).toUpperCase() + type.slice(1),
    icon: '📄',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  }

  if (variant === 'default') {
    return (
      <Badge
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium',
          config.color,
          className
        )}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </Badge>
    )
  }

  return (
    <Badge
      variant={variant}
      className={cn('inline-flex items-center gap-1', className)}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </Badge>
  )
}
