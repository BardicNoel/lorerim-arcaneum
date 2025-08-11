import { Button } from '@/shared/ui/ui/button'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/ui/sheet'
import { H4, P } from '@/shared/ui/ui/typography'
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
  X,
  Zap,
} from 'lucide-react'
import React from 'react'
import type { Religion } from '../types'
import { ReligionAvatar, ReligionCategoryBadge } from './atomic'

interface ReligionSheetProps {
  religion: Religion | null
  isOpen: boolean
  onClose: () => void
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
    // Simple variable replacements
    .replace(/Global_modifier/g, '<X>')
    .replace(/Global_Modifier/g, '<X>')
    .replace(/global_modifier/g, '<X>')
    .replace(/Magnitude/g, '<Y>')
    .replace(/magnitude/g, '<Y>')
    .replace(/Duration/g, '<Z>')
    .replace(/duration/g, '<Z>')
    .replace(/Area/g, '<A>')
    .replace(/area/g, '<A>')
    // Complex variable patterns
    .replace(/Global=WSN_Favor_Global_Fractional%/g, '<X>')
    .replace(/Global=WSN_[^%]+%/g, '<X>')
    .replace(/WSN_[^%]+%/g, '<X>')
    .replace(/Global=[^%]+%/g, '<X>')
    .replace(/[A-Z_]+_Global_[A-Z_]+/g, '<X>')
    .replace(/[A-Z_]+_Favor_[A-Z_]+/g, '<X>')
    .replace(/[A-Z_]+_Fractional%/g, '<X>')
    .replace(/[A-Z_]+_Global%/g, '<X>')
    .replace(/[A-Z_]+_Favor%/g, '<X>')
    .replace(/Global_[A-Z_]+%/g, '<X>')
    .replace(/Favor_[A-Z_]+%/g, '<X>')
    .replace(/[A-Z_]+_Global/g, '<X>')
    .replace(/[A-Z_]+_Favor/g, '<X>')
    .replace(/Global_[A-Z_]+/g, '<X>')
    .replace(/Favor_[A-Z_]+/g, '<X>')

  // Split the formatted description by angle bracket patterns and highlight the values
  const parts = formatted.split(/(<[^>]+>)/g)

  return (
    <P className="text-sm text-muted-foreground">
      {parts.map((part, index) => {
        if (part.startsWith('<') && part.endsWith('>')) {
          // This is a value to highlight - remove the brackets and style it
          const value = part.slice(1, -1)
          return (
            <span key={index} className="font-bold italic text-skyrim-gold">
              {value}
            </span>
          )
        }
        return part
      })}
    </P>
  )
}

export function ReligionSheet({
  religion,
  isOpen,
  onClose,
}: ReligionSheetProps) {
  if (!religion) return null

  const getEffectIcon = (effectType: string) => {
    return (
      effectIcons[effectType] || <Star className="h-4 w-4 text-skyrim-gold" />
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-hidden">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <ReligionAvatar religionName={religion.name} size="3xl" />
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-2xl font-bold text-primary">
                {religion.name}
              </SheetTitle>
              {religion.type && (
                <ReligionCategoryBadge
                  category={religion.type}
                  size="md"
                  className="mt-2"
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Favored Races */}
            {religion.favoredRaces && religion.favoredRaces.length > 0 && (
              <div>
                <H4 className="text-lg font-semibold mb-3">Favored Races</H4>
                <div className="flex flex-wrap gap-2">
                  {religion.favoredRaces.map((race, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border"
                    >
                      <Star className="h-4 w-4 text-skyrim-gold" />
                      <span className="text-sm font-medium">{race}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Worship Restrictions */}
            {religion.worshipRestrictions &&
              religion.worshipRestrictions.length > 0 && (
                <div>
                  <H4 className="text-lg font-semibold mb-3">
                    Worship Restrictions
                  </H4>
                  <div className="space-y-2">
                    {religion.worshipRestrictions.map((restriction, index) => (
                      <div
                        key={index}
                        className="p-3 bg-muted/30 rounded-lg border border-border"
                      >
                        <div className="flex items-start gap-2">
                          <X className="h-4 w-4 text-red-500 mt-0.5" />
                          <P className="text-sm text-muted-foreground">
                            {restriction}
                          </P>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Blessing Details */}
            {religion.blessing && religion.blessing.effects.length > 0 && (
              <div>
                <H4 className="text-lg font-semibold mb-3">
                  Blessing of {religion.name}
                </H4>
                <div className="space-y-3">
                  {religion.blessing.effects
                    .filter(
                      effect =>
                        effect.effectType !== '1' && effect.effectType !== '3'
                    )
                    .map((effect, index) => (
                      <div
                        key={index}
                        className="p-4 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            {effect.effectType &&
                              getEffectIcon(effect.effectType)}
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
            )}

            {/* Tenet Effects */}
            {religion.tenet?.effects && religion.tenet.effects.length > 0 && (
              <div>
                <H4 className="text-lg font-semibold mb-3">
                  Tenets of {religion.name}
                </H4>
                <div className="space-y-3">
                  {religion.tenet.effects.map((effect, index) => {
                    // Split the effect description by periods to create separate tenets
                    const tenetSentences = effect.effectDescription
                      .split('.')
                      .filter(sentence => sentence.trim().length > 0)

                    return tenetSentences.map((tenet, tenetIndex) => (
                      <div
                        key={`${index}-${tenetIndex}`}
                        className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          {effect.targetAttribute &&
                            getEffectIcon(effect.targetAttribute)}
                        </div>
                        <div className="flex-1">
                          <P className="text-sm text-muted-foreground">
                            {tenet.trim() + '.'}
                          </P>
                        </div>
                      </div>
                    ))
                  })}
                </div>
              </div>
            )}

            {/* Boons Section - Follower and Devotee Powers */}
            {(religion.boon1 || religion.boon2) && (
              <div>
                <H4 className="text-lg font-semibold mb-3">
                  Boons of {religion.name}
                </H4>
                <div className="space-y-4">
                  {/* Follower Power (Boon 1) */}
                  {religion.boon1 && religion.boon1.effects.length > 0 && (
                    <div>
                      <H4 className="text-md font-medium mb-2">
                        Follower Boon
                      </H4>
                      <div className="space-y-3">
                        {religion.boon1.effects.map((effect, index) => (
                          <div
                            key={index}
                            className="p-4 bg-muted/50 rounded-lg border border-border"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                {effect.effectType &&
                                  getEffectIcon(effect.effectType)}
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
                                      Lasts for{' '}
                                      {formatDuration(effect.duration)}
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
                  )}

                  {/* Devotee Power (Boon 2) */}
                  {religion.boon2 && religion.boon2.effects.length > 0 && (
                    <div>
                      <H4 className="text-md font-medium mb-2">Devotee Boon</H4>
                      <div className="space-y-3">
                        {religion.boon2.effects.map((effect, index) => (
                          <div
                            key={index}
                            className="p-4 bg-muted/50 rounded-lg border border-border"
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-purple-500" />
                                {effect.effectType &&
                                  getEffectIcon(effect.effectType)}
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
                                      Lasts for{' '}
                                      {formatDuration(effect.duration)}
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
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="pt-4 border-t">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
