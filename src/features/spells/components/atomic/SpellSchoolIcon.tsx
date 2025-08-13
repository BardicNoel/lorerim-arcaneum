import { cn } from '@/lib/utils'
import React from 'react'
import { schoolIcons, iconSizeClasses } from '../../config/spellConfig'

interface SpellSchoolIconProps {
  school: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

// White circular background with black icons in both light and dark modes
const containerBgClass = 'bg-white dark:bg-white'

export function SpellSchoolIcon({ 
  school, 
  size = 'md', 
  className 
}: SpellSchoolIconProps) {
  const IconComponent = schoolIcons[school] || schoolIcons['Mysticism']
  
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full overflow-hidden',
        containerBgClass,
        iconSizeClasses[size],
        className
      )}
      title={`${school} magic`}
    >
      <IconComponent className="w-full h-full object-contain text-black dark:text-black" />
    </div>
  )
}
