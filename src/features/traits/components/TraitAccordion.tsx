import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import { 
  Shield, Zap, Heart, Brain, Target, Flame, Droplets, Skull, 
  Sword, BookOpen, Eye, Hand, ChevronDown, ChevronRight, ChevronUp,
  Plus, Minus, Circle, Star, Activity, Zap as Lightning
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Trait } from '../types'
import { parseDescription, getUserFriendlyEffectType } from '../utils'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { GenericAccordionCard } from '@/shared/components/generic'

/**
 * Component to format any description with highlighted values in asterisks and bold attributes/skills
 */
function FormattedText({ text, className = "text-sm text-muted-foreground" }: { 
  text: string; 
  className?: string 
}) {
  if (!text) return null
  
  // Parse the description to replace placeholders
  const parsedText = parseDescription(text)
  
  // Define attributes and skills that should be bolded
  const attributesAndSkills = [
    // Core attributes
    'health', 'magicka', 'stamina',
    // Attribute variations
    'health regeneration', 'magicka regeneration', 'stamina regeneration',
    // Skills
    'one-handed', 'two-handed', 'archery', 'block', 'heavy armor', 'light armor',
    'smithing', 'alchemy', 'enchanting', 'restoration', 'destruction', 'alteration',
    'illusion', 'conjuration', 'mysticism', 'speech', 'lockpicking', 'sneak',
    'pickpocket', 'lockpicking', 'pickpocketing', 'stealth', 'acrobatics',
    // Skill variations
    'one handed', 'two handed', 'heavy armor', 'light armor',
    // Combat stats
    'weapon damage', 'armor rating', 'armor penetration', 'unarmed damage',
    'movement speed', 'sprint speed', 'carry weight', 'spell strength',
    'shout cooldown', 'price modification', 'damage reflection',
    // Resistances
    'poison resistance', 'fire resistance', 'frost resistance', 'shock resistance',
    'magic resistance', 'disease resistance',
    // Special effects
    'lockpicking durability', 'lockpicking expertise', 'pickpocketing success',
    'stealth detection', 'enchanting strength',
    // Trait-specific terms
    'fishing', 'mudcrab', 'slaughterfish', 'fishing rod', 'insect', 'fish',
    'armor', 'clothing', 'armor slot', 'empty armor slot', 'level',
    'sonic spells', 'sound magic', 'physical attacks', 'followers',
    'instrument', 'inn', 'melody', 'vibration', 'booming presence'
  ]
  
  // Create a regex pattern for attributes and skills (case insensitive)
  const attributesPattern = new RegExp(`\\b(${attributesAndSkills.join('|')})\\b`, 'gi')
  
  // First, split by asterisk patterns and highlight those values
  let parts = parsedText.split(/(\*\*\*\d+\*\*\*)/g)
  
  // Then, for each part that's not an asterisk value, process attributes and numeric values
  const processedParts = parts.map((part, index) => {
    if (part.match(/^\*\*\*\d+\*\*\*$/)) {
      // This is an asterisk value - remove the asterisks and style it
      const value = part.replace(/\*\*\*/g, '')
      return (
        <span key={`asterisk-${index}`} className="font-bold italic text-skyrim-gold">
          {value}
        </span>
      )
    } else {
      // This is regular text - first bold attributes and skills, then highlight numeric values
      let processedPart = part
      
      // Replace attributes and skills with bold versions
      processedPart = processedPart.replace(attributesPattern, (match) => {
        return `<bold>${match}</bold>`
      })
      
      // Split by the bold markers and numeric patterns
      const subParts = processedPart.split(/(<bold>.*?<\/bold>|\+?\d+(?:\.\d+)?%?)/g)
      
      return subParts.map((subPart, subIndex) => {
        if (subPart.startsWith('<bold>') && subPart.endsWith('</bold>')) {
          // This is a bold attribute/skill - remove markers and style it
          const attribute = subPart.slice(6, -7) // Remove <bold> and </bold>
          return (
            <span key={`attribute-${index}-${subIndex}`} className="font-semibold text-primary">
              {attribute}
            </span>
          )
        } else if (/^[+-]?\d+(?:\.\d+)?%?$/.test(subPart)) {
          // This is a numeric value - determine if it's positive or negative
          const numericValue = parseFloat(subPart)
          const isPositive = subPart.startsWith('+') || numericValue > 0
          const isNegative = subPart.startsWith('-') || numericValue < 0
          
          let colorClass = 'text-skyrim-gold' // Default for neutral values
          if (isPositive) {
            colorClass = 'text-green-600'
          } else if (isNegative) {
            colorClass = 'text-red-600'
          }
          
          return (
            <span key={`numeric-${index}-${subIndex}`} className={`font-bold ${colorClass}`}>
              {subPart}
            </span>
          )
        }
        return subPart
      })
    }
  })
  
  return (
    <div className={className}>
      {processedParts}
    </div>
  )
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
  'health': <Heart className="h-4 w-4 text-red-500" />,
  'magicka': <Zap className="h-4 w-4 text-blue-500" />,
  'stamina': <Activity className="h-4 w-4 text-green-500" />,
  'weapon_damage': <Sword className="h-4 w-4 text-orange-500" />,
  'armor_penetration': <Target className="h-4 w-4 text-purple-500" />,
  'unarmed_damage': <Hand className="h-4 w-4 text-yellow-500" />,
  'movement_speed': <Circle className="h-4 w-4 text-cyan-500" />,
  'sprint_speed': <Circle className="h-4 w-4 text-cyan-500" />,
  'carry_weight': <Shield className="h-4 w-4 text-gray-500" />,
  'spell_strength': <BookOpen className="h-4 w-4 text-indigo-500" />,
  'magicka_regeneration': <Zap className="h-4 w-4 text-blue-400" />,
  'lockpicking_durability': <Eye className="h-4 w-4 text-green-400" />,
  'lockpicking_expertise': <Eye className="h-4 w-4 text-green-400" />,
  'pickpocketing_success': <Hand className="h-4 w-4 text-green-400" />,
  'stealth_detection': <Eye className="h-4 w-4 text-purple-400" />,
  'speech': <BookOpen className="h-4 w-4 text-yellow-400" />,
  'shout_cooldown': <Flame className="h-4 w-4 text-red-400" />,
  'price_modification': <Circle className="h-4 w-4 text-gold-400" />,
  'damage_reflection': <Shield className="h-4 w-4 text-red-400" />,
  'poison_resistance': <Droplets className="h-4 w-4 text-green-400" />,
  'fire_resistance': <Flame className="h-4 w-4 text-orange-400" />,
  'enchanting_strength': <BookOpen className="h-4 w-4 text-purple-400" />,
  'special_effect': <Star className="h-4 w-4 text-yellow-500" />,
  'damage_dealt': <Sword className="h-4 w-4 text-red-500" />
}

const categoryIcons: Record<string, string> = {
  'combat': '⚔️',
  'magic': '🔮',
  'survival': '🌿',
  'social': '💬',
  'crafting': '⚒️',
  'other': '⭐'
}

// Trait category styling - matching religion type styling pattern
const traitCategoryStyles: Record<string, string> = {
  'combat': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  'magic': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  'survival': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  'social': 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  'crafting': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  'other': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
}

/**
 * Render the left controls for a trait accordion
 */
export function renderTraitLeftControls(item: PlayerCreationItem) {
  return (
    <AddToBuildSwitchSimple
      itemId={item.id}
      itemType="trait"
      itemName={item.name}
    />
  )
}

/**
 * Render the header for a trait accordion
 */
export function renderTraitHeader(item: PlayerCreationItem, originalTrait?: Trait) {
  if (!originalTrait) return null

  const categoryIcon = categoryIcons[originalTrait.category] || categoryIcons['other']

  return (
    <>
      <span className="text-2xl">{categoryIcon}</span>
      <div className="flex-1">
        <H3 className="text-primary font-semibold">{originalTrait.name}</H3>
      </div>
      
      {/* Right side: Classification + Effects */}
      <div className="flex items-center gap-3">
        {/* Trait category tag */}
        {originalTrait.category && (
          <Badge 
            variant="outline"
            className={cn(
              traitCategoryStyles[originalTrait.category] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
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
            className={cn(
              sizeClasses.sm,
              'font-medium transition-colors'
            )}
          >
            {originalTrait.effects.length} effects
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
    </>
  )
}

/**
 * Render the collapsed content for a trait accordion
 */
export function renderTraitCollapsedContent(item: PlayerCreationItem, originalTrait?: Trait) {
  if (!originalTrait) return null

  // Parse the description to replace placeholders
  const parsedDescription = parseDescription(originalTrait.description)

  return (
    <div className="space-y-3">
      <FormattedText 
        text={parsedDescription} 
        className="text-base text-muted-foreground"
      />
    </div>
  )
}

/**
 * Render the expanded content for a trait accordion
 */
export function renderTraitExpandedContent(item: PlayerCreationItem, originalTrait?: Trait) {
  if (!originalTrait) return null

  const getEffectIcon = (effectType: string) => {
    return effectIcons[effectType.toLowerCase()] || <Star className="h-4 w-4 text-muted-foreground" />
  }

  return (
    <div className="space-y-6">
      {/* Effects Section */}
      {originalTrait.effects.length > 0 && (
        <div>
          <h5 className="text-lg font-medium text-foreground mb-3">Effects</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {originalTrait.effects.map((effect, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2">
                  {getEffectIcon(effect.type)}
                  <span className="font-medium">
                    {getUserFriendlyEffectType(effect.type)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold",
                    effect.flags.includes('Detrimental') ? "text-red-600" : "text-green-600"
                  )}>
                    {effect.value > 0 ? '+' : ''}{effect.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spells Section */}
      {originalTrait.spell && (
        <div>
          <h5 className="text-lg font-medium text-foreground mb-3">Spell Information</h5>
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Type:</span>
                <div className="mt-1">{originalTrait.spell.type}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Cast Type:</span>
                <div className="mt-1">{originalTrait.spell.castType}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Delivery:</span>
                <div className="mt-1">{originalTrait.spell.delivery}</div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Cost:</span>
                <div className="mt-1">{originalTrait.spell.cost}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
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
  )
}

export function TraitAccordion({ 
  item, 
  originalTrait, 
  isExpanded = false, 
  onToggle, 
  className,
  showEffects = true,
  showSpells = true,
  showTags = true
}: TraitAccordionProps) {
  if (!originalTrait) return null

  return (
    <GenericAccordionCard
      item={item}
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      renderHeader={(item) => renderTraitHeader(item, originalTrait)}
      renderCollapsedContent={(item) => renderTraitCollapsedContent(item, originalTrait)}
      renderExpandedContent={(item) => renderTraitExpandedContent(item, originalTrait)}
      renderLeftControls={(item) => renderTraitLeftControls(item)}
      className={className}
    />
  )
} 