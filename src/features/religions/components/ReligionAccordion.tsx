import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import {
  Shield,
  Zap,
  Heart,
  Brain,
  Target,
  Flame,
  Droplets,
  Skull,
  Sword,
  BookOpen,
  Eye,
  Hand,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Circle,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Religion } from '../types'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { AccordionCard } from '@/shared/components/generic/AccordionCard'

/**
 * Component to format any description with highlighted values in angle brackets
 */
function FormattedText({
  text,
  className = 'text-sm text-muted-foreground',
}: {
  text: string
  className?: string
}) {
  if (!text) return null

  // First, clean up any existing angle brackets that might interfere
  let processedText = text.replace(/<[^>]*>/g, '')

  // Replace common variable names with simple letters wrapped in angle brackets
  processedText = processedText
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

  // Split the processed text by angle bracket patterns and highlight the values
  const parts = processedText.split(/(<[^>]+>)/g)

  return (
    <div className={className}>
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
    </div>
  )
}

/**
 * Component to format ability descriptions with highlighted values
 */
function FormattedDescription({ description }: { description: string }) {
  if (!description) return null

  // Split the description by angle bracket patterns and highlight the values
  const parts = description.split(/(<[^>]+>)/g)

  return (
    <P className="text-xs text-muted-foreground">
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

/**
 * Function to format blessing descriptions by replacing placeholders with actual values
 */
function formatBlessingDescription(
  description: string,
  magnitude: number,
  duration: number,
  area: number = 0
): string {
  if (!description) return ''

  let formatted = description

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

  return formatted
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
    <P className="text-xs text-muted-foreground">
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
 * Function to check if a description contains magnitude or duration placeholders
 */
function hasPlaceholders(description: string): {
  hasMagnitude: boolean
  hasDuration: boolean
} {
  const magnitudePatterns = [/<mag>/g, /<magnitude>/g]
  const durationPatterns = [/<dur>/g, /<duration>/g]

  const hasMagnitude = magnitudePatterns.some(pattern =>
    pattern.test(description)
  )
  const hasDuration = durationPatterns.some(pattern =>
    pattern.test(description)
  )

  return { hasMagnitude, hasDuration }
}

interface ReligionAccordionProps {
  item: PlayerCreationItem
  originalReligion?: Religion
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  showBlessings?: boolean
  showTenets?: boolean
  showBoons?: boolean
  showFavoredRaces?: boolean
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

// Religion type styling
const religionTypeStyles: Record<string, string> = {
  Divine: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  Daedric: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  Aedric: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  Tribal: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  Ancestral:
    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

/**
 * Render the left controls for a religion accordion
 */
export function renderReligionLeftControls(item: PlayerCreationItem) {
  return (
    <AddToBuildSwitchSimple
      itemId={item.id}
      itemType="religion"
      itemName={item.name}
    />
  )
}

/**
 * Render the header for a religion accordion
 */
export function renderReligionHeader(
  item: PlayerCreationItem,
  originalReligion?: Religion
) {
  return (
    <>
      {/* Left side: Name */}
      <div className="flex-1">
        <H3 className="text-primary font-semibold">{item.name}</H3>
      </div>

      {/* Right side: Classification + Effects */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Religion type tag */}
        {item.category && (
          <Badge
            variant="outline"
            className={cn(
              religionTypeStyles[item.category] ||
                'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
              sizeClasses.sm,
              'font-medium transition-colors'
            )}
          >
            {item.category}
          </Badge>
        )}

        {/* Favored Races badges */}
        {originalReligion?.favoredRaces &&
          originalReligion.favoredRaces.length > 0 && (
            <div className="flex items-center gap-1">
              {originalReligion.favoredRaces.map((race, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={cn(
                    'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                    sizeClasses.sm,
                    'font-medium transition-colors'
                  )}
                >
                  <Star className="h-3 w-3 mr-1" />
                  Favors {race}
                </Badge>
              ))}
            </div>
          )}

        {/* Quick effects preview */}
        {item.effects && item.effects.length > 0 && (
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{item.effects.length} effects</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Render the collapsed content for a religion accordion
 */
export function renderReligionCollapsedContent(
  item: PlayerCreationItem,
  originalReligion?: Religion
) {
  const getEffectIconByType = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'negative':
        return <Minus className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <Circle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-3">
      {/* Description */}
      <div className="line-clamp-2">
        <FormattedText
          text={item.summary || item.description}
          className="text-sm text-muted-foreground"
        />
      </div>

      {/* Quick effects */}
      <div className="flex flex-wrap gap-2">
        {item.effects?.slice(0, 2).map((effect, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
            title={effect.description}
          >
            {getEffectIconByType(effect.type)}
            <span className="font-medium">{effect.name}</span>
          </div>
        ))}
        {originalReligion?.favoredRaces?.slice(0, 2).map((race, index) => (
          <div
            key={`race-${index}`}
            className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
          >
            <Star className="h-3 w-3 text-skyrim-gold" />
            <span className="font-medium">{race}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Render the expanded content for a religion accordion
 */
export function renderReligionExpandedContent(
  item: PlayerCreationItem,
  originalReligion?: Religion
) {
  const getEffectIcon = (effectType: string) => {
    return (
      effectIcons[effectType] || <Star className="h-4 w-4 text-skyrim-gold" />
    )
  }

  const getEffectIconByType = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'negative':
        return <Minus className="h-4 w-4 text-red-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Description */}
      <div>
        <FormattedText
          text={item.description}
          className="text-sm text-muted-foreground leading-relaxed"
        />
      </div>

      {/* Favored Races */}
      {originalReligion?.favoredRaces &&
        originalReligion.favoredRaces.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Favored Races
            </h5>
            <div className="flex flex-wrap gap-2">
              {originalReligion.favoredRaces.map((race, index) => (
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
      {originalReligion?.worshipRestrictions &&
        originalReligion.worshipRestrictions.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Worship Restrictions
            </h5>
            <div className="space-y-2">
              {originalReligion.worshipRestrictions.map(
                (restriction, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-2">
                      <Minus className="h-4 w-4 text-red-500 mt-0.5" />
                      <FormattedText
                        text={restriction}
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Blessing Details */}
      {originalReligion?.blessing && (
        <div>
          <h5 className="text-lg font-medium text-foreground mb-3">
            Blessing of {item.name}
          </h5>
          <div className="space-y-3">
            {originalReligion.blessing.effects
              .filter(
                effect => effect.effectType !== '1' && effect.effectType !== '3'
              )
              .map((effect, index) => {
                const { hasMagnitude, hasDuration } = hasPlaceholders(
                  effect.effectDescription
                )

                return (
                  <div
                    key={index}
                    className="p-3 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getEffectIconByType('positive')}
                        {effect.effectType && getEffectIcon(effect.effectType)}
                      </div>
                      <div className="flex-1">
                        <P className="font-medium text-sm mb-1">
                          {effect.effectName}
                        </P>
                        <FormattedBlessingDescription
                          description={effect.effectDescription}
                          magnitude={effect.magnitude}
                          duration={effect.duration}
                          area={effect.area}
                        />
                        {hasDuration && effect.duration > 0 && (
                          <P className="text-xs text-muted-foreground mt-1">
                            Lasts for {formatDuration(effect.duration)}.
                          </P>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          {effect.area > 0 && <span>Area: {effect.area}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Tenet Effects */}
      {originalReligion?.tenet?.effects &&
        originalReligion.tenet.effects.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Tenets of {item.name}
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {originalReligion.tenet.effects.map((effect, index) => {
                // Split the effect description by periods to create separate tenets
                const tenetSentences = effect.effectDescription
                  .split('.')
                  .filter(sentence => sentence.trim().length > 0)

                return tenetSentences.map((tenet, tenetIndex) => (
                  <div
                    key={`${index}-${tenetIndex}`}
                    className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-2">
                      {getEffectIconByType('positive')}
                      {effect.targetAttribute &&
                        getEffectIcon(effect.targetAttribute)}
                    </div>
                    <div className="flex-1">
                      <FormattedDescription description={tenet.trim() + '.'} />
                    </div>
                  </div>
                ))
              })}
            </div>
          </div>
        )}

      {/* Boons Section - Follower and Devotee Powers */}
      {(originalReligion?.boon1 || originalReligion?.boon2) && (
        <div>
          <h5 className="text-lg font-medium text-foreground mb-3">
            Boons of {item.name}
          </h5>
          <div className="space-y-4">
            {/* Follower Power (Boon 1) */}
            {originalReligion?.boon1 && (
              <div>
                <h6 className="text-md font-medium text-foreground mb-2">
                  Follower Boon
                </h6>
                <div className="space-y-3">
                  {originalReligion.boon1.effects.map((effect, index) => {
                    const { hasMagnitude, hasDuration } = hasPlaceholders(
                      effect.effectDescription
                    )

                    return (
                      <div
                        key={index}
                        className="p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            {getEffectIconByType('positive')}
                            {effect.effectType &&
                              getEffectIcon(effect.effectType)}
                          </div>
                          <div className="flex-1">
                            <P className="font-medium text-sm mb-1">
                              {effect.effectName}
                            </P>
                            <FormattedBlessingDescription
                              description={effect.effectDescription}
                              magnitude={effect.magnitude}
                              duration={effect.duration}
                              area={effect.area}
                            />
                            {hasDuration && effect.duration > 0 && (
                              <P className="text-xs text-muted-foreground mt-1">
                                Lasts for {formatDuration(effect.duration)}.
                              </P>
                            )}
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              {effect.area > 0 && (
                                <span>Area: {effect.area}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Devotee Power (Boon 2) */}
            {originalReligion?.boon2 && (
              <div>
                <h6 className="text-md font-medium text-foreground mb-2">
                  Devotee Boon
                </h6>
                <div className="space-y-3">
                  {originalReligion.boon2.effects.map((effect, index) => {
                    const { hasMagnitude, hasDuration } = hasPlaceholders(
                      effect.effectDescription
                    )

                    return (
                      <div
                        key={index}
                        className="p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2">
                            {getEffectIconByType('positive')}
                            {effect.effectType &&
                              getEffectIcon(effect.effectType)}
                          </div>
                          <div className="flex-1">
                            <P className="font-medium text-sm mb-1">
                              {effect.effectName}
                            </P>
                            <FormattedBlessingDescription
                              description={effect.effectDescription}
                              magnitude={effect.magnitude}
                              duration={effect.duration}
                              area={effect.area}
                            />
                            {hasDuration && effect.duration > 0 && (
                              <P className="text-xs text-muted-foreground mt-1">
                                Lasts for {formatDuration(effect.duration)}.
                              </P>
                            )}
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              {effect.area > 0 && (
                                <span>Area: {effect.area}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function ReligionAccordion({
  item,
  originalReligion,
  isExpanded = false,
  onToggle,
  className,
  showBlessings = true,
  showTenets = true,
  showBoons = true,
  showFavoredRaces = true,
}: ReligionAccordionProps) {
  const getEffectIconByType = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'negative':
        return <Minus className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <Circle className="h-4 w-4 text-blue-500" />
    }
  }

  const getEffectIcon = (effectType: string) => {
    return (
      effectIcons[effectType] || <Star className="h-4 w-4 text-skyrim-gold" />
    )
  }

  return (
    <AccordionCard expanded={isExpanded} onToggle={onToggle} className={className}>
      <AccordionCard.Header>
        <AddToBuildSwitchSimple itemId={item.id} itemType="religion" itemName={item.name} />
        <div className="flex-1">
          <H3 className="text-primary font-semibold">{item.name}</H3>
        </div>
        {item.category && (
          <Badge
            variant="outline"
            className={cn(
              religionTypeStyles[item.category] ||
                'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
              sizeClasses.sm,
              'font-medium transition-colors'
            )}
          >
            {item.category}
          </Badge>
        )}
        {showFavoredRaces && originalReligion && Array.isArray(originalReligion.favoredRaces) && originalReligion.favoredRaces.length > 0 && (
          <div className="flex items-center gap-1">
            {originalReligion.favoredRaces.map((race, index) => (
              <Badge
                key={index}
                variant="outline"
                className={cn(
                  'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                  sizeClasses.sm,
                  'font-medium transition-colors'
                )}
              >
                <Star className="h-3 w-3 mr-1" />
                Favors {race}
              </Badge>
            ))}
          </div>
        )}
      </AccordionCard.Header>
      <AccordionCard.Summary>
        <div className="line-clamp-2">
          <FormattedText text={item.summary || item.description} className="text-sm text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-2">
          {item.effects?.slice(0, 2).map((effect, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
              title={effect.description}
            >
              {getEffectIconByType(effect.type)}
              <span className="font-medium">{effect.name}</span>
            </div>
          ))}
          {showFavoredRaces && originalReligion?.favoredRaces?.slice(0, 2).map((race, index) => (
            <div
              key={`race-${index}`}
              className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
            >
              <Star className="h-3 w-3 text-skyrim-gold" />
              <span className="font-medium">{race}</span>
            </div>
          ))}
        </div>
      </AccordionCard.Summary>
      <AccordionCard.Details>
        {/* Description */}
        {item.description && (
          <div>
            <FormattedText text={item.description} className="text-sm text-muted-foreground leading-relaxed" />
          </div>
        )}
        {/* Favored Races */}
        {showFavoredRaces && Array.isArray(originalReligion?.favoredRaces) && originalReligion.favoredRaces.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Favored Races</h5>
            <div className="flex flex-wrap gap-2">
              {originalReligion.favoredRaces.map((race, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
                  <Star className="h-4 w-4 text-skyrim-gold" />
                  <span className="text-sm font-medium">{race}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Worship Restrictions */}
        {Array.isArray(originalReligion?.worshipRestrictions) && originalReligion.worshipRestrictions.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Worship Restrictions</h5>
            <div className="space-y-2">
              {originalReligion.worshipRestrictions.map((restriction, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-start gap-2">
                    <Minus className="h-4 w-4 text-red-500 mt-0.5" />
                    <FormattedText text={restriction} className="text-sm text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Blessing Details */}
        {showBlessings && Array.isArray(originalReligion?.blessing?.effects) && originalReligion.blessing.effects.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Blessing of {item.name}</h5>
            <div className="space-y-3">
              {originalReligion.blessing.effects
                .filter(effect => effect.effectType !== '1' && effect.effectType !== '3')
                .map((effect, index) => {
                  const { hasMagnitude, hasDuration } = hasPlaceholders(effect.effectDescription)
                  return (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getEffectIconByType('positive')}
                          {effect.effectType && getEffectIcon(effect.effectType)}
                        </div>
                        <div className="flex-1">
                          <P className="font-medium text-sm mb-1">{effect.effectName}</P>
                          <FormattedBlessingDescription description={effect.effectDescription} magnitude={effect.magnitude} duration={effect.duration} area={effect.area} />
                          {hasDuration && effect.duration > 0 && (
                            <P className="text-xs text-muted-foreground mt-1">Lasts for {formatDuration(effect.duration)}.</P>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            {effect.area > 0 && <span>Area: {effect.area}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
        {/* Tenet Effects */}
        {showTenets && Array.isArray(originalReligion?.tenet?.effects) && originalReligion.tenet.effects.length > 0 && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Tenets of {item.name}</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {originalReligion.tenet.effects.map((effect, index) => {
                const tenetSentences = effect.effectDescription.split('.').filter(sentence => sentence.trim().length > 0)
                return tenetSentences.map((tenet, tenetIndex) => (
                  <div key={`${index}-${tenetIndex}`} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      {getEffectIconByType('positive')}
                      {effect.targetAttribute && getEffectIcon(effect.targetAttribute)}
                    </div>
                    <div className="flex-1">
                      <FormattedDescription description={tenet.trim() + '.'} />
                    </div>
                  </div>
                ))
              })}
            </div>
          </div>
        )}
        {/* Boons Section - Follower and Devotee Powers */}
        {showBoons && ((Array.isArray(originalReligion?.boon1?.effects) && originalReligion.boon1.effects.length > 0) || (Array.isArray(originalReligion?.boon2?.effects) && originalReligion.boon2.effects.length > 0)) && (
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">Boons of {item.name}</h5>
            <div className="space-y-4">
              {/* Follower Power (Boon 1) */}
              {Array.isArray(originalReligion?.boon1?.effects) && originalReligion.boon1.effects.length > 0 && (
                <div>
                  <h6 className="text-md font-medium text-foreground mb-2">Follower Boon</h6>
                  <div className="space-y-3">
                    {originalReligion.boon1.effects.map((effect, index) => {
                      const { hasMagnitude, hasDuration } = hasPlaceholders(effect.effectDescription)
                      return (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2">
                              {getEffectIconByType('positive')}
                              {effect.effectType && getEffectIcon(effect.effectType)}
                            </div>
                            <div className="flex-1">
                              <P className="font-medium text-sm mb-1">{effect.effectName}</P>
                              <FormattedBlessingDescription description={effect.effectDescription} magnitude={effect.magnitude} duration={effect.duration} area={effect.area} />
                              {hasDuration && effect.duration > 0 && (
                                <P className="text-xs text-muted-foreground mt-1">Lasts for {formatDuration(effect.duration)}.</P>
                              )}
                              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                {effect.area > 0 && <span>Area: {effect.area}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              {/* Devotee Power (Boon 2) */}
              {Array.isArray(originalReligion?.boon2?.effects) && originalReligion.boon2.effects.length > 0 && (
                <div>
                  <h6 className="text-md font-medium text-foreground mb-2">Devotee Boon</h6>
                  <div className="space-y-3">
                    {originalReligion.boon2.effects.map((effect, index) => {
                      const { hasMagnitude, hasDuration } = hasPlaceholders(effect.effectDescription)
                      return (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-2">
                              {getEffectIconByType('positive')}
                              {effect.effectType && getEffectIcon(effect.effectType)}
                            </div>
                            <div className="flex-1">
                              <P className="font-medium text-sm mb-1">{effect.effectName}</P>
                              <FormattedBlessingDescription description={effect.effectDescription} magnitude={effect.magnitude} duration={effect.duration} area={effect.area} />
                              {hasDuration && effect.duration > 0 && (
                                <P className="text-xs text-muted-foreground mt-1">Lasts for {formatDuration(effect.duration)}.</P>
                              )}
                              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                {effect.area > 0 && <span>Area: {effect.area}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </AccordionCard.Details>
    </AccordionCard>
  )
}
