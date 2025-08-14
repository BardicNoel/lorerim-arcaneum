import { FormattedText } from '@/shared/components/generic/FormattedText'
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
  Heart,
  Shield,
  Star,
  Sword,
  Target,
  Zap,
} from 'lucide-react'
import React from 'react'
import type { Religion } from '../types'
import { ReligionAvatar } from './atomic/ReligionAvatar'

interface BlessingSheetProps {
  religion: Religion | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

// Enhanced icon mapping for religion effects
const effectIcons: Record<string, React.ReactNode> = {
  Restoration: <Heart className="h-4 w-4 text-green-500" />,
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

function getEffectIcon(effectType: string): React.ReactNode {
  return effectIcons[effectType] || <Star className="h-4 w-4 text-gray-500" />
}

export function BlessingSheet({
  religion,
  isOpen,
  onOpenChange,
}: BlessingSheetProps) {
  if (!religion) return null

  const blessing = religion.blessing
  const effectsCount = blessing?.effects?.length || 0

  if (!blessing || effectsCount === 0) {
    return null
  }

  return (
    <ResponsivePanel
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Blessing of ${religion.name}`}
      description="Divine blessing granted to worshippers"
    >
      <div className="space-y-6">
        {/* Header with Add to Build */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ReligionAvatar religionName={religion.name} size="lg" />
            <div>
              <H3 className="text-xl font-semibold">
                Blessing of {religion.name}
              </H3>
              <P className="text-sm text-muted-foreground">
                {effectsCount} effect{effectsCount !== 1 ? 's' : ''}
              </P>
            </div>
          </div>
          <AddToBuildSwitchSimple
            itemId={`blessing-${religion.name}`}
            itemType="religion"
            itemName={`Blessing of ${religion.name}`}
          />
        </div>

        {/* Blessing Effects */}
        <div>
          <H3 className="text-lg font-semibold mb-3">Blessing Effects</H3>
          <div className="space-y-3">
            {blessing.effects
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
                      <ReligionAvatar religionName={religion.name} size="sm" />
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

        {/* Religion Information */}
        <div className="pt-4 border-t border-border">
          <H3 className="text-lg font-semibold mb-3">About {religion.name}</H3>
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
