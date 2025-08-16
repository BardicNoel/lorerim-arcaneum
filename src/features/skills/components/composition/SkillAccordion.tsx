import { cn } from '@/lib/utils'
import { GenericAccordionCard } from '@/shared/components/generic'
import { SkillAvatar } from '../atomic/SkillAvatar'
import { AddToBuildSwitchSimple } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, H5, P } from '@/shared/ui/ui/typography'
import {
  Circle,
  Crosshair,
  Eye,
  Heart,
  Lock,
  Scroll,
  Shield,
  Sparkles,
  Star,
  Sword,
  Target,
  UserCheck,
  Wrench,
  Zap,
} from 'lucide-react'
import React from 'react'
import type { SkillsPageSkill } from '../../adapters/useSkillsPage'

// Enhanced icon mapping for skill effects
const effectIcons: Record<string, React.ReactNode> = {
  scaling: <Sparkles className="h-4 w-4 text-skyrim-gold" />,
  ability: <Star className="h-4 w-4 text-blue-500" />,
  combat: <Sword className="h-4 w-4 text-red-500" />,
  magic: <Zap className="h-4 w-4 text-blue-500" />,
  stealth: <Eye className="h-4 w-4 text-green-500" />,
  crafting: <Wrench className="h-4 w-4 text-orange-500" />,
  healing: <Heart className="h-4 w-4 text-red-400" />,
  protection: <Shield className="h-4 w-4 text-blue-400" />,
  damage: <Target className="h-4 w-4 text-red-600" />,
  utility: <Scroll className="h-4 w-4 text-purple-500" />,
  movement: <Circle className="h-4 w-4 text-cyan-500" />,
  social: <UserCheck className="h-4 w-4 text-yellow-500" />,
  thievery: <Lock className="h-4 w-4 text-green-600" />,
  ranged: <Crosshair className="h-4 w-4 text-orange-400" />,
}

const categoryIcons: Record<string, string> = {
  Combat: '⚔️',
  Magic: '🔮',
  Stealth: '🗡️',
}

// Skill category styling
const skillCategoryStyles: Record<string, string> = {
  Combat: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  Magic: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  Stealth: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

interface SkillAccordionProps {
  item: PlayerCreationItem
  originalSkill?: SkillsPageSkill
  isExpanded?: boolean
  onToggle?: () => void
  onSelect?: () => void
  className?: string
  showScaling?: boolean
  showAbilities?: boolean
  showTags?: boolean
}

export function SkillAccordion({
  item,
  originalSkill,
  isExpanded = false,
  onToggle,
  onSelect,
  className,
  showScaling = true,
  showAbilities = true,
  showTags = true,
}: SkillAccordionProps) {
  const categoryIcon = categoryIcons[item.category || ''] || '⭐'
  const categoryStyle =
    skillCategoryStyles[item.category || ''] ||
    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'

  const getEffectIcon = (effectType: string) => {
    return (
      effectIcons[effectType] || <Star className="h-4 w-4 text-skyrim-gold" />
    )
  }

  return (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={className}
    >
      {/* Header Content */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div
            className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
            onClick={e => {
              e.stopPropagation()
              onSelect?.()
            }}
          >
            <SkillAvatar
              skillName={item.name}
              size="sm"
              className="flex-shrink-0"
            />
            <span className="text-lg">{categoryIcon}</span>
            <H3 className="text-base font-semibold">{item.name}</H3>
            <AddToBuildSwitchSimple
              itemId={item.id}
              itemType="skill"
              itemName={item.name}
            />
          </div>
          <P className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </P>
        </div>
      </div>

      {/* Expanded Content */}
      <div className="space-y-4 mt-4">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(categoryStyle, sizeClasses.sm)}
          >
            {item.category}
          </Badge>
        </div>

        {/* Key Abilities */}
        {showAbilities &&
          originalSkill?.keyAbilities &&
          originalSkill.keyAbilities.length > 0 && (
            <div className="space-y-2">
              <H5 className="text-sm font-medium flex items-center gap-2">
                {getEffectIcon('ability')}
                Key Abilities
              </H5>
              <ul className="space-y-1">
                {originalSkill.keyAbilities.map((ability, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-skyrim-gold mt-1">•</span>
                    <span>{ability}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Meta Tags */}
        {showTags &&
          originalSkill?.metaTags &&
          originalSkill.metaTags.length > 0 && (
            <div className="space-y-2">
              <H5 className="text-sm font-medium">Tags</H5>
              <div className="flex flex-wrap gap-1">
                {originalSkill.metaTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
      </div>
    </GenericAccordionCard>
  )
}
