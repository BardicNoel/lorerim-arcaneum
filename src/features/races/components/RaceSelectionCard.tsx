import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRaces } from '../hooks/useRaces'
import type { Race } from '../types'
import { transformRaceToPlayerCreationItem } from '../utils/dataTransform'
import { RaceAccordion, RaceAutocomplete } from './'
import { Card, CardHeader, CardContent, CardTitle } from '@/shared/ui/ui/card'

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
      <Card className={className}>
        <CardHeader className="pb-3">
          <div>
            <CardTitle className="text-lg">Race</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Choose your character's race
          </p>
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
        </CardContent>
      </Card>
    )
  }

  // If race is selected, show the race card with integrated autocomplete
  const raceItem = transformRaceToPlayerCreationItem(selectedRace)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <CardTitle className="text-lg">Race</CardTitle>
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
      </CardHeader>
      <CardContent className="space-y-4">
        <RaceAccordion
          item={raceItem}
          originalRace={selectedRace}
          isExpanded={isExpanded}
          onToggle={handleToggleExpanded}
          showToggle={false}
          className="border-0 shadow-none"
        />
      </CardContent>
    </Card>
  )
}
