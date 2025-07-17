import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import { 
  Shield, Zap, Heart, Brain, Target, Flame, Droplets, Skull, 
  Sword, BookOpen, Eye, Hand, ChevronDown, ChevronRight,
  Plus, Minus, Circle, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Religion } from '../types'

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

/**
 * Function to format blessing descriptions by replacing placeholders with actual values
 */
function formatBlessingDescription(description: string, magnitude: number, duration: number, area: number = 0): string {
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

interface ReligionAccordionProps {
  item: PlayerCreationItem
  originalReligion?: Religion
  isExpanded?: boolean
  onToggle?: () => void
  className?: string
}

// Enhanced icon mapping for religion effects
const effectIcons: Record<string, React.ReactNode> = {
  'Restoration': <Heart className="h-4 w-4 text-green-500" />,
  'Destruction': <Flame className="h-4 w-4 text-red-500" />,
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

// Religion type styling
const religionTypeStyles: Record<string, string> = {
  'Divine': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  'Daedric': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  'Aedric': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  'Tribal': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  'Ancestral': 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
}

export function ReligionAccordion({ 
  item, 
  originalReligion, 
  isExpanded = false, 
  onToggle, 
  className
}: ReligionAccordionProps) {
  const getEffectIcon = (effectType: string) => {
    return effectIcons[effectType] || <Star className="h-4 w-4 text-gray-500" />
  }

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
    <Card className={cn('bg-card border rounded-lg shadow-sm transition-all duration-200 w-full', className)}>
      {/* Header - Always visible */}
      <CardHeader className="pb-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-1">
              <H3 className="text-primary font-semibold">{item.name}</H3>
            </div>
          </div>
          
          {/* Right side: Classification + Effects + Button */}
          <div className="flex items-center gap-3">
            {/* Religion type tag */}
            {item.category && (
              <Badge 
                variant="outline"
                className={cn(
                  religionTypeStyles[item.category] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                  sizeClasses.sm,
                  'font-medium transition-colors'
                )}
              >
                {item.category}
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
            
            {/* Expand/collapse button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onToggle?.()
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Collapsed content - Quick preview */}
      {!isExpanded && (
        <CardContent className="pt-0 pb-3">
          <div className="space-y-3">
            {/* Description */}
            <div className="line-clamp-2">
              <MarkdownText className="text-sm text-muted-foreground">
                {item.summary || item.description}
              </MarkdownText>
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
        </CardContent>
      )}

      {/* Expanded content - Detailed view */}
      {isExpanded && (
        <CardContent className="pt-0 space-y-6">
          {/* Description */}
          <div>
            <H4 className="mb-2">Description</H4>
            <MarkdownText className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </MarkdownText>
          </div>

          {/* Religion Type */}
          {item.category && (
            <div>
              <H4 className="mb-3">Religion Type</H4>
              <Badge 
                variant="outline"
                className={cn(
                  religionTypeStyles[item.category] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                  sizeClasses.md,
                  'font-medium transition-colors'
                )}
              >
                {item.category}
              </Badge>
            </div>
          )}

          {/* Favored Races */}
          {originalReligion?.favoredRaces && originalReligion.favoredRaces.length > 0 && (
            <div>
              <H4 className="mb-3">Favored Races</H4>
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
          {originalReligion?.worshipRestrictions && originalReligion.worshipRestrictions.length > 0 && (
            <div>
              <H4 className="mb-3">Worship Restrictions</H4>
              <div className="space-y-2">
                {originalReligion.worshipRestrictions.map((restriction, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-start gap-2">
                      <Minus className="h-4 w-4 text-red-500 mt-0.5" />
                      <P className="text-sm text-muted-foreground">{restriction}</P>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blessing Details */}
          {originalReligion?.blessing && (
            <div>
              <H4 className="mb-3">Blessing</H4>
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <P className="text-sm font-medium mb-3">Spell: {originalReligion.blessing.spellName}</P>
                <div className="space-y-3">
                  {originalReligion.blessing.effects.map((effect, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getEffectIconByType('positive')}
                          {effect.effectType && getEffectIcon(effect.effectType)}
                        </div>
                        <div className="flex-1">
                          <P className="font-medium text-sm mb-1">{effect.effectName}</P>
                          <P className="text-xs text-muted-foreground">
                            {formatBlessingDescription(effect.effectDescription, effect.magnitude, effect.duration, effect.area)}
                          </P>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Magnitude: {effect.magnitude}</span>
                            <span>Duration: {effect.duration}s</span>
                            {effect.area > 0 && <span>Area: {effect.area}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tenet Effects */}
          {originalReligion?.tenet?.effects && originalReligion.tenet.effects.length > 0 && (
            <div>
              <H4 className="mb-3">Tenets</H4>
              <div className="space-y-3">
                {originalReligion.tenet.effects.map((effect, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getEffectIconByType('positive')}
                        {effect.targetAttribute && getEffectIcon(effect.targetAttribute)}
                      </div>
                      <div className="flex-1">
                        <P className="font-medium text-sm mb-1">{effect.effectName}</P>
                        <FormattedDescription description={effect.effectDescription} />
                        {effect.magnitude && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Magnitude: {effect.magnitude}</span>
                            {effect.targetAttribute && <span>• Target: {effect.targetAttribute}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follower Power (Boon 1) */}
          {originalReligion?.boon1 && (
            <div>
              <H4 className="mb-3">Follower Power: {originalReligion.boon1.spellName}</H4>
              <div className="space-y-3">
                {originalReligion.boon1.effects.map((effect, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getEffectIconByType('positive')}
                        {effect.effectType && getEffectIcon(effect.effectType)}
                      </div>
                      <div className="flex-1">
                        <P className="font-medium text-sm mb-1">{effect.effectName}</P>
                        <P className="text-xs text-muted-foreground">
                          {formatBlessingDescription(effect.effectDescription, effect.magnitude, effect.duration, effect.area)}
                        </P>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Magnitude: {effect.magnitude}</span>
                          <span>Duration: {effect.duration}s</span>
                          {effect.area > 0 && <span>Area: {effect.area}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Devotee Power (Boon 2) */}
          {originalReligion?.boon2 && (
            <div>
              <H4 className="mb-3">Devotee Power: {originalReligion.boon2.spellName}</H4>
              <div className="space-y-3">
                {originalReligion.boon2.effects.map((effect, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getEffectIconByType('positive')}
                        {effect.effectType && getEffectIcon(effect.effectType)}
                      </div>
                      <div className="flex-1">
                        <P className="font-medium text-sm mb-1">{effect.effectName}</P>
                        <P className="text-xs text-muted-foreground">
                          {formatBlessingDescription(effect.effectDescription, effect.magnitude, effect.duration, effect.area)}
                        </P>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Magnitude: {effect.magnitude}</span>
                          <span>Duration: {effect.duration}s</span>
                          {effect.area > 0 && <span>Area: {effect.area}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
} 