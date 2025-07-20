import {
  EntitySelectionCard,
  type EntityOption,
} from '@/shared/components/playerCreation'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRaces } from '../hooks/useRaces'
import { transformRaceToPlayerCreationItem } from '../utils/dataTransform'
import { RaceAccordion } from './RaceAccordion'
import { RaceAvatar } from './RaceAvatar'

interface RaceSelectionCardProps {
  className?: string
}

export function RaceSelectionCard({ className }: RaceSelectionCardProps) {
  const { allRaces } = useRaces()
  const { build, setRace } = useCharacterBuild()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)

  // Convert races to EntityOption format
  const availableRaces: EntityOption[] = allRaces.map(race => ({
    id: race.edid,
    name: race.name,
    description: race.description,
    category: race.category,
    tags: race.keywords.map(k => k.edid),
  }))

  // Find the selected race
  const selectedRace = build.race
    ? allRaces.find(race => race.edid === build.race)
    : null

  const handleRaceSelect = (raceId: string) => {
    setRace(raceId)
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

  const renderRaceDisplay = (entity: EntityOption) => (
    <div className="flex items-center gap-3">
      <RaceAvatar raceName={entity.name} size="sm" />
      <div className="flex-1">
        <div className="font-medium">{entity.name}</div>
        {entity.category && (
          <div className="text-xs text-muted-foreground">{entity.category}</div>
        )}
      </div>
    </div>
  )

  // If no race is selected, show the selector
  if (!selectedRace) {
    return (
      <EntitySelectionCard
        title="Race"
        description="Choose your character's race"
        selectedEntities={[]}
        availableEntities={availableRaces}
        onEntitySelect={handleRaceSelect}
        onEntityRemove={handleRaceRemove}
        onNavigateToPage={handleNavigateToRacePage}
        selectionType="single"
        placeholder="Select a race..."
        className={className}
        renderEntityDisplay={renderRaceDisplay}
      />
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
