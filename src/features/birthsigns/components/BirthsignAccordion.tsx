import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import { 
  Shield, Zap, Heart, Brain, Target, Flame, Droplets, Skull, 
  Sword, BookOpen, Eye, Hand, ChevronDown, ChevronRight, ChevronUp,
  Plus, Minus, Circle, Star, Activity, Zap as Lightning
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Birthsign } from '../types'
import { parseDescription, getUserFriendlyStat } from '../utils'

/**
 * Component to format any description with highlighted values in angle brackets
 */
function FormattedText({ text, className = "text-sm text-muted-foreground" }: { 
  text: string; 
  className?: string 
}) {
  if (!text) return null
  
  // Parse the description to replace placeholders
  const parsedText = parseDescription(text)
  
  // Split the processed text by angle bracket patterns and highlight the values
  const parts = parsedText.split(/(<[^>]+>)/g)
  
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
  'power': <Lightning className="h-4 w-4 text-yellow-500" />
}

const groupIcons: Record<string, string> = {
  'Warrior': '⚔️',
  'Mage': '🔮',
  'Thief': '🗡️',
  'Serpent': '🐍',
  'Other': '⭐'
}

const groupColors: Record<string, string> = {
  'Warrior': 'text-red-600',
  'Mage': 'text-blue-600',
  'Thief': 'text-green-600',
  'Serpent': 'text-purple-600',
  'Other': 'text-yellow-500'
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
  showEffects = true
}: BirthsignAccordionProps) {
  if (!originalBirthsign) return null

  const groupIcon = groupIcons[originalBirthsign.group] || groupIcons['Other']
  const groupColor = groupColors[originalBirthsign.group] || groupColors['Other']

  const getEffectIcon = (effectType: string) => {
    return effectIcons[effectType.toLowerCase()] || <Star className="h-4 w-4 text-muted-foreground" />
  }

  const getEffectIconByType = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'negative':
        return <Minus className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <Circle className="h-4 w-4 text-blue-500" />
      default:
        return <Star className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Parse the description to replace placeholders
  const parsedDescription = parseDescription(originalBirthsign.description)

  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{groupIcon}</span>
            <div>
              <H3 className="text-lg font-semibold">{originalBirthsign.name}</H3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={cn('text-xs', groupColor)}
                >
                  {originalBirthsign.group}
                </Badge>
                {originalBirthsign.powers.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {originalBirthsign.powers.length} power{originalBirthsign.powers.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <FormattedText 
          text={parsedDescription} 
          className="text-sm text-muted-foreground mt-2"
        />
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-6">
            {/* Stats Section */}
            {showStats && originalBirthsign.stat_modifications.length > 0 && (
              <div>
                <H4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Stat Modifications
                </H4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {originalBirthsign.stat_modifications.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2">
                        {getEffectIcon(stat.stat)}
                        <span className="font-medium">
                          {getUserFriendlyStat(stat.stat)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getEffectIconByType(stat.type === 'bonus' ? 'positive' : 'negative')}
                        <span className={cn(
                          "font-bold",
                          stat.type === 'bonus' ? "text-green-600" : "text-red-600"
                        )}>
                          {stat.type === 'bonus' ? '+' : '-'}{stat.value}{stat.value_type === 'percentage' ? '%' : ''}
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
                <H4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Lightning className="h-4 w-4 text-yellow-500" />
                  Powers
                </H4>
                <div className="space-y-3">
                  {originalBirthsign.powers.map((power, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <H4 className="text-sm font-semibold">{power.name}</H4>
                        {power.magnitude && (
                          <Badge variant="outline" className="text-xs">
                            Magnitude: {power.magnitude}
                          </Badge>
                        )}
                      </div>
                      <FormattedText 
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
                <H4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  Skill Bonuses
                </H4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {originalBirthsign.skill_bonuses.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2">
                        {getEffectIcon(skill.stat)}
                        <span className="font-medium">
                          {getUserFriendlyStat(skill.stat)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getEffectIconByType('positive')}
                        <span className="font-bold text-green-600">
                          +{skill.value}{skill.value_type === 'percentage' ? '%' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Effects Section */}
            {showEffects && (originalBirthsign.conditional_effects?.length > 0 || originalBirthsign.mastery_effects?.length > 0) && (
              <div>
                <H4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-500" />
                  Special Effects
                </H4>
                <div className="space-y-3">
                  {/* Conditional Effects */}
                  {originalBirthsign.conditional_effects?.map((effect, index) => (
                    <div key={`conditional-${index}`} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Circle className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-sm">Conditional Effect</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{effect.stat}</div>
                        <FormattedText 
                          text={effect.description} 
                          className="text-sm text-muted-foreground"
                        />
                        {effect.condition && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Condition:</span> {effect.condition}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Mastery Effects */}
                  {originalBirthsign.mastery_effects?.map((effect, index) => (
                    <div key={`mastery-${index}`} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-sm">Mastery Effect</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{effect.stat}</div>
                        <FormattedText 
                          text={effect.description} 
                          className="text-sm text-muted-foreground"
                        />
                        {effect.condition && (
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Condition:</span> {effect.condition}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div>
                <H4 className="text-base font-semibold mb-3">Tags</H4>
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
        </CardContent>
      )}
    </Card>
  )
} 