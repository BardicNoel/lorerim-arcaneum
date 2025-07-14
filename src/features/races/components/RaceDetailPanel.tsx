import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import { X, Plus, Minus, Circle, Shield, Zap, Heart, Brain, Target, Flame, Droplets, Skull, Clock } from 'lucide-react'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race } from '../types'

interface RaceDetailPanelProps {
  item: PlayerCreationItem
  originalRace?: Race // Pass the original race data for stats
  onClose?: () => void
  className?: string
}

const traitIcons: Record<string, React.ReactNode> = {
  'Frost Resistance': <Droplets className="h-4 w-4 text-blue-500" />,
  'Fire Resistance': <Flame className="h-4 w-4 text-red-500" />,
  'Magic Resistance': <Zap className="h-4 w-4 text-purple-500" />,
  'Disease Resistance': <Skull className="h-4 w-4 text-green-500" />,
  'Poison Resistance': <Skull className="h-4 w-4 text-green-500" />,
  'Battle Cry': <Target className="h-4 w-4 text-red-500" />,
  'Dragon Skin': <Shield className="h-4 w-4 text-yellow-500" />,
  'Berserker Rage': <Target className="h-4 w-4 text-red-500" />,
  'Ancestor\'s Wrath': <Flame className="h-4 w-4 text-orange-500" />,
  'Histskin': <Heart className="h-4 w-4 text-green-500" />,
  'Command Animal': <Target className="h-4 w-4 text-brown-500" />,
  'Adrenaline Rush': <Zap className="h-4 w-4 text-yellow-500" />,
  'Voice of the Emperor': <Brain className="h-4 w-4 text-blue-500" />,
  'Night Eye': <Target className="h-4 w-4 text-blue-500" />,
  'Claws': <Target className="h-4 w-4 text-gray-500" />,
  'Magicka Boost': <Zap className="h-4 w-4 text-purple-500" />,
  'Highborn': <Brain className="h-4 w-4 text-purple-500" />,
  'Water Breathing': <Droplets className="h-4 w-4 text-blue-500" />,
  'Strong Constitution': <Heart className="h-4 w-4 text-green-500" />,
  'Resist Disease': <Skull className="h-4 w-4 text-green-500" />,
  'Resist Poison': <Skull className="h-4 w-4 text-green-500" />,
  'Imperial Luck': <Target className="h-4 w-4 text-yellow-500" />
}

const statIcons = {
  health: <Heart className="h-4 w-4 text-red-500" />,
  mana: <Zap className="h-4 w-4 text-blue-500" />,
  stamina: <Target className="h-4 w-4 text-green-500" />,
  strength: <Shield className="h-4 w-4 text-orange-500" />,
  intelligence: <Brain className="h-4 w-4 text-purple-500" />,
  agility: <Target className="h-4 w-4 text-cyan-500" />
}

export function RaceDetailPanel({ item, originalRace, onClose, className }: RaceDetailPanelProps) {
  const getTraitIcon = (traitName: string) => {
    return traitIcons[traitName] || <Target className="h-4 w-4 text-gray-500" />
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

  const renderStatBar = (value: number, maxValue: number = 15) => {
    const percentage = (value / maxValue) * 100
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 text-xs font-medium">{value}</div>
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <H3 className="text-primary font-semibold mb-2">{item.name}</H3>
            {item.category && (
              <Badge variant="secondary" className="mb-3">
                {item.category}
              </Badge>
            )}
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {statIcons.health}
                    <Small className="font-medium">Health</Small>
                  </div>
                  {renderStatBar(originalRace.startingStats.health, 120)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {statIcons.mana}
                    <Small className="font-medium">Mana</Small>
                  </div>
                  {renderStatBar(originalRace.startingStats.mana, 120)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {statIcons.stamina}
                    <Small className="font-medium">Stamina</Small>
                  </div>
                  {renderStatBar(originalRace.startingStats.stamina, 120)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {statIcons.strength}
                    <Small className="font-medium">Strength</Small>
                  </div>
                  {renderStatBar(originalRace.startingStats.strength, 15)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {statIcons.intelligence}
                    <Small className="font-medium">Intelligence</Small>
                  </div>
                  {renderStatBar(originalRace.startingStats.intelligence, 15)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {statIcons.agility}
                    <Small className="font-medium">Agility</Small>
                  </div>
                  {renderStatBar(originalRace.startingStats.agility, 15)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Racial Traits */}
        {item.effects && item.effects.length > 0 && (
          <div>
            <H4 className="mb-3">Racial Traits</H4>
            <div className="space-y-3">
              {item.effects.map((effect, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      {getTraitIcon(effect.name)}
                      {getEffectIcon(effect.type)}
                    </div>
                    <div className="flex-1">
                      <P className="font-medium text-sm mb-1">{effect.name}</P>
                      <P className="text-xs text-muted-foreground mb-2">
                        {effect.description}
                      </P>
                      {effect.value && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Value: {effect.value}</span>
                          {effect.target && <span>• Target: {effect.target}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div>
            <H4 className="mb-2">Tags</H4>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 