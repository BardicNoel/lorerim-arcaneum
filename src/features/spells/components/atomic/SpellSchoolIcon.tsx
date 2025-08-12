import { cn } from '@/lib/utils'
import { Eye, Flame, Ghost, Heart, Shield, Sparkles } from 'lucide-react'
import React from 'react'

interface SpellSchoolIconProps {
  school: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

const schoolIcons: Record<string, React.ComponentType<any>> = {
  'Alteration': Shield,
  'Conjuration': Ghost,
  'Destruction': Flame,
  'Illusion': Eye,
  'Restoration': Heart,
  'Mysticism': Sparkles,
}

const sizeClasses = {
  sm: 'w-6 h-6 text-sm',
  md: 'w-8 h-8 text-base',
  lg: 'w-10 h-10 text-lg',
  xl: 'w-12 h-12 text-xl',
  '2xl': 'w-16 h-16 text-2xl',
}

// White circular background with black icons in both light and dark modes
const containerBgClass = 'bg-white dark:bg-white'

export function SpellSchoolIcon({ 
  school, 
  size = 'md', 
  className 
}: SpellSchoolIconProps) {
  const IconComponent = schoolIcons[school] || Sparkles
  
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full overflow-hidden',
        containerBgClass,
        sizeClasses[size],
        className
      )}
      title={`${school} magic`}
    >
      <IconComponent className="w-full h-full object-contain text-black dark:text-black" />
    </div>
  )
}
