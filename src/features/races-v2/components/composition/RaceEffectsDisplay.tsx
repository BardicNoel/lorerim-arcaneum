import React from 'react'
import { cn } from '@/lib/utils'
import { H5, P } from '@/shared/ui/ui/typography'
import { Star } from 'lucide-react'

interface Effect {
  name: string
  description?: string
}

interface RaceEffectsDisplayProps {
  effects: Effect[]
  title?: string
  className?: string
  maxDisplay?: number
  compact?: boolean
  showDescriptions?: boolean
}

export function RaceEffectsDisplay({
  effects,
  title = 'Effects',
  className,
  maxDisplay,
  compact = false,
  showDescriptions = true,
}: RaceEffectsDisplayProps) {
  if (!effects || effects.length === 0) return null

  const displayEffects = maxDisplay ? effects.slice(0, maxDisplay) : effects
  const hasMore = maxDisplay && effects.length > maxDisplay

  return (
    <div className={cn('space-y-3', className)}>
      {title && <H5 className="text-lg font-medium text-foreground">{title}</H5>}
      
      {compact ? (
        // Compact view - just the effects list
        <div className="flex flex-wrap gap-2">
          {displayEffects.map((effect, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
              title={effect.description}
            >
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="font-medium">{effect.name}</span>
            </div>
          ))}
          {hasMore && (
            <div className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
              +{effects.length - maxDisplay!} more
            </div>
          )}
        </div>
      ) : (
        // Full view - effects with descriptions
        <div className="space-y-3">
          {displayEffects.map((effect, index) => (
            <div
              key={index}
              className="p-3 bg-muted/30 rounded-lg border border-muted"
            >
              <div className="flex items-start gap-2">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h6 className="font-medium text-sm">{effect.name}</h6>
                  {showDescriptions && effect.description && (
                    <P className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {effect.description}
                    </P>
                  )}
                </div>
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="text-center text-xs text-muted-foreground py-2">
              +{effects.length - maxDisplay!} more effects
            </div>
          )}
        </div>
      )}
    </div>
  )
} 