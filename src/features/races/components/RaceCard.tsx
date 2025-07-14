import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P, Small } from '@/shared/ui/ui/typography'
import { Shield, Zap, Heart, Brain, Target, Flame, Droplets, Skull } from 'lucide-react'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'

interface RaceCardProps {
  item: PlayerCreationItem
  isSelected?: boolean
  className?: string
}

const traitIcons: Record<string, React.ReactNode> = {
  'Frost Resistance': <Droplets className="h-3 w-3 text-blue-500" />,
  'Fire Resistance': <Flame className="h-3 w-3 text-red-500" />,
  'Magic Resistance': <Zap className="h-3 w-3 text-purple-500" />,
  'Disease Resistance': <Skull className="h-3 w-3 text-green-500" />,
  'Poison Resistance': <Skull className="h-3 w-3 text-green-500" />,
  'Battle Cry': <Target className="h-3 w-3 text-red-500" />,
  'Dragon Skin': <Shield className="h-3 w-3 text-yellow-500" />,
  'Berserker Rage': <Target className="h-3 w-3 text-red-500" />,
  'Ancestor\'s Wrath': <Flame className="h-3 w-3 text-orange-500" />,
  'Histskin': <Heart className="h-3 w-3 text-green-500" />,
  'Command Animal': <Target className="h-3 w-3 text-brown-500" />,
  'Adrenaline Rush': <Zap className="h-3 w-3 text-yellow-500" />,
  'Voice of the Emperor': <Brain className="h-3 w-3 text-blue-500" />,
  'Night Eye': <Target className="h-3 w-3 text-blue-500" />,
  'Claws': <Target className="h-3 w-3 text-gray-500" />,
  'Magicka Boost': <Zap className="h-3 w-3 text-purple-500" />,
  'Highborn': <Brain className="h-3 w-3 text-purple-500" />,
  'Water Breathing': <Droplets className="h-3 w-3 text-blue-500" />,
  'Strong Constitution': <Heart className="h-3 w-3 text-green-500" />,
  'Resist Disease': <Skull className="h-3 w-3 text-green-500" />,
  'Resist Poison': <Skull className="h-3 w-3 text-green-500" />,
  'Imperial Luck': <Target className="h-3 w-3 text-yellow-500" />
}

const raceTypeColors: Record<string, string> = {
  'Human': 'bg-blue-100 text-blue-800 border-blue-200',
  'Elf': 'bg-purple-100 text-purple-800 border-purple-200',
  'Beast': 'bg-orange-100 text-orange-800 border-orange-200'
}

export function RaceCard({ item, isSelected = false, className }: RaceCardProps) {
  const getTraitIcon = (traitName: string) => {
    return traitIcons[traitName] || <Target className="h-3 w-3 text-gray-500" />
  }

  const getRaceTypeColor = (category: string) => {
    return raceTypeColors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <Card 
      className={`bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
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
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRaceTypeColor(item.category)}`}
                  >
                    {item.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <P className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {item.summary || item.description}
        </P>
        
        {/* Key Traits with Icons */}
        <div className="space-y-2">
          <Small className="font-medium text-foreground">Key Traits:</Small>
          <div className="flex flex-wrap gap-1">
            {item.effects?.slice(0, 2).map((effect, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded text-xs"
                title={effect.description}
              >
                {getTraitIcon(effect.name)}
                <span className="font-medium">{effect.name}</span>
              </div>
            ))}
            {item.effects && item.effects.length > 2 && (
              <Small className="text-muted-foreground">
                +{item.effects.length - 2} more
              </Small>
            )}
          </div>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
        )}
      </CardContent>
    </Card>
  )
} 