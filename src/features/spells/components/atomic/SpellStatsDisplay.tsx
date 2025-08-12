import { cn } from '@/lib/utils'
import { Clock, Target, Zap } from 'lucide-react'

interface SpellStats {
  magickaCost: number
  duration?: number
  area?: number
  magnitude?: number
}

interface SpellStatsDisplayProps {
  stats: SpellStats
  title?: string
  compact?: boolean
  className?: string
}

export function SpellStatsDisplay({ 
  stats, 
  title = 'Spell Stats',
  compact = false,
  className 
}: SpellStatsDisplayProps) {
  const hasStats = stats.duration !== undefined || stats.area !== undefined || stats.magnitude !== undefined

  if (!hasStats && stats.magickaCost === 0) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      )}
      
      <div className={cn(
        'grid gap-2',
        compact ? 'grid-cols-2' : 'grid-cols-1'
      )}>
        {/* Magicka Cost */}
        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{stats.magickaCost === 0 ? 'Free' : `${stats.magickaCost} MP`}</span>
        </div>

        {/* Duration */}
        {stats.duration !== undefined && stats.duration > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="font-medium">{stats.duration}s</span>
          </div>
        )}

        {/* Area */}
        {stats.area !== undefined && stats.area > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-green-500" />
            <span className="font-medium">{stats.area}ft</span>
          </div>
        )}

        {/* Magnitude */}
        {stats.magnitude !== undefined && stats.magnitude > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="h-4 w-4 text-purple-500 font-bold">⚡</span>
            <span className="font-medium">{stats.magnitude}</span>
          </div>
        )}
      </div>
    </div>
  )
}
