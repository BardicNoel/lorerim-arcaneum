import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRaces } from '../hooks/useRaces'
import type { Race } from '../types'
import { transformRaceToPlayerCreationItem } from '../utils/dataTransform'
import { RaceAccordion, RaceAutocomplete } from './'

interface RaceSelectionCardProps {
  className?: string
}

export function RaceSelectionCard({ className }: RaceSelectionCardProps) {
  const { allRaces } = useRaces()
  const { build, setRace } = useCharacterBuild()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)

  // Find the selected race
  const selectedRace = build.race
    ? allRaces.find(race => race.edid === build.race)
    : null

  const handleRaceSelect = (race: Race) => {
    setRace(race.edid)
  }

  const handleRaceRemove = () => {
    setRace(null)
  }

  const handleNavigateToRacePage = () => {
    navigate('/race')
  }

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // If no race is selected, show the autocomplete
  if (!selectedRace) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Race</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose your character's race
          </p>
        </div>

        <RaceAutocomplete
          races={allRaces}
          onSelect={handleRaceSelect}
          placeholder="Search for a race..."
          className="w-full"
        />

        <div className="flex justify-end">
          <button
            onClick={handleNavigateToRacePage}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all races →
          </button>
        </div>
      </div>
    )
  }

  // If race is selected, show the RaceAccordion
  const raceItem = transformRaceToPlayerCreationItem(selectedRace)

  return (
    <RaceAccordion
      item={raceItem}
      originalRace={selectedRace}
      className={className}
      isExpanded={isExpanded}
      onToggle={handleToggleExpanded}
    />
  )
}
