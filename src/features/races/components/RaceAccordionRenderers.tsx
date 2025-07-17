import React from 'react'
import { H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import { 
  Shield, Zap, Heart, Brain, Target, Flame, Droplets, Skull, 
  Sword, BookOpen, Eye, Hand, Plus, Minus, Circle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'
import { CategoryBadge } from './CategoryBadge'
import { StatBar } from './StatBar'
import { RaceAvatar } from './RaceAvatar'

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
            <span key={index} className="font-bold text-skyrim-gold">
              {value}
            </span>
          )
        }
        return part
      })}
    </P>
  )
}

// Enhanced icon mapping for abilities and skills
const abilityIcons: Record<string, React.ReactNode> = {
  'Waterbreathing': <Droplets className="h-4 w-4 text-blue-500" />,
  'Night Eye': <Eye className="h-4 w-4 text-blue-500" />,
  'Claws': <Hand className="h-4 w-4 text-gray-500" />,
  'Histskin': <Heart className="h-4 w-4 text-green-500" />,
  'Dragonskin': <Shield className="h-4 w-4 text-yellow-500" />,
  'Magic Resistance': <Zap className="h-4 w-4 text-purple-500" />,
  'Voice of the Emperor': <Brain className="h-4 w-4 text-blue-500" />,
  'Battle Cry': <Target className="h-4 w-4 text-red-500" />,
  'Strong Stomach': <Heart className="h-4 w-4 text-green-500" />,
  'Feline Agility': <Target className="h-4 w-4 text-cyan-500" />,
  'Fingersmith': <Hand className="h-4 w-4 text-purple-500" />,
  'Imperial Diversity': <Brain className="h-4 w-4 text-blue-500" />,
  'Ancestor\'s Wrath': <Flame className="h-4 w-4 text-orange-500" />,
  'Berserker Rage': <Target className="h-4 w-4 text-red-500" />,
  'Adrenaline Rush': <Zap className="h-4 w-4 text-yellow-500" />,
  'Command Animal': <Target className="h-4 w-4 text-brown-500" />
}

const skillIcons: Record<string, React.ReactNode> = {
  'Destruction': <Flame className="h-4 w-4 text-red-500" />,
  'Restoration': <Heart className="h-4 w-4 text-green-500" />,
  'Alteration': <Shield className="h-4 w-4 text-blue-500" />,
  'Illusion': <Brain className="h-4 w-4 text-purple-500" />,
  'Conjuration': <Zap className="h-4 w-4 text-purple-500" />,
  'Enchanting': <BookOpen className="h-4 w-4 text-blue-500" />,
  'Alchemy': <Droplets className="h-4 w-4 text-green-500" />,
  'Light Armor': <Shield className="h-4 w-4 text-blue-500" />,
  'Heavy Armor': <Shield className="h-4 w-4 text-gray-500" />,
  'One-Handed': <Sword className="h-4 w-4 text-orange-500" />,
  'Two-Handed': <Sword className="h-4 w-4 text-red-500" />,
  'Archery': <Target className="h-4 w-4 text-green-500" />,
  'Block': <Shield className="h-4 w-4 text-yellow-500" />,
  'Smithing': <Shield className="h-4 w-4 text-gray-500" />,
  'Speechcraft': <Brain className="h-4 w-4 text-blue-500" />,
  'Sneak': <Eye className="h-4 w-4 text-purple-500" />,
  'Lockpicking': <Hand className="h-4 w-4 text-yellow-500" />,
  'Pickpocket': <Hand className="h-4 w-4 text-purple-500" />
}

const getAbilityIcon = (abilityName: string) => {
  return abilityIcons[abilityName] || <Target className="h-4 w-4 text-gray-500" />
}

const getSkillIcon = (skillName: string) => {
  return skillIcons[skillName] || <BookOpen className="h-4 w-4 text-gray-500" />
}

const getEffectIcon = (type: 'positive' | 'negative' | 'neutral') => {
  switch (type) {
    case 'positive':
      return <Plus className="h-4 w-4 text-green-500" />
    case 'negative':
      return <Minus className="h-4 w-4 text-red-500" />
    case 'neutral':
      return <Circle className="h-4 w-4 text-blue-500" />
  }
}

const calculateRegeneration = (regeneration: Race['regeneration']['health'] | Race['regeneration']['magicka'] | Race['regeneration']['stamina']) => {
  let baseValue = regeneration.base;
  if (regeneration.multipliers) {
    for (const mult of regeneration.multipliers) {
      baseValue *= mult.value;
    }
  }
  if (regeneration.adjustments) {
    for (const adj of regeneration.adjustments) {
      baseValue += adj.value;
    }
  }
  return baseValue;
};

const hasRegenerationDetails = (regeneration: Race['regeneration']['health'] | Race['regeneration']['magicka'] | Race['regeneration']['stamina']) => {
  return (regeneration.multipliers && regeneration.multipliers.length > 0) || (regeneration.adjustments && regeneration.adjustments.length > 0);
};

/**
 * Render the header content for a race accordion
 */
export function renderRaceHeader(item: PlayerCreationItem, originalRace?: Race) {
  return (
    <>
      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
        <RaceAvatar raceName={item.name} size="lg" />
      </div>
      <div className="flex-1">
        <H3 className="text-primary font-semibold">{item.name}</H3>
      </div>
      
      {/* Right side: Classification + Stats */}
      <div className="flex items-center gap-3">
        {/* Classification tag */}
        {item.category && (
          <CategoryBadge category={item.category as 'Human' | 'Elf' | 'Beast'} size="sm" />
        )}
        
        {/* Quick stats preview */}
        {originalRace?.startingStats && (
          <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-500" />
              <span>{originalRace.startingStats.health}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-500" />
              <span>{originalRace.startingStats.magicka}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-green-500" />
              <span>{originalRace.startingStats.stamina}</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Render the collapsed content for a race accordion
 */
export function renderRaceCollapsedContent(item: PlayerCreationItem, originalRace?: Race) {
  return (
    <div className="space-y-3">
      {/* Description */}
      <div className="line-clamp-2">
        <MarkdownText className="text-sm text-muted-foreground">
          {item.summary || item.description}
        </MarkdownText>
      </div>
      
      {/* Quick abilities and skills */}
      <div className="flex flex-wrap gap-2">
        {item.effects?.slice(0, 2).map((ability, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
            title={ability.description}
          >
            {getAbilityIcon(ability.name)}
            <span className="font-medium">{ability.name}</span>
          </div>
        ))}
        {originalRace?.skillBonuses?.slice(0, 2).map((skill, index) => (
          <div
            key={`skill-${index}`}
            className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
          >
            {getSkillIcon(skill.skill)}
            <span className="font-medium">{skill.skill} +{skill.bonus}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Render the expanded content for a race accordion
 */
export function renderRaceExpandedContent(item: PlayerCreationItem, originalRace?: Race) {
  return (
    <>
      {/* Description */}
      <div>
        <H4 className="mb-2">Description</H4>
        <MarkdownText className="text-sm text-muted-foreground leading-relaxed">
          {item.description}
        </MarkdownText>
      </div>

      {/* Starting Stats */}
      {originalRace?.startingStats && (
        <div>
          <H4 className="mb-3">Starting Attributes</H4>
          <div className="space-y-3">
            {/* Calculate the maximum value for proportional scaling */}
            {(() => {
              const stats = [
                { value: originalRace.startingStats.health, label: 'Health', color: 'red', icon: <Heart className="h-4 w-4 text-red-500" /> },
                { value: originalRace.startingStats.magicka, label: 'Magicka', color: 'blue', icon: <Zap className="h-4 w-4 text-blue-500" /> },
                { value: originalRace.startingStats.stamina, label: 'Stamina', color: 'green', icon: <Target className="h-4 w-4 text-green-500" /> }
              ]
              const maxValue = Math.max(...stats.map(s => s.value))
              
              return (
                <>
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {stat.icon}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{stat.label}</span>
                          <span className="text-sm text-muted-foreground">{stat.value}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-2 bg-${stat.color}-500 transition-all duration-300 ease-out`}
                            style={{ width: `${(stat.value / maxValue) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <Shield className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Carry Weight: {originalRace.startingStats.carryWeight}</span>
                  </div>
                </>
              )
            })()}
          </div>
        </div>
      )}

      {/* Skill Bonuses */}
      {originalRace?.skillBonuses && originalRace.skillBonuses.length > 0 && (
        <div>
          <H4 className="mb-3">Skill Bonuses</H4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {originalRace.skillBonuses.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border"
              >
                {getSkillIcon(skill.skill)}
                <div>
                  <P className="font-medium text-sm">{skill.skill}</P>
                  <Small className="text-muted-foreground">+{skill.bonus} bonus</Small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Racial Abilities */}
      {item.effects && item.effects.length > 0 && (
        <div>
          <H4 className="mb-3">Racial Abilities</H4>
          <div className="space-y-3">
            {item.effects.map((effect, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    {getAbilityIcon(effect.name)}
                    {getEffectIcon(effect.type)}
                  </div>
                  <div className="flex-1">
                    <P className="font-medium text-sm mb-1">{effect.name}</P>
                    <FormattedDescription description={effect.description} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regeneration & Combat (if available) */}
      {originalRace?.regeneration && (
        <div>
          <H4 className="mb-3">Regeneration Rates</H4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm">
                Health: {calculateRegeneration(originalRace.regeneration.health).toFixed(2)}/s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                Magicka: {calculateRegeneration(originalRace.regeneration.magicka).toFixed(2)}/s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                Stamina: {calculateRegeneration(originalRace.regeneration.stamina).toFixed(2)}/s
              </span>
            </div>
          </div>
          
          {/* Show regeneration details if there are multipliers or adjustments */}
          {(hasRegenerationDetails(originalRace.regeneration.health) || 
            hasRegenerationDetails(originalRace.regeneration.magicka) || 
            hasRegenerationDetails(originalRace.regeneration.stamina)) && (
            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
              <Small className="font-medium mb-2 block">Regeneration Details:</Small>
              {originalRace.regeneration.health.multipliers?.map((mult, index) => (
                <div key={`health-mult-${index}`} className="text-xs text-muted-foreground">
                  Health: {mult.value}x from {mult.source}
                </div>
              ))}
              {originalRace.regeneration.health.adjustments?.map((adj, index) => (
                <div key={`health-adj-${index}`} className="text-xs text-muted-foreground">
                  Health: +{adj.value}/s from {adj.source}
                </div>
              ))}
              {originalRace.regeneration.magicka.multipliers?.map((mult, index) => (
                <div key={`magicka-mult-${index}`} className="text-xs text-muted-foreground">
                  Magicka: {mult.value}x from {mult.source}
                </div>
              ))}
              {originalRace.regeneration.stamina.multipliers?.map((mult, index) => (
                <div key={`stamina-mult-${index}`} className="text-xs text-muted-foreground">
                  Stamina: {mult.value}x from {mult.source}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Physical Attributes */}
      {originalRace?.physicalAttributes && (
        <div>
          <H4 className="mb-3">Physical Attributes</H4>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Height:</span>
            <span className="text-sm">Male: {(originalRace.physicalAttributes.heightMale * 100).toFixed(0)}%</span>
            <span className="text-sm">Female: {(originalRace.physicalAttributes.heightFemale * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {originalRace?.combat && (
        <div>
          <H4 className="mb-3">Combat Stats</H4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Sword className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Unarmed Damage: {originalRace.combat.unarmedDamage}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Unarmed Reach: {originalRace.combat.unarmedReach}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 