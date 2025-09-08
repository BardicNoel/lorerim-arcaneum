import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
  MobileAutocompleteDrawer,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Star } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import type { Religion } from '../types'
import type { DeityOption } from '../types/selection'
import { getDeityOptions } from '../utils/religionFilters'

interface DeityAutocompleteProps {
  religions: Religion[] | undefined | null
  selectedDeityId: string | null
  onDeitySelect: (deityId: string | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DeityAutocomplete({
  religions,
  selectedDeityId,
  onDeitySelect,
  placeholder = 'Search for a deity to follow...',
  className,
  disabled = false,
}: DeityAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Use fuzzy search with the actual search query
  const { filteredReligions } = useFuzzySearch(religions, searchQuery)
  const filteredDeityOptions = useMemo(() => {
    return getDeityOptions(filteredReligions)
  }, [filteredReligions])

  const getDeityTypeBadge = (type: string) => {
    const typeStyles = {
      Divine: 'bg-blue-100 text-blue-800 border-blue-200',
      'Daedric Prince': 'bg-red-100 text-red-800 border-red-200',
      Tribunal: 'bg-purple-100 text-purple-800 border-purple-200',
      Ancestor: 'bg-green-100 text-green-800 border-green-200',
      'Nordic Deity': 'bg-orange-100 text-orange-800 border-orange-200',
      'Yokudan Deity': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Khajiiti Deity': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Deity: 'bg-gray-100 text-gray-800 border-gray-200',
    }

    return (
      <Badge
        variant="outline"
        className={cn(
          'text-xs font-medium',
          typeStyles[type as keyof typeof typeStyles] || typeStyles['Deity']
        )}
      >
        {type}
      </Badge>
    )
  }

  // Convert deity options to AutocompleteOption format
  const autocompleteOptions: AutocompleteOption[] = useMemo(() => {
    return filteredDeityOptions.map(deity => ({
      id: deity.id,
      label: deity.name,
      description: deity.tenetDescription,
      category: deity.type,
      badge: getDeityTypeBadge(deity.type),
      metadata: {
        originalReligion: deity.originalReligion,
        favoredRaces: deity.favoredRaces,
      },
    }))
  }, [filteredDeityOptions])

  const handleDeitySelect = useCallback((deity: DeityOption) => {
    onDeitySelect(deity.id)
    setSearchQuery(deity.name) // Update search query to show selected deity name
  }, [onDeitySelect])

  const handleDesktopDeitySelect = useCallback((option: AutocompleteOption) => {
    onDeitySelect(option.id)
    setSearchQuery(option.label)
  }, [onDeitySelect])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Removed the problematic setTimeout focus call that was causing keyboard flashing
  }

  // Custom renderer for deity options
  const renderDeityOption = useMemo(() => (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{option.label}</span>
          {option.badge}
        </div>
        {option.description && (
          <FormattedText
            text={option.description}
            className="text-sm text-muted-foreground line-clamp-2 mb-1"
          />
        )}
        {shouldShowFavoredRaces() &&
          option.metadata?.favoredRaces &&
          option.metadata.favoredRaces.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-current" />
              <span>
                Favored races:{' '}
                {option.metadata.favoredRaces.map(race => race.name).join(', ')}
              </span>
            </div>
          )}
      </div>
    </div>
  ), [])

  // Create a store-like object for the drawer
  const deityStore = useMemo(() => ({
    data: filteredDeityOptions,
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return filteredDeityOptions.filter(deity =>
        deity.name.toLowerCase().includes(lowerQuery) ||
        deity.description?.toLowerCase().includes(lowerQuery)
      )
    }
  }), [filteredDeityOptions])

  // Render function for complete deity list items in the drawer - using desktop layout
  const renderDeityListItem = useCallback((deity: DeityOption, isSelected: boolean, onSelect: () => void) => (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-5 text-left hover:bg-muted/60 rounded-lg"
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{deity.name}</span>
            {deity.type && (
              <Badge
                variant="outline"
                className={cn(
                  'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                  'text-xs font-medium transition-colors'
                )}
              >
                {deity.type}
              </Badge>
            )}
          </div>
          {deity.description && (
            <FormattedText
              text={deity.description}
              className="text-sm text-muted-foreground line-clamp-2 mb-1"
            />
          )}
          {shouldShowFavoredRaces() &&
            deity.favoredRaces &&
            deity.favoredRaces.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-current" />
                <span>
                  Favored races:{' '}
                  {deity.favoredRaces.map(race => race.name).join(', ')}
                </span>
              </div>
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
        onSelect={handleDeitySelect}
        searchPlaceholder="Search religions..."
        title="Select Religion"
        description="Choose your character's religion from the options below"
        triggerText={searchQuery}
        triggerPlaceholder={placeholder}
        store={deityStore}
        renderListItem={renderDeityListItem}
        emptyMessage="No religions found"
        className={className}
        disabled={disabled}
      />
    )
  }

  // Render desktop autocomplete
  return (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleDesktopDeitySelect}
      placeholder={placeholder}
      className={className}
      renderOption={renderDeityOption}
      emptyMessage="No religions found"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )
}
