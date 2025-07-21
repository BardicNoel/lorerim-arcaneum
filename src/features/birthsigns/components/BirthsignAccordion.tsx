import { cn } from '@/lib/utils'
import {
  AccordionCollapsedContentSlot,
  AccordionExpandedContentSlot,
  AccordionHeader,
  AccordionLeftControls,
  GenericAccordionCard,
} from '@/shared/components/generic'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, H4 } from '@/shared/ui/ui/typography'
import {
  Activity,
  BookOpen,
  Circle,
  Droplets,
  Eye,
  Flame,
  Hand,
  Heart,
  Zap as Lightning,
  Shield,
  Star,
  Sword,
  Target,
  Zap,
} from 'lucide-react'
import React from 'react'
import type { Birthsign } from '../types'
import { getUserFriendlyStat, parseDescription } from '../utils'
import { BirthsignAvatar } from './BirthsignAvatar'
import { BirthsignFormattedText } from './BirthsignFormattedText'
import {
  getBirthsignGroupStyle,
  getBirthsignGroupColor,
  getBirthsignEffectIcon,
  getBirthsignEffectTypeColor,
} from '../config/birthsignConfig'

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

interface BirthsignAccordionProps {
  item: PlayerCreationItem
  originalBirthsign?: Birthsign
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  showStats?: boolean
  showPowers?: boolean
  showSkills?: boolean
  showEffects?: boolean
}

// Enhanced icon mapping for birthsign effects
const effectIcons: Record<string, React.ReactNode> = {
  health: <Heart className="h-4 w-4 text-red-500" />,
  magicka: <Zap className="h-4 w-4 text-blue-500" />,
  stamina: <Activity className="h-4 w-4 text-green-500" />,
  weapon_damage: <Sword className="h-4 w-4 text-orange-500" />,
  armor_penetration: <Target className="h-4 w-4 text-purple-500" />,
  unarmed_damage: <Hand className="h-4 w-4 text-yellow-500" />,
  movement_speed: <Circle className="h-4 w-4 text-cyan-500" />,
  sprint_speed: <Circle className="h-4 w-4 text-cyan-500" />,
  carry_weight: <Shield className="h-4 w-4 text-gray-500" />,
  spell_strength: <BookOpen className="h-4 w-4 text-indigo-500" />,
  magicka_regeneration: <Zap className="h-4 w-4 text-blue-400" />,
  lockpicking_durability: <Eye className="h-4 w-4 text-green-400" />,
  lockpicking_expertise: <Eye className="h-4 w-4 text-green-400" />,
  pickpocketing_success: <Hand className="h-4 w-4 text-green-400" />,
  stealth_detection: <Eye className="h-4 w-4 text-purple-400" />,
  speech: <BookOpen className="h-4 w-4 text-yellow-400" />,
  shout_cooldown: <Flame className="h-4 w-4 text-red-400" />,
  price_modification: <Circle className="h-4 w-4 text-gold-400" />,
  damage_reflection: <Shield className="h-4 w-4 text-red-400" />,
  poison_resistance: <Droplets className="h-4 w-4 text-green-400" />,
  fire_resistance: <Flame className="h-4 w-4 text-orange-400" />,
  enchanting_strength: <BookOpen className="h-4 w-4 text-purple-400" />,
  power: <Lightning className="h-4 w-4 text-yellow-500" />,
}



// Birthsign group styling - matching religion type styling pattern
const birthsignGroupStyles: Record<string, string> = {
  Warrior: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  Mage: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  Thief: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  Serpent:
    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  Other: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

export function BirthsignAccordion({
  item,
  originalBirthsign,
  isExpanded = false,
  onToggle,
  className,
  showStats = true,
  showPowers = true,
  showSkills = true,
  showEffects = true,
}: BirthsignAccordionProps) {
  if (!originalBirthsign) return null

  const getEffectIcon = (effectType: string) => {
    return (
      effectIcons[effectType.toLowerCase()] || (
        <Star className="h-4 w-4 text-muted-foreground" />
      )
    )
  }

  const getEffectIconByType = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return null // Removed redundant plus icon
      case 'negative':
        return null // Removed redundant minus icon
      case 'neutral':
        return <Circle className="h-4 w-4 text-blue-500" />
      default:
        return <Star className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Parse the description to replace placeholders
  const parsedDescription = parseDescription(originalBirthsign.description)

  return (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={className}
    >
      {/* Left Controls */}
      <AccordionLeftControls>
        <AddToBuildSwitchSimple
          itemId={item.id}
          itemType="stone"
          itemName={item.name}
        />
      </AccordionLeftControls>

      {/* Header Content */}
      <AccordionHeader>
        {/* Left side: Icon + Name */}
        <div className="flex items-center gap-3">
          <BirthsignAvatar birthsignName={originalBirthsign.name} size="md" />
          <H3 className="text-primary font-semibold">
            {originalBirthsign.name}
          </H3>
        </div>

        {/* Right side: Classification + Effects */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Birthsign group tag */}
          {originalBirthsign.group && (
            <Badge
              variant="outline"
              className={cn(
                getBirthsignGroupStyle(originalBirthsign.group) ||
                  'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                sizeClasses.sm,
                'font-medium transition-colors'
              )}
            >
              {originalBirthsign.group}
            </Badge>
          )}

          {/* Powers count badge */}
          {originalBirthsign.powers.length > 0 && (
            <Badge
              variant="outline"
              className={cn(
                'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                sizeClasses.sm,
                'font-medium transition-colors'
              )}
            >
              <Lightning className="h-3 w-3 mr-1" />
              {originalBirthsign.powers.length} power
              {originalBirthsign.powers.length !== 1 ? 's' : ''}
            </Badge>
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
      </AccordionHeader>

      {/* Collapsed Content */}
      <AccordionCollapsedContentSlot>
        <div className="space-y-3">
          <BirthsignFormattedText
            text={parsedDescription}
            className="text-base text-muted-foreground"
          />
        </div>
      </AccordionCollapsedContentSlot>

      {/* Expanded Content */}
      <AccordionExpandedContentSlot>
        <div className="space-y-6">
          {/* Stats Section */}
          {showStats && originalBirthsign.stat_modifications.length > 0 && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Stat Modifications
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {originalBirthsign.stat_modifications.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      {getEffectIcon(stat.stat)}
                      <span className="font-medium">
                        {getUserFriendlyStat(stat.stat)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-bold',
                          stat.type === 'bonus'
                            ? 'text-green-600'
                            : 'text-red-600'
                        )}
                      >
                        {stat.type === 'bonus'
                          ? (stat.value >= 0 ? '+' : '') +
                            stat.value +
                            (stat.value_type === 'percentage' ? '%' : '')
                          : (stat.value < 0 ? '' : '-') +
                            stat.value +
                            (stat.value_type === 'percentage' ? '%' : '')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Powers Section */}
          {showPowers && originalBirthsign.powers.length > 0 && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Powers
              </h5>
              <div className="space-y-3">
                {originalBirthsign.powers.map((power, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <H4 className="text-sm font-semibold">{power.name}</H4>
                      {power.magnitude && (
                        <Badge variant="outline" className="text-xs">
                          Magnitude: {power.magnitude}
                        </Badge>
                      )}
                    </div>
                    <BirthsignFormattedText
                      text={power.description}
                      className="text-sm text-muted-foreground"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {showSkills && originalBirthsign.skill_bonuses.length > 0 && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Skill Bonuses
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {originalBirthsign.skill_bonuses.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      {getEffectIcon(skill.stat)}
                      <span className="font-medium">
                        {getUserFriendlyStat(skill.stat)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600">
                        +{skill.value}
                        {skill.value_type === 'percentage' ? '%' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Effects Section */}
          {showEffects &&
            (originalBirthsign.conditional_effects?.length > 0 ||
              originalBirthsign.mastery_effects?.length > 0) && (
              <div>
                <h5 className="text-lg font-medium text-foreground mb-3">
                  Special Effects
                </h5>
                <div className="space-y-3">
                  {/* Conditional Effects */}
                  {originalBirthsign.conditional_effects?.map(
                    (effect, index) => (
                      <div
                        key={`conditional-${index}`}
                        className="p-3 rounded-lg border bg-muted/30"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Circle className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">
                            Conditional Effect
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {effect.stat}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {effect.description}
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Mastery Effects */}
                  {originalBirthsign.mastery_effects?.map((effect, index) => (
                    <div
                      key={`mastery-${index}`}
                      className="p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-sm">
                          Mastery Effect
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{effect.stat}</div>
                        <div className="text-sm text-muted-foreground">
                          {effect.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </AccordionExpandedContentSlot>
    </GenericAccordionCard>
  )
}
