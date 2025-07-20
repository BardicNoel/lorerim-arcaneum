import { cn } from '@/lib/utils'
import {
  AccordionCollapsedContentSlot,
  AccordionExpandedContentSlot,
  AccordionHeader,
  AccordionLeftControls,
  GenericAccordionCard,
} from '@/shared/components/generic'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H3 } from '@/shared/ui/ui/typography'
import {
  Activity,
  BookOpen,
  Circle,
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
import type { Trait } from '../types'
import { getUserFriendlyEffectType, parseDescription } from '../utils'
import { TraitSelectionControl } from './TraitSelectionControl'

/**
 * Component to format any description with highlighted values in asterisks and bold attributes/skills
 */
function FormattedText({
  text,
  className = 'text-sm text-muted-foreground',
}: {
  text: string
  className?: string
}) {
  if (!text) return null

  // Parse the description to replace placeholders and remove markdown
  const parsedText = parseDescription(text)

  return <div className={className}>{parsedText}</div>
}

interface TraitAccordionProps {
  item: PlayerCreationItem
  originalTrait?: Trait
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  showEffects?: boolean
  showSpells?: boolean
  showTags?: boolean
}

// Enhanced icon mapping for trait effects
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
  special_effect: <Star className="h-4 w-4 text-yellow-500" />,
  damage_dealt: <Sword className="h-4 w-4 text-red-500" />,
}

const categoryIcons: Record<string, string> = {
  combat: '⚔️',
  magic: '🔮',
  survival: '🌿',
  social: '💬',
  crafting: '⚒️',
  other: '⭐',
}

// Trait category styling - matching religion type styling pattern
const traitCategoryStyles: Record<string, string> = {
  combat: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  magic: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  survival: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  social: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  crafting:
    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

export function TraitAccordion({
  item,
  originalTrait,
  isExpanded = false,
  onToggle,
  className,
  showEffects = true,
  showSpells = true,
  showTags = true,
}: TraitAccordionProps) {
  if (!originalTrait) return null

  const categoryIcon =
    categoryIcons[originalTrait.category] || categoryIcons['other']

  const getEffectIcon = (effectType: string) => {
    return (
      effectIcons[effectType.toLowerCase()] || (
        <Star className="h-4 w-4 text-muted-foreground" />
      )
    )
  }

  // Parse the description to replace placeholders
  const parsedDescription = parseDescription(originalTrait.description)

  return (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={className}
    >
      {/* Left Controls */}
      <AccordionLeftControls>
        <TraitSelectionControl itemId={item.id} itemName={item.name} />
      </AccordionLeftControls>

      {/* Header Content */}
      <AccordionHeader>
        {/* Left side: Icon + Name */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-2xl flex-shrink-0">{categoryIcon}</span>
          <H3 className="text-primary font-semibold truncate">
            {originalTrait.name}
          </H3>
        </div>

        {/* Right side: Classification + Effects */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Trait category tag */}
          {originalTrait.category && (
            <Badge
              variant="outline"
              className={cn(
                traitCategoryStyles[originalTrait.category] ||
                  'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                sizeClasses.sm,
                'font-medium transition-colors'
              )}
            >
              {originalTrait.category}
            </Badge>
          )}

          {/* Effects count badge */}
          {originalTrait.effects.length > 0 && (
            <Badge
              variant="outline"
              className={cn(sizeClasses.sm, 'font-medium transition-colors')}
            >
              {originalTrait.effects.length} effects
            </Badge>
          )}
        </div>
      </AccordionHeader>

      {/* Collapsed Content */}
      <AccordionCollapsedContentSlot>
        <div className="space-y-3">
          <FormattedText
            text={parsedDescription}
            className="text-base text-muted-foreground"
          />
        </div>
      </AccordionCollapsedContentSlot>

      {/* Expanded Content */}
      <AccordionExpandedContentSlot>
        <div className="space-y-6">
          {/* Description Section */}
          <div>
            <h5 className="text-lg font-medium text-foreground mb-3">
              Description
            </h5>
            <div className="p-4 rounded-lg border bg-muted/30">
              <FormattedText
                text={parsedDescription}
                className="text-base text-muted-foreground leading-relaxed"
              />
            </div>
          </div>

          {/* Effects Section */}
          {showEffects && originalTrait.effects.length > 0 && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Effects
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {originalTrait.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      {getEffectIcon(effect.type)}
                      <span className="font-medium">
                        {getUserFriendlyEffectType(effect.type)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'font-bold',
                          effect.flags.includes('Detrimental')
                            ? 'text-red-600'
                            : 'text-green-600'
                        )}
                      >
                        {effect.value > 0 ? '+' : ''}
                        {effect.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spells Section */}
          {showSpells && originalTrait.spell && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">
                Spell Information
              </h5>
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Type:
                    </span>
                    <div className="mt-1">{originalTrait.spell.type}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Cast Type:
                    </span>
                    <div className="mt-1">{originalTrait.spell.castType}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Delivery:
                    </span>
                    <div className="mt-1">{originalTrait.spell.delivery}</div>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Cost:
                    </span>
                    <div className="mt-1">{originalTrait.spell.cost}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {showTags && item.tags && item.tags.length > 0 && (
            <div>
              <h5 className="text-lg font-medium text-foreground mb-3">Tags</h5>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionExpandedContentSlot>
    </GenericAccordionCard>
  )
}
