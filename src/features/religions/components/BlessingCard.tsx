import { cn } from '@/lib/utils'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { H3, P } from '@/shared/ui/ui/typography'
import { Clock, Target } from 'lucide-react'
import type { Religion } from '../types'
import { ReligionAvatar } from './atomic/ReligionAvatar'

interface BlessingCardProps {
  religion: Religion
  className?: string
  onClick?: () => void
  showToggle?: boolean
}

/**
 * Function to format seconds to a readable time format
 */
function formatDuration(durationSeconds: number): string {
  if (durationSeconds < 60) {
    return `${durationSeconds}s`
  } else if (durationSeconds < 3600) {
    const minutes = Math.round(durationSeconds / 60)
    return `${minutes}m`
  } else {
    const hours = Math.round(durationSeconds / 3600)
    return `${hours}h`
  }
}

/**
 * Component to format blessing descriptions with inline magnitude values
 */
function FormattedBlessingDescription({
  description,
  magnitude,
  duration,
  area = 0,
}: {
  description: string
  magnitude: number
  duration: number
  area?: number
}) {
  if (!description) return null

  // Replace placeholders with actual values inline
  let formatted = description
    .replace(/<mag>/g, magnitude.toString())
    .replace(/<magnitude>/g, magnitude.toString())
    .replace(/<dur>/g, duration.toString())
    .replace(/<duration>/g, duration.toString())
    .replace(/<area>/g, area.toString())

  // Replace common variable names with actual values
  formatted = formatted
    .replace(/\b(magnitude|mag)\b/gi, magnitude.toString())
    .replace(/\b(duration|dur)\b/gi, duration.toString())
    .replace(/\b(area)\b/gi, area.toString())

  return (
    <FormattedText text={formatted} className="text-sm text-muted-foreground" />
  )
}

export function BlessingCard({
  religion,
  className,
  onClick,
  showToggle = true,
}: BlessingCardProps) {
  const blessing = religion.blessing
  const effectsCount = blessing?.effects?.length || 0

  if (!blessing || effectsCount === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'p-4 border rounded-2xl bg-card hover:bg-accent/50 transition-colors cursor-pointer',
        'hover:shadow-md hover:border-primary/50 hover:scale-[1.02] transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {/* Header Row - matches ReligionCard structure */}
      <div className="flex items-start gap-3 mb-3">
        {/* Avatar */}
        <ReligionAvatar religionName={religion.name} size="2xl" />

        {/* Title and Effects Count */}
        <div className="flex-1 min-w-0">
          <H3 className="text-lg font-semibold text-primary truncate">
            Blessing of {religion.name}
          </H3>
          <P className="text-sm text-muted-foreground mt-1">
            {effectsCount} effect{effectsCount !== 1 ? 's' : ''}
          </P>
        </div>

        {/* Toggle */}
        {showToggle && (
          <div onClick={e => e.stopPropagation()}>
            <AddToBuildSwitchSimple
              itemId={`blessing-${religion.name}`}
              itemType="religion"
              itemName={`Blessing of ${religion.name}`}
            />
          </div>
        )}
      </div>

      {/* Effects List - simplified inline display */}
      <div className="space-y-2">
        {blessing.effects
          .filter(
            effect => effect.effectType !== '1' && effect.effectType !== '3'
          )
          .slice(0, 2) // Show only first 2 effects in card
          .map((effect, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2 bg-muted/30 rounded-lg"
            >
              <div className="flex-1">
                <P className="font-medium text-sm mb-1">{effect.effectName}</P>
                <FormattedBlessingDescription
                  description={effect.effectDescription}
                  magnitude={effect.magnitude}
                  duration={effect.duration}
                  area={effect.area}
                />
                {(effect.duration > 0 || effect.area > 0) && (
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {effect.duration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Lasts for {formatDuration(effect.duration)}</span>
                      </div>
                    )}
                    {effect.area > 0 && (
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        <span>Area: {effect.area}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {effectsCount > 2 && (
        <div className="mt-3 pt-3 border-t border-border">
          <P className="text-xs text-muted-foreground">
            +{effectsCount - 2} more effect{effectsCount - 2 !== 1 ? 's' : ''}
          </P>
        </div>
      )}
    </div>
  )
}
