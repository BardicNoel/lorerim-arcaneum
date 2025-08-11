import { cn } from '@/lib/utils'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { H4 } from '@/shared/ui/ui/typography'
import { Shield, Star, Zap } from 'lucide-react'
import type { Birthsign } from '../types'

interface BirthsignEffectsDisplayProps {
  birthsign?: Birthsign
  title?: string
  maxDisplay?: number
  compact?: boolean
  className?: string
}

export function BirthsignEffectsDisplay({
  birthsign,
  title,
  maxDisplay,
  compact = false,
  className,
}: BirthsignEffectsDisplayProps) {
  if (!birthsign) return null

  const hasPowers = birthsign.powers.length > 0
  const hasConditionalEffects = birthsign.conditional_effects?.length > 0
  const hasMasteryEffects = birthsign.mastery_effects?.length > 0

  if (!hasPowers && !hasConditionalEffects && !hasMasteryEffects) {
    return null
  }

  // For compact mode, show limited effects
  if (compact) {
    const allEffects = [
      ...birthsign.powers.map(power => ({ type: 'power', data: power })),
      ...(birthsign.conditional_effects?.map(effect => ({
        type: 'conditional',
        data: effect,
      })) || []),
      ...(birthsign.mastery_effects?.map(effect => ({
        type: 'mastery',
        data: effect,
      })) || []),
    ]

    const displayEffects = maxDisplay
      ? allEffects.slice(0, maxDisplay)
      : allEffects

    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {displayEffects.map((effect, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-skyrim-gold/20 text-skyrim-gold border border-skyrim-gold/30 rounded-full text-xs font-medium"
          >
            <Star className="h-3 w-3" />
            {effect.data.name || effect.data.stat}
          </div>
        ))}
        {maxDisplay && allEffects.length > maxDisplay && (
          <div className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground border rounded-full text-xs font-medium">
            +{allEffects.length - maxDisplay} more
          </div>
        )}
      </div>
    )
  }

  // Full display mode
  return (
    <Card className={cn('border-muted/50', className)}>
      {title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Powers */}
        {hasPowers && (
          <div>
            <H4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Powers
            </H4>
            <div className="space-y-2">
              {birthsign.powers.map((power, index) => (
                <div
                  key={index}
                  className="p-3 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">{power.name}</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <FormattedText text={power.description} />
                  {(power.magnitude || power.duration) && (
                    <div className="space-y-2 text-sm mt-2">
                      {power.magnitude && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium min-w-[80px]">
                            Magnitude:
                          </span>
                          <span>{power.magnitude}</span>
                        </div>
                      )}
                      {power.duration && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium min-w-[80px]">
                            Duration:
                          </span>
                          <span>{power.duration}s</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conditional Effects */}
        {hasConditionalEffects && (
          <div>
            <H4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              Conditional Effects
            </H4>
            <div className="space-y-2">
              {birthsign.conditional_effects.map((effect, index) => (
                <div key={index} className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-100 text-purple-800 border-purple-200"
                    >
                      Conditional
                    </Badge>
                    <span className="font-medium text-sm capitalize">
                      {effect.stat}
                    </span>
                  </div>
                  <FormattedText text={effect.description} />
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Condition:</strong> {effect.condition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mastery Effects */}
        {hasMasteryEffects && (
          <div>
            <H4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-blue-500" />
              Mastery Effects
            </H4>
            <div className="space-y-2">
              {birthsign.mastery_effects.map((effect, index) => (
                <div key={index} className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-sm">Mastery Effect</span>
                  </div>
                  <div className="border-t border-border my-2" />
                  <div className="text-sm font-medium capitalize">
                    {effect.stat}
                  </div>
                  <FormattedText text={effect.description} />
                  {effect.condition && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Requirement:</strong> {effect.condition}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
