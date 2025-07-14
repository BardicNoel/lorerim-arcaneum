import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { H2, H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { X, Shield, Zap, Heart, Brain, Battery, Sword, Eye } from 'lucide-react'
import type { Race } from '../types'

interface RaceDetailsPanelProps {
  race: Race | null
  isOpen: boolean
  onClose: () => void
}

export function RaceDetailsPanel({ race, isOpen, onClose }: RaceDetailsPanelProps) {
  const getTraitIcon = (effectType: string) => {
    switch (effectType) {
      case 'resistance':
        return <Shield className="h-4 w-4" />
      case 'ability':
        return <Zap className="h-4 w-4" />
      case 'passive':
        return <Eye className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case 'health':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'mana':
        return <Brain className="h-4 w-4 text-blue-500" />
      case 'stamina':
        return <Battery className="h-4 w-4 text-yellow-500" />
      case 'strength':
        return <Sword className="h-4 w-4 text-orange-500" />
      case 'intelligence':
        return <Brain className="h-4 w-4 text-purple-500" />
      case 'agility':
        return <Eye className="h-4 w-4 text-green-500" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[100]"
          onClick={onClose}
        />
      )}
      
      {/* Side Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-white border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-[101] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {race && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground">
                    {race.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <H2 className="text-primary font-bold text-lg">{race.name}</H2>
                  <Badge variant="secondary" className="text-xs">
                    {getRaceType(race.name)}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Description */}
              <div>
                <H3 className="mb-2 text-base">Description</H3>
                <P className="text-muted-foreground text-sm">{race.description}</P>
              </div>

              {/* Starting Stats */}
              <div>
                <H3 className="mb-3 text-base">Starting Stats</H3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(race.startingStats).map(([stat, value]) => (
                    <Card key={stat} className="p-3">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-2">
                          {getStatIcon(stat)}
                          <div>
                            <Small className="text-muted-foreground capitalize text-xs">
                              {stat}
                            </Small>
                            <div className="font-bold text-base">{value}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Traits */}
              <div>
                <H3 className="mb-3 text-base">Racial Traits</H3>
                <div className="space-y-4">
                  {race.traits.map((trait, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          {getTraitIcon(trait.effect.type)}
                          <CardTitle className="text-base">{trait.name}</CardTitle>
                          <Badge variant="outline" className="capitalize text-xs">
                            {trait.effect.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <P className="text-muted-foreground mb-3 text-sm">
                          {trait.description}
                        </P>
                        
                        {/* Effect Details */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <Small className="font-semibold mb-1 text-xs">Effect Details:</Small>
                          <div className="text-xs text-muted-foreground space-y-1">
                            {trait.effect.type === 'resistance' && (
                              <div>• {trait.effect.value}% resistance to {trait.effect.target}</div>
                            )}
                            {trait.effect.type === 'ability' && (
                              <div>
                                <div>• Ability: {trait.effect.name?.replace(/_/g, ' ')}</div>
                                {trait.effect.cooldown && (
                                  <div>• Cooldown: {trait.effect.cooldown} seconds</div>
                                )}
                              </div>
                            )}
                            {trait.effect.type === 'passive' && (
                              <div>
                                <div>• Passive: {trait.effect.name?.replace(/_/g, ' ')}</div>
                                {trait.effect.value && (
                                  <div>• Value: {trait.effect.value}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-border">
              <Button variant="outline" onClick={onClose} size="sm">
                Close
              </Button>
              <Button size="sm">
                Select Race
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function getRaceType(raceName: string): string {
  const humanRaces = ['Nord', 'Breton', 'Imperial', 'Redguard']
  const elfRaces = ['Altmer', 'Bosmer', 'Dunmer', 'Orsimer']
  const beastRaces = ['Khajiit', 'Argonian']
  
  if (humanRaces.includes(raceName)) return 'Human'
  if (elfRaces.includes(raceName)) return 'Elf'
  if (beastRaces.includes(raceName)) return 'Beast'
  
  return 'Unknown'
} 