import { SelectionCardShell } from '@/shared/components/ui'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Race } from '../../types'
import { raceToPlayerCreationItem } from '../../utils/raceToPlayerCreationItem'
import { RaceAccordion } from './RaceAccordion'
import { RaceAutocomplete } from './RaceAutocomplete'

interface RaceSelectionCardProps {
  className?: string
  allRaces: Race[]
}

export function RaceSelectionCard({
  className,
  allRaces,
}: RaceSelectionCardProps) {
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
      <SelectionCardShell
        title="Race"
        navigateTo="races"
        onNavigate={handleNavigateToRacePage}
        className={className}
      >
        <p className="text-sm text-muted-foreground mb-4">
          Choose your character's race
        </p>
        <RaceAutocomplete
          races={allRaces}
          onSelect={handleRaceSelect}
          placeholder="Search for a race..."
          className="w-full"
        />
      </SelectionCardShell>
    )
  }

  // If race is selected, show the race card with integrated autocomplete
  const raceItem = raceToPlayerCreationItem(selectedRace)

  return (
    <SelectionCardShell
      title="Race"
      navigateTo="races"
      onNavigate={handleNavigateToRacePage}
      className={className}
    >
      <RaceAutocomplete
        races={allRaces}
        onSelect={handleRaceSelect}
        placeholder={`Race: Select a race (${selectedRace.name})`}
        className="w-full"
      />
      <RaceAccordion
        item={raceItem}
        isExpanded={isExpanded}
        onToggle={handleToggleExpanded}
        showToggle={false}
        className="border-0 shadow-none"
        disableHover={true}
      />
    </SelectionCardShell>
  )
}
