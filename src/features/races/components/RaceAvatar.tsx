import React from 'react'
import { cn } from '@/lib/utils'

interface RaceAvatarProps {
  raceName: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

// Map race names to avatar file names
const raceAvatarMap: Record<string, string> = {
  Altmer: 'altmer.png',
  Argonian: 'argonian.png',
  Bosmer: 'bosmer.png',
  Breton: 'breton.png',
  Dunmer: 'dunmer.png',
  Imperial: 'imperial.png',
  Khajiit: 'khajit.png',
  Nord: 'nord.png',
  Orsimer: 'orismer.png',
  Redguard: 'redguard.png'
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

export function RaceAvatar({ raceName, size = 'md', className }: RaceAvatarProps) {
  const avatarFileName = raceAvatarMap[raceName]
  const [imageError, setImageError] = React.useState(false)

  if (!avatarFileName || imageError) {    // Fallback to first letter avatar
    return (
      <div className={cn(
        'bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground',
        sizeClasses[size],
        className
      )}>
        <span className={cn(
          size === 'sm' && 'text-sm',
          size === 'md' && 'text-lg',
          size === 'lg' && 'text-xl',
          size === 'xl' && 'text-2xl'
        )}>
          {raceName.charAt(0)}
        </span>
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-full overflow-hidden bg-muted flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      <img
        src={`${import.meta.env.BASE_URL}assets/race-avatar/${avatarFileName}`}
        alt={`${raceName} avatar`}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  )
} 