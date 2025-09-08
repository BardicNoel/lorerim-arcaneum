import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
  MobileAutocompleteDrawer,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import React, { useCallback, useMemo, useRef, useState } from 'react'
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const searchInputRef = useRef<HTMLInputElement>(null)


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

  const handleRaceSelect = useCallback((race: Race) => {
    onSelect(race)
    setSearchQuery(race.name) // Update search query to show selected race name
  }, [onSelect])

  const handleDesktopRaceSelect = useCallback((option: AutocompleteOption) => {
    const selectedRace = races.find(race => race.edid === option.id)
    if (selectedRace) {
      onSelect(selectedRace)
      setSearchQuery(selectedRace.name)
    }
  }, [races, onSelect])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Removed the problematic setTimeout focus call that was causing keyboard flashing
  }

  // Custom renderer for race options
  const renderRaceOption = useMemo(() => (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-center gap-3">
      {option.icon && <div className="flex-shrink-0">{option.icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{option.label}</span>
          {option.badge && <div className="flex-shrink-0">{option.badge}</div>}
        </div>
        {option.description && (
          <FormattedText
            text={option.description}
            className="text-sm text-muted-foreground line-clamp-2 mt-1"
          />
        )}
      </div>
    </div>
  ), [])

  // Create a store-like object for the drawer
  const raceStore = useMemo(() => ({
    data: races,
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return races.filter(race =>
        race.name.toLowerCase().includes(lowerQuery) ||
        race.description?.toLowerCase().includes(lowerQuery) ||
        race.tags?.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(lowerQuery))
      )
    }
  }), [races])

  // Render function for complete race list items in the drawer - using desktop layout
  const renderRaceListItem = useCallback((race: Race, isSelected: boolean, onSelect: () => void) => (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-5 text-left hover:bg-muted/60 rounded-lg"
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex-shrink-0">
          <RaceAvatar raceName={race.name} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{race.name}</span>
            {race.category && (
              <Badge
                variant="outline"
                className={cn(
                  'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                  'text-xs font-medium transition-colors'
                )}
              >
                {race.category}
              </Badge>
            )}
          </div>
          {race.description && (
            <FormattedText
              text={race.description}
              className="text-sm text-muted-foreground line-clamp-2 mt-1"
            />
          )}
        </div>
      </div>
    </Button>
  ), [])

  // Render mobile drawer
  if (isMobile) {
    return (
      <MobileAutocompleteDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSelect={handleRaceSelect}
        searchPlaceholder="Search races..."
        title="Select Race"
        description="Choose your character's race from the options below"
        triggerText={searchQuery}
        triggerPlaceholder={placeholder}
        store={raceStore}
        renderListItem={renderRaceListItem}
        emptyMessage="No races found"
        className={className}
      />
    )
  }

  // Render desktop autocomplete
  return (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleDesktopRaceSelect}
      placeholder={placeholder}
      className={className}
      renderOption={renderRaceOption}
      emptyMessage="No races found"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )
}
