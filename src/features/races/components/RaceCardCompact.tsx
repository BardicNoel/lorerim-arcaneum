import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { H4, P, Small } from '@/shared/ui/ui/typography'
import type { Race } from '../types'

interface RaceCardCompactProps {
  race: Race
  onViewDetails?: () => void
}

export function RaceCardCompact({ race, onViewDetails }: RaceCardCompactProps) {
  return (
    <Card
      className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-primary h-full flex flex-col cursor-pointer"
      onClick={onViewDetails}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${race.name}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onViewDetails?.()
        }
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-muted-foreground">
                  {race.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <H4 className="text-primary font-semibold text-sm truncate">{race.name}</H4>
                <Badge variant="secondary" className="text-xs">
                  {getRaceType(race.name)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        <P className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
          {race.description}
        </P>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {race.traits.slice(0, 2).map((trait, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {trait.name}
              </Badge>
            ))}
            {race.traits.length > 2 && (
              <Small className="text-muted-foreground text-xs">
                +{race.traits.length - 2}
              </Small>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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