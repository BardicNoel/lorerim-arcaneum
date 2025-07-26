import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
} from '@/shared/components/generic'
import { Badge } from '@/shared/ui/ui/badge'
import { useMemo, useState } from 'react'
import { useFuzzySearch } from '../../hooks/useFuzzySearch'
import type { Race } from '../../types'
import { RaceAvatar } from '../atomic'

interface RaceAutocompleteProps {
  races: Race[]
  onSelect: (race: Race) => void
  placeholder?: string
  className?: string
}

export function RaceAutocomplete({
  races,
  onSelect,
  placeholder = 'Search races...',
  className = '',
}: RaceAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { filteredRaces } = useFuzzySearch(races, searchQuery)

  // Convert filtered races to AutocompleteOption format
  const autocompleteOptions: AutocompleteOption[] = useMemo(() => {
    return filteredRaces.map(race => ({
      id: race.edid,
      label: race.name,
      description: race.description,
      category: race.category,
      icon: <RaceAvatar raceName={race.name} size="sm" />,
      badge: race.category && (
        <Badge
          variant="outline"
          className={cn(
            'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
            'text-xs font-medium transition-colors'
          )}
        >
          {race.category}
        </Badge>
      ),
      metadata: {
        originalRace: race,
      },
    }))
  }, [filteredRaces])

  const handleRaceSelect = (option: AutocompleteOption) => {
    const selectedRace = races.find(race => race.edid === option.id)
    if (selectedRace) {
      onSelect(selectedRace)
    }
  }

  // Custom renderer for race options
  const renderRaceOption = (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-center gap-3">
      {option.icon && <div className="flex-shrink-0">{option.icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{option.label}</span>
          {option.badge && <div className="flex-shrink-0">{option.badge}</div>}
        </div>
        {option.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {option.description}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleRaceSelect}
      placeholder={placeholder}
      className={className}
      renderOption={renderRaceOption}
      emptyMessage="No races found"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )
}
