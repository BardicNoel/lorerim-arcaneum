import React from 'react'
import { cn } from '@/lib/utils'
import { GenericAccordionCard } from '@/shared/components/generic'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, H5, P } from '@/shared/ui/ui/typography'
import { Button } from '@/shared/ui/ui/button'
import { Separator } from '@/shared/ui/ui/separator'
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
import type { UnifiedSkill } from '../adapters'

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

const assignmentBadgeStyles: Record<string, string> = {
  major: 'bg-blue-600 text-white border-blue-600',
  minor: 'bg-green-600 text-white border-green-600',
  none: 'bg-gray-100 text-gray-800 border-gray-200',
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

interface SkillCardMVAProps {
  skill: UnifiedSkill
  isExpanded?: boolean
  onToggle?: () => void
  onAssignMajor: () => void
  onAssignMinor: () => void
  onUnassign: () => void
  onSelect: () => void
  isSelected: boolean
  className?: string
  showScaling?: boolean
  showAbilities?: boolean
  showTags?: boolean
}

export const SkillCardMVA: React.FC<SkillCardMVAProps> = ({
  skill,
  isExpanded = false,
  onToggle,
  onAssignMajor,
  onAssignMinor,
  onUnassign,
  onSelect,
  isSelected,
  className,
  showScaling = true,
  showAbilities = true,
  showTags = true,
}) => {
  const categoryIcon = categoryIcons[skill.category] || '⭐'
  const categoryStyle =
    skillCategoryStyles[skill.category] ||
    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'

  const assignmentStyle = assignmentBadgeStyles[skill.assignmentType]

  const getEffectIcon = (effectType: string) => {
    return (
      effectIcons[effectType] || <Star className="h-4 w-4 text-skyrim-gold" />
    )
  }

  const getAssignmentBadge = () => {
    switch (skill.assignmentType) {
      case 'major':
        return <Badge className={cn(assignmentStyle, sizeClasses.sm)}>Major</Badge>
      case 'minor':
        return <Badge className={cn(assignmentStyle, sizeClasses.sm)}>Minor</Badge>
      default:
        return <Badge variant="outline" className={cn(assignmentStyle, sizeClasses.sm)}>Unassigned</Badge>
    }
  }

  return (
    <GenericAccordionCard
      isExpanded={isExpanded}
      onToggle={onToggle || (() => {})}
      className={cn(
        'cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      onClick={onSelect}
    >
      {/* Left Controls - Assignment Buttons */}
      <div className="flex items-center gap-3">
        {skill.assignmentType === 'none' ? (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onAssignMajor(); }}
              disabled={!skill.canAssignMajor}
              className="flex-1"
            >
              Assign Major
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onAssignMinor(); }}
              disabled={!skill.canAssignMinor}
              className="flex-1"
            >
              Assign Minor
            </Button>
          </div>
        ) : (
          <Button 
            size="sm" 
            variant="destructive"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onUnassign(); }}
            className="w-full"
          >
            Unassign
          </Button>
        )}
      </div>

      {/* Header Content */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{categoryIcon}</span>
        <div className="flex items-center gap-2">
          <H3 className="text-primary font-semibold">{skill.name}</H3>
          {getAssignmentBadge()}
        </div>
      </div>

      {/* Right side: Category and Stats */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Category tag */}
        <Badge
          variant="outline"
          className={cn(
            categoryStyle,
            sizeClasses.sm,
            'font-medium transition-colors'
          )}
        >
          {skill.category}
        </Badge>
        
        {/* Perk count */}
        <Badge variant="secondary" className="text-xs">
          {skill.selectedPerksCount}/{skill.totalPerks} Perks
        </Badge>
      </div>

      {/* Collapsed Content */}
      <div className="space-y-3">
        {/* Description */}
        <div className="line-clamp-2">
          <P className="text-sm text-muted-foreground">{skill.description}</P>
        </div>
        
        {/* Quick stats */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Level: {skill.level}</span>
          <span>Scaling: {skill.scaling}</span>
        </div>
      </div>

      {/* Expanded Content */}
      <div className="space-y-4">
        {/* Scaling Section */}
        {showScaling && skill.scaling && (
          <div className="space-y-2">
            <H5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              {getEffectIcon('scaling')}
              Scaling
            </H5>
            <div className="pl-6">
              <P className="text-sm text-muted-foreground">
                {skill.scaling}
              </P>
            </div>
          </div>
        )}

        {/* Key Abilities Section */}
        {showAbilities && skill.metaTags && skill.metaTags.length > 0 && (
          <div className="space-y-2">
            <H5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              {getEffectIcon('ability')}
              Key Abilities
            </H5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skill.metaTags.slice(0, 6).map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">{tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta Tags Section */}
        {showTags && skill.metaTags && skill.metaTags.length > 0 && (
          <div className="space-y-2">
            <H5 className="text-sm font-semibold text-foreground">Tags</H5>
            <div className="flex flex-wrap gap-1.5">
              {skill.metaTags.map((tag, index) => (
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

        {/* Perk Tree Preview */}
        {skill.perkTree && (
          <div className="space-y-2">
            <H5 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              Perk Tree: {skill.perkTree.name}
            </H5>
            <div className="pl-6">
              <P className="text-sm text-muted-foreground">
                {skill.perkTree.description}
              </P>
              <div className="mt-2 text-xs text-muted-foreground">
                {skill.selectedPerksCount} perks selected • {skill.totalPerkRanks} total ranks
              </div>
            </div>
          </div>
        )}
      </div>
    </GenericAccordionCard>
  )
} 