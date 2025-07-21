import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleNavigateToRacePage}
            className="text-sm whitespace-nowrap cursor-pointer"
          >
            View all races →
          </Button>
        </div>
      </div>
    )
  }

  // If race is selected, show the race card with integrated autocomplete
  const raceItem = transformRaceToPlayerCreationItem(selectedRace)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Race Card with Integrated Autocomplete Header */}
      <div className="border border-border rounded-lg bg-card">
        {/* Header with Title and Controls */}
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Race</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNavigateToRacePage}
              className="text-sm whitespace-nowrap cursor-pointer"
            >
              View all races →
            </Button>
          </div>
          <RaceAutocomplete
            races={allRaces}
            onSelect={handleRaceSelect}
            placeholder={`Race: Select a race (${selectedRace.name})`}
            className="w-full"
          />
        </div>

        {/* Race Details Accordion */}
        <RaceAccordion
          item={raceItem}
          originalRace={selectedRace}
          isExpanded={isExpanded}
          onToggle={handleToggleExpanded}
          showToggle={false}
          className="border-0 shadow-none"
        />
      </div>
    </div>
  )
}
