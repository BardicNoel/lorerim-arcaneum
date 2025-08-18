import React from 'react'
import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { getGameTextFormattingOptions } from '@/shared/utils/gameTextFormatting'
import type { EnchantmentEffect } from '../../types'

interface EffectDisplayProps {
  effect: EnchantmentEffect
  className?: string
  showDescription?: boolean
  compact?: boolean
}

export const EffectDisplay = React.memo<EffectDisplayProps>(({
  effect,
  className,
  showDescription = true,
  compact = false
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {effect.name}
        </span>
      </div>
      
      {showDescription && (
        <div className="pl-5">
          <FormattedText
            text={effect.description}
            options={getGameTextFormattingOptions()}
            className="text-sm text-muted-foreground"
          />
        </div>
      )}
    </div>
  )
})

interface EffectsListProps {
  effects: EnchantmentEffect[]
  title?: string
  className?: string
  showDescriptions?: boolean
  compact?: boolean
  maxDisplay?: number
}

export const EffectsList = React.memo<EffectsListProps>(({
  effects,
  title = 'Effects',
  className,
  showDescriptions = true,
  compact = false,
  maxDisplay = 3
}) => {
  if (effects.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        No effects
      </div>
    )
  }
  
  const displayEffects = effects.slice(0, maxDisplay)
  const hasMore = effects.length > maxDisplay
  
  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {title}
        </h4>
      )}
      
      <div className={cn(
        'space-y-2',
        compact ? 'text-sm' : 'text-base'
      )}>
        {displayEffects.map((effect, index) => (
          <div key={`${effect.name}-${index}`} className="p-2 rounded bg-muted border">
            <EffectDisplay
              effect={effect}
              showDescription={showDescriptions}
              compact={compact}
            />
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
})
