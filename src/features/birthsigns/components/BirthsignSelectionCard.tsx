import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { SelectionCardShell } from '@/shared/components/ui'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBirthsignData } from '../hooks/useBirthsignData'
import type { Birthsign } from '../types'
import { birthsignToPlayerCreationItem } from '@/shared/utils'
import { BirthsignAccordion, BirthsignAutocomplete } from './'

interface BirthsignSelectionCardProps {
  className?: string
}

export function BirthsignSelectionCard({
  className,
}: BirthsignSelectionCardProps) {
  const { birthsigns, loading, error } = useBirthsignData()
  const { build, setStone } = useCharacterBuild()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)

  // Find the selected birthsign
  const selectedBirthsign = build.stone
    ? birthsigns.find(birthsign => birthsign.edid === build.stone)
    : null

  const handleBirthsignSelect = (birthsign: Birthsign) => {
    setStone(birthsign.edid)
  }

  const handleBirthsignRemove = () => {
    setStone(null)
  }

  const handleNavigateToBirthsignPage = () => {
    navigate('/birth-signs')
  }

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // If no birthsign is selected, show the autocomplete
  if (!selectedBirthsign) {
    return (
      <SelectionCardShell
        title="Birth Sign"
        navigateTo="birthsigns"
        onNavigate={handleNavigateToBirthsignPage}
        className={className}
      >
        <p className="text-sm text-muted-foreground mb-4">
          Choose your character's birthsign
        </p>
        <BirthsignAutocomplete
          birthsigns={birthsigns}
          onSelect={handleBirthsignSelect}
          placeholder="Search for a birthsign..."
          className="w-full"
        />
      </SelectionCardShell>
    )
  }

  // If birthsign is selected, show the birthsign card with integrated autocomplete
  const birthsignItem = birthsignToPlayerCreationItem(selectedBirthsign)

  return (
    <SelectionCardShell
      title="Birth Sign"
      navigateTo="birthsigns"
      onNavigate={handleNavigateToBirthsignPage}
      className={className}
    >
      <BirthsignAutocomplete
        birthsigns={birthsigns}
        onSelect={handleBirthsignSelect}
        placeholder={`Birth Sign: Select a birthsign (${selectedBirthsign.name})`}
        className="w-full"
      />
      <BirthsignAccordion
        item={birthsignItem}
        isExpanded={isExpanded}
        onToggle={handleToggleExpanded}
        className="border-0 shadow-none"
        showAddToBuild={false}
        disableHover={true}
      />
    </SelectionCardShell>
  )
}
