import { ResponsivePanel } from '@/shared/components/generic/ResponsivePanel'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { H3, P } from '@/shared/ui/ui/typography'
import {
  BookOpen,
  Brain,
  Clock,
  Droplets,
  Eye,
  Flame,
  Hand,
  Shield,
  Star,
  Sword,
  Target,
  Zap,
} from 'lucide-react'
import React from 'react'
import type { Religion } from '../types'

interface FollowerSheetProps {
  religion: Religion | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

// Enhanced icon mapping for religion effects
const effectIcons: Record<string, React.ReactNode> = {
  Restoration: <Brain className="h-4 w-4 text-green-500" />,
  Destruction: <Flame className="h-4 w-4 text-red-500" />,
  Alteration: <Shield className="h-4 w-4 text-blue-500" />,
  Illusion: <Brain className="h-4 w-4 text-purple-500" />,
  Conjuration: <Zap className="h-4 w-4 text-purple-500" />,
  Enchanting: <BookOpen className="h-4 w-4 text-blue-500" />,
  Alchemy: <Droplets className="h-4 w-4 text-green-500" />,
  'Light Armor': <Shield className="h-4 w-4 text-blue-500" />,
  'Heavy Armor': <Shield className="h-4 w-4 text-gray-500" />,
  'One-Handed': <Sword className="h-4 w-4 text-orange-500" />,
  'Two-Handed': <Sword className="h-4 w-4 text-red-500" />,
  Archery: <Target className="h-4 w-4 text-green-500" />,
  Block: <Shield className="h-4 w-4 text-yellow-500" />,
  Smithing: <Shield className="h-4 w-4 text-gray-500" />,
  Speechcraft: <Brain className="h-4 w-4 text-blue-500" />,
  Sneak: <Eye className="h-4 w-4 text-purple-500" />,
  Lockpicking: <Hand className="h-4 w-4 text-yellow-500" />,
  Pickpocket: <Hand className="h-4 w-4 text-purple-500" />,
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

function getEffectIcon(effectType: string): React.ReactNode {
  return effectIcons[effectType] || <Star className="h-4 w-4 text-gray-500" />
}

export function FollowerSheet({
  religion,
  isOpen,
  onOpenChange,
}: FollowerSheetProps) {
  if (!religion) return null

  const followerBoon = religion.boon1
  const effectsCount = followerBoon?.effects?.length || 0

  if (!followerBoon || effectsCount === 0) {
    return null
  }

  return (
    <ResponsivePanel
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Follower of ${religion.name}`}
      description="Powers granted to devoted followers"
    >
      <div className="space-y-6">
        {/* Header with Add to Build */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <H3 className="text-xl font-semibold">
                Follower of {religion.name}
              </H3>
              <P className="text-sm text-muted-foreground">
                {effectsCount} power{effectsCount !== 1 ? 's' : ''}
              </P>
            </div>
          </div>
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
        </div>

        {/* Follower Powers */}
        <div>
          <H3 className="text-lg font-semibold mb-3">Follower Powers</H3>
          <div className="space-y-3">
            {followerBoon.effects
              .filter(
                effect => effect.effectType !== '1' && effect.effectType !== '3'
              )
              .map((effect, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted/50 rounded-lg border border-border"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      {effect.effectType && getEffectIcon(effect.effectType)}
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
                          <span>
                            Lasts for {formatDuration(effect.duration)}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        {effect.area > 0 && (
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>Area: {effect.area}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Devotee Powers Preview */}
        {religion.boon2 && religion.boon2.effects.length > 0 && (
          <div className="pt-4 border-t border-border">
            <H3 className="text-lg font-semibold mb-3">
              Devotee Powers Preview
            </H3>
            <P className="text-sm text-muted-foreground mb-3">
              As a devoted follower, you can unlock even greater powers:
            </P>
            <div className="space-y-2">
              {religion.boon2.effects
                .filter(
                  effect =>
                    effect.effectType !== '1' && effect.effectType !== '3'
                )
                .slice(0, 2) // Show only first 2 effects as preview
                .map((effect, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/30 rounded-lg border border-border opacity-75"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      <P className="font-medium text-sm">{effect.effectName}</P>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Religion Information */}
        <div className="pt-4 border-t border-border">
          <H3 className="text-lg font-semibold mb-3">
            About Following {religion.name}
          </H3>
          <div className="space-y-3">
            <div>
              <P className="text-sm font-medium mb-1">Religion Type</P>
              <P className="text-sm text-muted-foreground">{religion.type}</P>
            </div>

            {religion.tenet?.description && (
              <div>
                <P className="text-sm font-medium mb-1">Tenets</P>
                <P className="text-sm text-muted-foreground">
                  {religion.tenet.description}
                </P>
              </div>
            )}

            {religion.favoredRaces && religion.favoredRaces.length > 0 && (
              <div>
                <P className="text-sm font-medium mb-1">Favored Races</P>
                <div className="flex flex-wrap gap-2">
                  {religion.favoredRaces.map((race, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                    >
                      {race}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResponsivePanel>
  )
}




