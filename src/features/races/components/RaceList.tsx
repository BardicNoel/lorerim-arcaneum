import React from 'react'
import { RaceCard } from './RaceCard'
import type { Race } from '../types'

interface RaceListProps {
  races: Race[]
  onViewDetails?: (race: Race) => void
}

export function RaceList({ races, onViewDetails }: RaceListProps) {
  return (
    <div className="space-y-4">
      {races.map((race) => (
        <RaceCard
          key={race.id}
          race={race}
          onViewDetails={() => onViewDetails?.(race)}
        />
      ))}
    </div>
  )
} 