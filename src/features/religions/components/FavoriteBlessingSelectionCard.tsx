import { SelectionCardShell } from '@/shared/components/ui'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { religionToPlayerCreationItem } from '@/shared/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReligionData } from '../hooks/useReligionData'
import { findReligionById } from '../utils/religionFilters'
import { BlessingAutocomplete } from './BlessingAutocomplete'
import { ReligionAccordion } from './ReligionAccordion'

interface FavoriteBlessingSelectionCardProps {
  className?: string
}

export function FavoriteBlessingSelectionCard({
  className,
}: FavoriteBlessingSelectionCardProps) {
  const { build, setFavoriteBlessing } = useCharacterBuild()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(true)
  const { data: religions, loading, error } = useReligionData()

  // Find selected blessing source
  const selectedBlessingSource = build.favoriteBlessing
    ? findReligionById(religions, build.favoriteBlessing)
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
        title="Favorite Blessing"
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
        title="Favorite Blessing"
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

  // If no blessing is selected, show the autocomplete
  if (!selectedBlessingSource) {
    return (
      <SelectionCardShell
        title="Favorite Blessing"
        navigateTo="religions"
        onNavigate={handleNavigateToReligionPage}
        className={className}
      >
        <p className="text-sm text-muted-foreground mb-4">
          Choose your character's favorite blessing (the blessing you expect to
          use most frequently)
        </p>
        <BlessingAutocomplete
          religions={religions}
          selectedBlessingId={build.favoriteBlessing}
          onBlessingSelect={setFavoriteBlessing}
          placeholder="Search for a blessing source..."
          className="w-full"
        />
      </SelectionCardShell>
    )
  }

  // If blessing is selected, show the blessing card with integrated autocomplete
  const blessingItem = religionToPlayerCreationItem(selectedBlessingSource)

  return (
    <SelectionCardShell
      title="Favorite Blessing"
      navigateTo="religions"
      onNavigate={handleNavigateToReligionPage}
      className={className}
    >
      <BlessingAutocomplete
        religions={religions}
        selectedBlessingId={build.favoriteBlessing}
        onBlessingSelect={setFavoriteBlessing}
        placeholder={`Favorite Blessing: Select a blessing source (${selectedBlessingSource.name})`}
        className="w-full"
      />
      <ReligionAccordion
        item={blessingItem}
        originalReligion={selectedBlessingSource}
        isExpanded={isExpanded}
        onToggle={handleToggleExpanded}
        className="border-0 shadow-none"
        disableHover={true}
        showToggle={false}
        showBlessings={true}
        showTenets={false}
        showBoons={false}
        showFavoredRaces={false}
      />
    </SelectionCardShell>
  )
}
