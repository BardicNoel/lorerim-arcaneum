import React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import type { EnchantmentTargetType, EnchantmentItemType } from '../../types'

interface EnchantmentBadgeProps {
  type: 'category' | 'targetType' | 'itemType'
  value: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'secondary' | 'outline'
  className?: string
}

const badgeColors = {
  category: {
    'Standard Enchantments (Touch)': 'bg-blue-100 text-blue-800 border-blue-200',
    'Standard Enchantments (Self)': 'bg-green-100 text-green-800 border-green-200'
  },
  targetType: {
    touch: 'bg-red-100 text-red-800 border-red-200',
    self: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  itemType: {
    weapon: 'bg-orange-100 text-orange-800 border-orange-200',
    armor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
}

const badgeIcons = {
  category: {
    'Standard Enchantments (Touch)': '⚔️',
    'Standard Enchantments (Self)': '🛡️'
  },
  targetType: {
    touch: '⚔️',
    self: '🛡️'
  },
  itemType: {
    weapon: '🗡️',
    armor: '🛡️'
  }
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm'
}

export const EnchantmentBadge = React.memo<EnchantmentBadgeProps>(({
  type,
  value,
  size = 'md',
  variant = 'default',
  className
}) => {
  const colors = badgeColors[type] as Record<string, string>
  const icons = badgeIcons[type] as Record<string, string>
  
  const badgeStyle = colors[value] || 'bg-gray-100 text-gray-800 border-gray-200'
  const icon = icons[value] || '📋'
  
  if (variant === 'outline') {
    return (
      <Badge
        variant="outline"
        className={cn(
          sizeClasses[size],
          'inline-flex items-center gap-1',
          className
        )}
      >
        <span>{icon}</span>
        <span>{value}</span>
      </Badge>
    )
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        sizeClasses[size],
        badgeStyle,
        className
      )}
    >
      <span>{icon}</span>
      <span>{value}</span>
    </span>
  )
})
