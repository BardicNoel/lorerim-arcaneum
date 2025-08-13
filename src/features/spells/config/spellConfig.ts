import { Eye, Flame, Ghost, Heart, Shield, Sparkles, Trees } from 'lucide-react'
import type { ComponentType } from 'react'

// School icon mappings
export const schoolIcons: Record<string, ComponentType<any>> = {
  'Alteration': Trees,
  'Conjuration': Ghost,
  'Destruction': Flame,
  'Illusion': Eye,
  'Restoration': Heart,
  'Mysticism': Sparkles,
}

// School color mappings for badges and other UI elements
export const schoolColors: Record<string, string> = {
  'Alteration': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  'Conjuration': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  'Destruction': 'bg-red-500/20 text-red-700 border-red-500/30',
  'Illusion': 'bg-pink-500/20 text-pink-700 border-pink-500/30',
  'Restoration': 'bg-green-500/20 text-green-700 border-green-500/30',
  'Mysticism': 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
}

// School color mappings for badges (solid colors)
export const schoolBadgeColors: Record<string, string> = {
  'Alteration': 'bg-blue-500 text-white',
  'Conjuration': 'bg-purple-500 text-white',
  'Destruction': 'bg-red-500 text-white',
  'Illusion': 'bg-indigo-500 text-white',
  'Restoration': 'bg-green-500 text-white',
  'Mysticism': 'bg-yellow-500 text-white',
}

// Level color mappings
export const levelColors: Record<string, string> = {
  'Novice': 'bg-gray-500/20 text-gray-700 border-gray-500/30',
  'Apprentice': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  'Adept': 'bg-green-500/20 text-green-700 border-green-500/30',
  'Expert': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  'Master': 'bg-red-500/20 text-red-700 border-red-500/30',
}

// Level order for sorting
export const levelOrder: Record<string, number> = {
  'Novice': 1,
  'Apprentice': 2,
  'Adept': 3,
  'Expert': 4,
  'Master': 5,
}

// Size classes for icons
export const iconSizeClasses = {
  sm: 'w-6 h-6 text-sm',
  md: 'w-8 h-8 text-base',
  lg: 'w-10 h-10 text-lg',
  xl: 'w-12 h-12 text-xl',
  '2xl': 'w-16 h-16 text-2xl',
}

// Size classes for badges
export const badgeSizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}
