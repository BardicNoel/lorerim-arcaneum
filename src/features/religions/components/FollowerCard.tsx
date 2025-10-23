import { cn } from '@/lib/utils'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { H3, P } from '@/shared/ui/ui/typography'
import { Clock, Target, Zap } from 'lucide-react'
import type { Religion } from '../types'

interface FollowerCardProps {
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
 * Component to format blessing descriptions with styled values
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

  // First, clean up any existing angle brackets that might interfere
  let formatted = description.replace(/<[^>]*>/g, '')

  // Replace magnitude placeholders
  formatted = formatted.replace(/<mag>/g, magnitude.toString())
  formatted = formatted.replace(/<magnitude>/g, magnitude.toString())

  // Replace duration placeholders
  formatted = formatted.replace(/<dur>/g, duration.toString())
  formatted = formatted.replace(/<duration>/g, duration.toString())

  // Replace area placeholders
  if (area > 0) {
    formatted = formatted.replace(/<area>/g, area.toString())
  }

  // Replace common variable names with simple letters
  formatted = formatted
    .replace(/\b(magnitude|mag)\b/gi, magnitude.toString())
    .replace(/\b(duration|dur)\b/gi, duration.toString())
    .replace(/\b(area)\b/gi, area.toString())

  return <P className="text-sm text-muted-foreground">{formatted}</P>
}

export function FollowerCard({
  religion,
  className,
  onClick,
  showToggle = true,
}: FollowerCardProps) {
  const followerBoon = religion.boon1
  const effectsCount = followerBoon?.effects?.length || 0

  if (!followerBoon || effectsCount === 0) {
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
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <H3 className="text-lg font-semibold">
              Follower of {religion.name}
            </H3>
            <P className="text-sm text-muted-foreground">
              {effectsCount} power{effectsCount !== 1 ? 's' : ''}
            </P>
          </div>
        </div>
        {showToggle && (
          <AddToBuildSwitchSimple
            item={{
              id: `follower-${religion.name}`,
              name: `Follower of ${religion.name}`,
              category: 'Follower',
              description: followerBoon.effects[0]?.effectDescription || '',
              effects: followerBoon.effects.map(effect => ({
                name: effect.effectName,
                description: effect.effectDescription,
                magnitude: effect.magnitude,
                duration: effect.duration,
                area: effect.area,
              })),
              tags: [],
              summary: '',
            }}
          />
        )}
      </div>

      <div className="space-y-3">
        {followerBoon.effects
          .filter(
            effect => effect.effectType !== '1' && effect.effectType !== '3'
          )
          .slice(0, 2) // Show only first 2 effects in card
          .map((effect, index) => (
            <div
              key={index}
              className="p-3 bg-muted/30 rounded-lg border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <P className="font-medium text-sm mb-2">
                    {effect.effectName}
                  </P>
                  <FormattedBlessingDescription
                    description={effect.effectDescription}
                    magnitude={effect.magnitude}
                    duration={effect.duration}
                    area={effect.area}
                  />
                  {effect.duration > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Lasts for {formatDuration(effect.duration)}</span>
                    </div>
                  )}
                  {effect.area > 0 && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      <span>Area: {effect.area}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {effectsCount > 2 && (
        <div className="mt-3 pt-3 border-t border-border">
          <P className="text-xs text-muted-foreground">
            +{effectsCount - 2} more power{effectsCount - 2 !== 1 ? 's' : ''}
          </P>
        </div>
      )}
    </div>
  )
}









