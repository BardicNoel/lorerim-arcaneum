import React from 'react'
import { RaceCardCompact } from './RaceCardCompact'
import type { Race } from '../types'

interface RaceGridProps {
  races: Race[]
  onViewDetails?: (race: Race) => void
}

export function RaceGrid({ races, onViewDetails }: RaceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {races.map((race) => (
        <RaceCardCompact
          key={race.id}
          race={race}
          onViewDetails={() => onViewDetails?.(race)}
        />
      ))}
    </div>
  )
} 