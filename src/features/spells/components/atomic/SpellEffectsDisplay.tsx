import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

interface SpellEffect {
  name: string
  description: string
  magnitude: number
  duration: number
  area: number
}

interface SpellEffectsDisplayProps {
  effects: SpellEffect[]
  title?: string
  compact?: boolean
  maxDisplay?: number
  className?: string
}

export function SpellEffectsDisplay({ 
  effects, 
  title = 'Spell Effects',
  compact = false,
  maxDisplay = 3,
  className 
}: SpellEffectsDisplayProps) {
  if (!effects || effects.length === 0) {
    return null
  }

  const displayEffects = effects.slice(0, maxDisplay)
  const hasMore = effects.length > maxDisplay

  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {title}
          {effects.length > 1 && (
            <span className="text-xs text-muted-foreground/70">
              ({effects.length})
            </span>
          )}
        </h4>
      )}
      
      <div className={cn(
        'space-y-1',
        compact ? 'text-sm' : 'text-base'
      )}>
        {displayEffects.map((effect, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <div className="font-medium text-foreground">
                {effect.name}
              </div>
              {!compact && effect.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {effect.description}
                </div>
              )}
              {!compact && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  {effect.magnitude > 0 && (
                    <span>Magnitude: {effect.magnitude}</span>
                  )}
                  {effect.duration > 0 && (
                    <span>Duration: {effect.duration}s</span>
                  )}
                  {effect.area > 0 && (
                    <span>Area: {effect.area}ft</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {hasMore && (
          <div className="text-sm text-muted-foreground italic">
            +{effects.length - maxDisplay} more effects
          </div>
        )}
      </div>
    </div>
  )
}
