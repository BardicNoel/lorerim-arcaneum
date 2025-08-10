import { SelectionCardShell } from '@/shared/components/ui'
import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { religionToPlayerCreationItem } from '@/shared/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReligionData } from '../hooks/useReligionData'
import { findReligionById } from '../utils/religionFilters'
import { DeityAutocomplete } from './DeityAutocomplete'
import { ReligionAccordion } from './ReligionAccordion'

interface ReligionSelectionCardProps {
  className?: string
}

export function ReligionSelectionCard({
  className,
}: ReligionSelectionCardProps) {
  const { religions, loading, error } = useReligionData()
  const { build, setReligion } = useCharacterBuild()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)

  // Find selected deity
  const selectedDeity = build.religion
    ? findReligionById(religions, build.religion)
    : null

  const handleNavigateToReligionPage = () => {
    navigate('/build/religions')
  }

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  if (loading) {
    return (
      <SelectionCardShell
        title="Religion"
        navigateTo="religions"
        onNavigate={handleNavigateToReligionPage}
        className={className}
      >
        <div className="text-sm text-muted-foreground">
          Loading religions...
        </div>
      </SelectionCardShell>
    )
  }

  if (error) {
    return (
      <SelectionCardShell
        title="Religion"
        navigateTo="religions"
        onNavigate={handleNavigateToReligionPage}
        className={className}
      >
        <div className="text-sm text-destructive">
          Error loading religions: {error}
        </div>
      </SelectionCardShell>
    )
  }

  // If no deity is selected, show the autocomplete
  if (!selectedDeity) {
    return (
      <SelectionCardShell
        title="Religion"
        navigateTo="religions"
        onNavigate={handleNavigateToReligionPage}
        className={className}
      >
        <p className="text-sm text-muted-foreground mb-4">
          Choose your character's religion
        </p>
        <DeityAutocomplete
          religions={religions}
          selectedDeityId={build.religion}
          onDeitySelect={setReligion}
          placeholder="Search for a religion..."
          className="w-full"
        />
      </SelectionCardShell>
    )
  }

  // If deity is selected, show the religion card with integrated autocomplete
  const religionItem = religionToPlayerCreationItem(selectedDeity)

  return (
    <SelectionCardShell
      title="Religion"
      navigateTo="religions"
      onNavigate={handleNavigateToReligionPage}
      className={className}
    >
      <DeityAutocomplete
        religions={religions}
        selectedDeityId={build.religion}
        onDeitySelect={setReligion}
        placeholder={`Religion: Select a religion (${selectedDeity.name})`}
        className="w-full"
      />
      <ReligionAccordion
        item={religionItem}
        originalReligion={selectedDeity}
        isExpanded={isExpanded}
        onToggle={handleToggleExpanded}
        className="border-0 shadow-none"
        disableHover={true}
        showToggle={false}
        showBlessings={false}
        showTenets={true}
        showBoons={true}
        showFavoredRaces={shouldShowFavoredRaces()}
      />
    </SelectionCardShell>
  )
}
