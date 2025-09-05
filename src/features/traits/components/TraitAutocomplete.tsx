import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
  MobileAutocompleteDrawer,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import type { Trait } from '@/shared/data/schemas'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useFuzzySearch } from '../hooks/useFuzzySearch'

interface TraitAutocompleteProps {
  traits: Trait[]
  onSelect: (trait: Trait) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TraitAutocomplete({
  traits,
  onSelect,
  placeholder = 'Search traits...',
  className = '',
  disabled = false,
}: TraitAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { filteredTraits } = useFuzzySearch(traits, searchQuery)

  // Convert filtered traits to AutocompleteOption format
  const autocompleteOptions: AutocompleteOption[] = useMemo(() => {
    return filteredTraits.map(trait => ({
      id: trait.edid || trait.name,
      label: trait.name,
      description: trait.description || '',
      category: trait.category || '',
      badge: trait.category && (
        <Badge variant="outline" className="text-xs">
          {trait.category}
        </Badge>
      ),
      metadata: {
        originalTrait: trait,
        effectsCount: trait.effects?.length || 0,
      },
    }))
  }, [filteredTraits])

  const handleTraitSelect = useCallback((trait: Trait) => {
    onSelect(trait)
    setSearchQuery(trait.name) // Update search query to show selected trait name
  }, [onSelect])

  const handleDesktopTraitSelect = useCallback((option: AutocompleteOption) => {
    const selectedTrait = traits.find(
      trait => (trait.edid || trait.name) === option.id
    )
    if (selectedTrait) {
      onSelect(selectedTrait)
      setSearchQuery(selectedTrait.name)
    }
  }, [traits, onSelect])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Removed the problematic setTimeout focus call that was causing keyboard flashing
  }

  // Custom renderer for trait options
  const renderTraitOption = useMemo(() => (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{option.label}</div>
        <div className="flex items-center gap-2 mt-1">
          {option.badge && <div className="flex-shrink-0">{option.badge}</div>}
          {option.metadata?.effectsCount &&
            option.metadata.effectsCount > 0 && (
              <div className="text-xs text-muted-foreground">
                {option.metadata.effectsCount} effect
                {option.metadata.effectsCount !== 1 ? 's' : ''}
              </div>
            )}
        </div>
        {option.description && (
          <FormattedText
            text={option.description}
            className="text-sm text-muted-foreground mt-1 line-clamp-2"
          />
        )}
      </div>
    </div>
  ), [])

  // Create a store-like object for the drawer
  const traitStore = useMemo(() => ({
    data: traits,
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return traits.filter(trait =>
        trait.name.toLowerCase().includes(lowerQuery) ||
        trait.description?.toLowerCase().includes(lowerQuery)
      )
    }
  }), [traits])

  // Render function for complete trait list items in the drawer - using desktop layout
  const renderTraitListItem = useCallback((trait: Trait, isSelected: boolean, onSelect: () => void) => (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-5 text-left hover:bg-muted/60 rounded-lg"
      onClick={onSelect}
    >
      <div className="flex items-start gap-3 w-full">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{trait.name}</div>
          <div className="flex items-center gap-2 mt-1">
            {trait.category && (
              <Badge
                variant="outline"
                className={cn(
                  'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                  'text-xs font-medium transition-colors'
                )}
              >
                {trait.category}
              </Badge>
            )}
            {trait.effects && trait.effects.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {trait.effects.length} effect{trait.effects.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          {trait.description && (
            <FormattedText
              text={trait.description}
              className="text-sm text-muted-foreground mt-1 line-clamp-2"
            />
          )}
        </div>
      </div>
    </Button>
  ), [])

  // Mobile drawer content
  const MobileTraitDrawer = () => {
    return (
      <MobileAutocompleteDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSelect={handleTraitSelect}
        searchPlaceholder="Search traits..."
        title="Select Trait"
        description="Choose a trait from the options below"
        triggerText={searchQuery}
        triggerPlaceholder={placeholder}
        store={traitStore}
        renderListItem={renderTraitListItem}
        emptyMessage="No traits found"
        className={className}
        disabled={disabled}
      />
    )
  }

  // Desktop autocomplete
  const DesktopTraitAutocomplete = () => (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleDesktopTraitSelect}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      renderOption={renderTraitOption}
      emptyMessage="No traits found"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )

  return isMobile ? <MobileTraitDrawer /> : <DesktopTraitAutocomplete />
}
