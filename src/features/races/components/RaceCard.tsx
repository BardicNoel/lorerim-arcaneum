import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { H3, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import { Shield, Zap, Heart, Brain, Target, Flame, Droplets, Skull, Sword, BookOpen, Eye, Hand } from 'lucide-react'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'
import { CategoryBadge } from './CategoryBadge'
import { StatBar } from './StatBar'
import { KeywordTag } from './KeywordTag'

interface RaceCardProps {
  item: PlayerCreationItem
  originalRace?: Race
  isSelected?: boolean
  className?: string
}

// Enhanced icon mapping for abilities and skills
const abilityIcons: Record<string, React.ReactNode> = {
  'Waterbreathing': <Droplets className="h-3 w-3 text-blue-500" />,
  'Night Eye': <Eye className="h-3 w-3 text-blue-500" />,
  'Claws': <Hand className="h-3 w-3 text-gray-500" />,
  'Histskin': <Heart className="h-3 w-3 text-green-500" />,
  'Dragonskin': <Shield className="h-3 w-3 text-yellow-500" />,
  'Magic Resistance': <Zap className="h-3 w-3 text-purple-500" />,
  'Voice of the Emperor': <Brain className="h-3 w-3 text-blue-500" />,
  'Battle Cry': <Target className="h-3 w-3 text-red-500" />,
  'Strong Stomach': <Heart className="h-3 w-3 text-green-500" />,
  'Feline Agility': <Target className="h-3 w-3 text-cyan-500" />,
  'Fingersmith': <Hand className="h-3 w-3 text-purple-500" />,
  'Imperial Diversity': <Brain className="h-3 w-3 text-blue-500" />,
  'Ancestor\'s Wrath': <Flame className="h-3 w-3 text-orange-500" />,
  'Berserker Rage': <Target className="h-3 w-3 text-red-500" />,
  'Adrenaline Rush': <Zap className="h-3 w-3 text-yellow-500" />,
  'Command Animal': <Target className="h-3 w-3 text-brown-500" />
}

const skillIcons: Record<string, React.ReactNode> = {
  'Destruction': <Flame className="h-3 w-3 text-red-500" />,
  'Restoration': <Heart className="h-3 w-3 text-green-500" />,
  'Alteration': <Shield className="h-3 w-3 text-blue-500" />,
  'Illusion': <Brain className="h-3 w-3 text-purple-500" />,
  'Conjuration': <Zap className="h-3 w-3 text-purple-500" />,
  'Enchanting': <BookOpen className="h-3 w-3 text-blue-500" />,
  'Alchemy': <Droplets className="h-3 w-3 text-green-500" />,
  'Light Armor': <Shield className="h-3 w-3 text-blue-500" />,
  'Heavy Armor': <Shield className="h-3 w-3 text-gray-500" />,
  'One-Handed': <Sword className="h-3 w-3 text-orange-500" />,
  'Two-Handed': <Sword className="h-3 w-3 text-red-500" />,
  'Archery': <Target className="h-3 w-3 text-green-500" />,
  'Block': <Shield className="h-3 w-3 text-yellow-500" />,
  'Smithing': <Shield className="h-3 w-3 text-gray-500" />,
  'Speechcraft': <Brain className="h-3 w-3 text-blue-500" />,
  'Sneak': <Eye className="h-3 w-3 text-purple-500" />,
  'Lockpicking': <Hand className="h-3 w-3 text-yellow-500" />,
  'Pickpocket': <Hand className="h-3 w-3 text-purple-500" />
}

export function RaceCard({ item, originalRace, isSelected = false, className }: RaceCardProps) {
  const getAbilityIcon = (abilityName: string) => {
    return abilityIcons[abilityName] || <Target className="h-3 w-3 text-gray-500" />
  }

  const getSkillIcon = (skillName: string) => {
    return skillIcons[skillName] || <BookOpen className="h-3 w-3 text-gray-500" />
  }

  // Get top abilities and skills for display
  const topAbilities = item.effects?.slice(0, 2) || []
  const topSkills = originalRace?.skillBonuses?.slice(0, 2) || []
  const topKeywords = item.tags?.slice(0, 3) || []

  return (
    <Card 
      className={`bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-muted-foreground">
                  {item.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <H3 className="text-primary font-semibold mb-1">{item.name}</H3>
                {item.category && (
                  <CategoryBadge category={item.category as 'Human' | 'Elf' | 'Beast'} size="sm" />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Description */}
        <div className="line-clamp-2">
          <MarkdownText className="text-sm text-muted-foreground">
            {item.summary || item.description}
          </MarkdownText>
        </div>
        
        {/* Stats Preview */}
        {originalRace?.startingStats && (
          <div className="space-y-2">
            <Small className="font-medium text-foreground">Starting Stats:</Small>
            <div className="grid grid-cols-3 gap-2">
              <StatBar 
                value={originalRace.startingStats.health} 
                maxValue={150} 
                label="HP" 
                color="red" 
                size="sm" 
                showValue={false}
              />
              <StatBar 
                value={originalRace.startingStats.magicka} 
                maxValue={150} 
                label="MP" 
                color="blue" 
                size="sm" 
                showValue={false}
              />
              <StatBar 
                value={originalRace.startingStats.stamina} 
                maxValue={150} 
                label="SP" 
                color="green" 
                size="sm" 
                showValue={false}
              />
            </div>
          </div>
        )}
        
        {/* Top Abilities */}
        {topAbilities.length > 0 && (
          <div className="space-y-2">
            <Small className="font-medium text-foreground">Key Abilities:</Small>
            <div className="flex flex-wrap gap-1">
              {topAbilities.map((ability, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
                  title={ability.description}
                >
                  {getAbilityIcon(ability.name)}
                  <span className="font-medium">{ability.name}</span>
                </div>
              ))}
              {item.effects && item.effects.length > 2 && (
                <Small className="text-muted-foreground">
                  +{item.effects.length - 2} more
                </Small>
              )}
            </div>
          </div>
        )}
        
        {/* Top Skills */}
        {topSkills.length > 0 && (
          <div className="space-y-2">
            <Small className="font-medium text-foreground">Skill Bonuses:</Small>
            <div className="flex flex-wrap gap-1">
              {topSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
                >
                  {getSkillIcon(skill.skill)}
                  <span className="font-medium">{skill.skill} +{skill.bonus}</span>
                </div>
              ))}
              {originalRace?.skillBonuses && originalRace.skillBonuses.length > 2 && (
                <Small className="text-muted-foreground">
                  +{originalRace.skillBonuses.length - 2} more
                </Small>
              )}
            </div>
          </div>
        )}
        
        {/* Keywords */}
        {topKeywords.length > 0 && (
          <div className="space-y-2">
            <Small className="font-medium text-foreground">Traits:</Small>
            <div className="flex flex-wrap gap-1">
              {topKeywords.slice(0, 3).map((keyword, index) => (
                <KeywordTag key={index} keyword={keyword} size="sm" />
              ))}
              {item.tags && item.tags.length > 3 && (
                <Small className="text-muted-foreground">
                  +{item.tags.length - 3} more
                </Small>
              )}
            </div>
          </div>
        )}
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
        )}
      </CardContent>
    </Card>
  )
} 