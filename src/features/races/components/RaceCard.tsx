import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P, Small } from '@/shared/ui/ui/typography'
import type { Race } from '../types'

interface RaceCardProps {
  race: Race
  onViewDetails?: () => void
}

export function RaceCard({ race, onViewDetails }: RaceCardProps) {
  return (
    <Card className="bg-card border rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-muted-foreground">
                  {race.name.charAt(0)}
                </span>
              </div>
              <div>
                <H3 className="text-primary font-semibold mb-1">{race.name}</H3>
                <Badge variant="secondary" className="text-xs">
                  {getRaceType(race.name)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <P className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {race.description}
        </P>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {race.traits.slice(0, 2).map((trait, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {trait.name}
              </Badge>
            ))}
            {race.traits.length > 2 && (
              <Small className="text-muted-foreground">
                +{race.traits.length - 2} more
              </Small>
            )}
          </div>
          
          <Button 
            variant="secondary" 
            size="sm"
            onClick={onViewDetails}
          >
            Details
          </Button>
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