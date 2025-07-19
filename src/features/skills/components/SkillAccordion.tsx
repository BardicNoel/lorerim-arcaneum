import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, H4, H5, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import { 
  Shield, Zap, Heart, Brain, Target, Flame, Droplets, Skull, 
  Sword, BookOpen, Eye, Hand, ChevronDown, ChevronRight,
  Plus, Minus, Circle, Star, Activity, Zap as Lightning,
  Sparkles, Wrench, Scroll, Crosshair, Lock, UserCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Skill } from '../types'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import { GenericAccordionCard } from '@/shared/components/generic'

// Enhanced icon mapping for skill effects
const effectIcons: Record<string, React.ReactNode> = {
  'scaling': <Sparkles className="h-4 w-4 text-skyrim-gold" />,
  'ability': <Star className="h-4 w-4 text-blue-500" />,
  'combat': <Sword className="h-4 w-4 text-red-500" />,
  'magic': <Zap className="h-4 w-4 text-blue-500" />,
  'stealth': <Eye className="h-4 w-4 text-green-500" />,
  'crafting': <Wrench className="h-4 w-4 text-orange-500" />,
  'healing': <Heart className="h-4 w-4 text-red-400" />,
  'protection': <Shield className="h-4 w-4 text-blue-400" />,
  'damage': <Target className="h-4 w-4 text-red-600" />,
  'utility': <Scroll className="h-4 w-4 text-purple-500" />,
  'movement': <Circle className="h-4 w-4 text-cyan-500" />,
  'social': <UserCheck className="h-4 w-4 text-yellow-500" />,
  'thievery': <Lock className="h-4 w-4 text-green-600" />,
  'ranged': <Crosshair className="h-4 w-4 text-orange-400" />
}

const categoryIcons: Record<string, string> = {
  'Combat': '⚔️',
  'Magic': '🔮',
  'Stealth': '🗡️'
}

// Skill category styling
const skillCategoryStyles: Record<string, string> = {
  'Combat': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  'Magic': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  'Stealth': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
}

interface SkillAccordionProps {
  item: PlayerCreationItem
  originalSkill?: Skill
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
  showScaling?: boolean
  showAbilities?: boolean
  showTags?: boolean
}

/**
 * Render the left controls for a skill accordion
 */
export function renderSkillLeftControls(item: PlayerCreationItem) {
  return (
    <AddToBuildSwitchSimple
      itemId={item.id}
      itemType="skill"
      itemName={item.name}
    />
  )
}

/**
 * Render the header for a skill accordion
 */
export function renderSkillHeader(item: PlayerCreationItem, originalSkill?: Skill) {
  const categoryIcon = categoryIcons[item.category || ''] || '⭐'
  const categoryStyle = skillCategoryStyles[item.category || ''] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'

  return (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <H3 className="text-primary font-semibold">{item.name}</H3>
          {originalSkill?.abbreviation && (
            <Badge variant="secondary" className="text-xs font-mono">
              {originalSkill.abbreviation}
            </Badge>
          )}
        </div>
        
        {/* Description always visible */}
        <P className="text-sm text-muted-foreground line-clamp-2">
          {item.description}
        </P>
      </div>
      
      {/* Right side: Category */}
      <div className="flex items-start gap-3 flex-shrink-0">
        {/* Category tag */}
        {item.category && (
          <Badge 
            variant="outline"
            className={cn(
              categoryStyle,
              sizeClasses.sm,
              'font-medium transition-colors'
            )}
          >
            <span className="mr-1">{categoryIcon}</span>
            {item.category}
          </Badge>
        )}
      </div>
    </>
  )
}

/**
 * Render the collapsed content for a skill accordion
 */
export function renderSkillCollapsedContent(item: PlayerCreationItem, originalSkill?: Skill) {
  return (
    <div className="space-y-3">
      {/* Additional collapsed content if needed */}
    </div>
  )
}

/**
 * Render the expanded content for a skill accordion
 */
export function renderSkillExpandedContent(item: PlayerCreationItem, originalSkill?: Skill) {
  const getEffectIcon = (effectType: string) => {
    return effectIcons[effectType] || <Star className="h-4 w-4 text-skyrim-gold" />
  }

  return (
    <div className="space-y-4">
      {/* Scaling Section */}
      {originalSkill?.scaling && (
        <div className="space-y-2">
          <H5 className="text-sm font-semibold text-foreground flex items-center gap-2">
            {getEffectIcon('scaling')}
            Scaling
          </H5>
          <div className="pl-6">
            <P className="text-sm text-muted-foreground">
              {originalSkill.scaling}
            </P>
          </div>
        </div>
      )}

      {/* Key Abilities Section */}
      {originalSkill?.keyAbilities && originalSkill.keyAbilities.length > 0 && (
        <div className="space-y-2">
          <H5 className="text-sm font-semibold text-foreground flex items-center gap-2">
            {getEffectIcon('ability')}
            Key Abilities
          </H5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {originalSkill.keyAbilities.map((ability, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-2">
                  <Circle className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-sm">
                    {ability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meta Tags Section */}
      {originalSkill?.metaTags && originalSkill.metaTags.length > 0 && (
        <div className="space-y-2">
          <H5 className="text-sm font-semibold text-foreground">
            Tags
          </H5>
          <div className="flex flex-wrap gap-1.5">
            {originalSkill.metaTags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-muted/50 text-muted-foreground hover:bg-muted"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function SkillAccordion({ 
  item, 
  originalSkill, 
  isExpanded = false, 
  onToggle, 
  className,
  showScaling = true,
  showAbilities = true,
  showTags = true
}: SkillAccordionProps) {
  return (
    <GenericAccordionCard
      item={item}
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      renderHeader={(item) => renderSkillHeader(item, originalSkill)}
      renderCollapsedContent={(item) => renderSkillCollapsedContent(item, originalSkill)}
      renderExpandedContent={(item) => renderSkillExpandedContent(item, originalSkill)}
      renderLeftControls={(item) => renderSkillLeftControls(item)}
      className={className}
    />
  )
} 