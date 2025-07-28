import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'

/**
 * Badge size options
 */
export type PerkBadgeSize = 'sm' | 'md' | 'lg'

/**
 * Perk badge types for different styling
 */
export type PerkBadgeType = 'skill' | 'category' | 'rank' | 'availability' | 'level'

/**
 * PerkReferenceBadge component for displaying skill categories, ranks, and availability
 */
interface PerkReferenceBadgeProps {
  label: string
  type: PerkBadgeType
  size?: PerkBadgeSize
  className?: string
}

// Badge styling for different perk types
const badgeStyles: Record<PerkBadgeType, Record<string, string>> = {
  skill: {
    // Skill tree colors
    'Alchemy': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    'Alteration': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    'Archery': 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
    'Block': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    'Conjuration': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
    'Destruction': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    'Enchanting': 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
    'Heavy Armor': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
    'Illusion': 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
    'Light Armor': 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    'Lockpicking': 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    'One-Handed': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    'Pickpocket': 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
    'Restoration': 'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200',
    'Smithing': 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    'Sneak': 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200',
    'Speech': 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
    'Two-Handed': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  },
  category: {
    // Perk categories
    'Combat': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
    'Magic': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
    'Stealth': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    'Crafting': 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
    'Survival': 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
    'Social': 'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
  },
  rank: {
    // Rank indicators
    'Rank 1': 'bg-blue-100 text-blue-800 border-blue-200',
    'Rank 2': 'bg-green-100 text-green-800 border-green-200',
    'Rank 3': 'bg-purple-100 text-purple-800 border-purple-200',
    'Rank 4': 'bg-orange-100 text-orange-800 border-orange-200',
    'Rank 5': 'bg-red-100 text-red-800 border-red-200',
  },
  availability: {
    // Availability states
    'Available': 'bg-green-100 text-green-800 border-green-200',
    'Unavailable': 'bg-red-100 text-red-800 border-red-200',
    'Prerequisites Met': 'bg-blue-100 text-blue-800 border-blue-200',
    'Prerequisites Missing': 'bg-gray-100 text-gray-800 border-gray-200',
  },
  level: {
    // Level requirement indicators
    'Level 1+': 'bg-green-100 text-green-800 border-green-200',
    'Level 5+': 'bg-blue-100 text-blue-800 border-blue-200',
    'Level 10+': 'bg-purple-100 text-purple-800 border-purple-200',
    'Level 15+': 'bg-orange-100 text-orange-800 border-orange-200',
    'Level 20+': 'bg-red-100 text-red-800 border-red-200',
    'Level 25+': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Level 30+': 'bg-pink-100 text-pink-800 border-pink-200',
    'Level 35+': 'bg-teal-100 text-teal-800 border-teal-200',
    'Level 40+': 'bg-cyan-100 text-cyan-800 border-cyan-200',
    'Level 45+': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Level 50+': 'bg-amber-100 text-amber-800 border-amber-200',
  },
}

// Size classes for consistent sizing
const sizeClasses: Record<PerkBadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

// Default fallback styling for unknown categories
const defaultBadgeStyle = 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'

export function PerkReferenceBadge({
  label,
  type,
  size = 'md',
  className,
}: PerkReferenceBadgeProps) {
  // Get the appropriate styling for this badge type and label
  const typeStyles = badgeStyles[type]
  const badgeStyle = typeStyles[label] || defaultBadgeStyle

  return (
    <Badge
      variant="outline"
      className={cn(
        badgeStyle,
        sizeClasses[size],
        'font-medium transition-colors',
        className
      )}
    >
      {label}
    </Badge>
  )
} 