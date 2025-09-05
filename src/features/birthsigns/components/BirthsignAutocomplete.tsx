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
import { useCallback, useMemo, useRef, useState } from 'react'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import type { Birthsign } from '../types'
import { BirthsignAvatar } from './BirthsignAvatar'

interface BirthsignAutocompleteProps {
  birthsigns: Birthsign[]
  onSelect: (birthsign: Birthsign) => void
  placeholder?: string
  className?: string
}

export function BirthsignAutocomplete({
  birthsigns,
  onSelect,
  placeholder = 'Search birthsigns...',
  className = '',
}: BirthsignAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { filteredBirthsigns } = useFuzzySearch(birthsigns, searchQuery)

  // Convert filtered birthsigns to AutocompleteOption format
  const autocompleteOptions: AutocompleteOption[] = useMemo(() => {
    return filteredBirthsigns.map(birthsign => ({
      id: birthsign.edid,
      label: birthsign.name,
      description: birthsign.description,
      category: birthsign.group,
      icon: <BirthsignAvatar birthsignName={birthsign.name} size="md" />,
      badge: birthsign.group && (
        <Badge
          variant="outline"
          className={cn(
            'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
            'text-xs font-medium transition-colors'
          )}
        >
          {birthsign.group}
        </Badge>
      ),
      metadata: {
        originalBirthsign: birthsign,
      },
    }))
  }, [filteredBirthsigns])

  const handleBirthsignSelect = useCallback((birthsign: Birthsign) => {
    onSelect(birthsign)
    setSearchQuery(birthsign.name) // Update search query to show selected birthsign name
  }, [onSelect])

  const handleDesktopBirthsignSelect = useCallback((option: AutocompleteOption) => {
    const selectedBirthsign = birthsigns.find(
      birthsign => birthsign.edid === option.id
    )
    if (selectedBirthsign) {
      onSelect(selectedBirthsign)
      setSearchQuery(selectedBirthsign.name)
    }
  }, [birthsigns, onSelect])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Removed the problematic setTimeout focus call that was causing keyboard flashing
  }

  // Custom renderer for birthsign options
  const renderBirthsignOption = useMemo(() => (
    option: AutocompleteOption,
    isActive: boolean
  ) => (
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
  const birthsignStore = useMemo(() => ({
    data: birthsigns,
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return birthsigns.filter(birthsign =>
        birthsign.name.toLowerCase().includes(lowerQuery) ||
        birthsign.description?.toLowerCase().includes(lowerQuery) ||
        birthsign.group?.toLowerCase().includes(lowerQuery)
      )
    }
  }), [birthsigns])

  // Render function for complete birthsign list items in the drawer - using desktop layout
  const renderBirthsignListItem = useCallback((birthsign: Birthsign, isSelected: boolean, onSelect: () => void) => (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-5 text-left hover:bg-muted/60 rounded-lg"
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 w-full">
        <div className="flex-shrink-0">
          <BirthsignAvatar birthsignName={birthsign.name} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{birthsign.name}</span>
            {birthsign.group && (
              <Badge
                variant="outline"
                className={cn(
                  'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                  'text-xs font-medium transition-colors'
                )}
              >
                {birthsign.group}
              </Badge>
            )}
          </div>
          {birthsign.description && (
            <FormattedText
              text={birthsign.description}
              className="text-sm text-muted-foreground line-clamp-2 mt-1"
            />
          )}
        </div>
      </div>
    </Button>
  ), [])

  // Mobile drawer content
  const MobileBirthsignDrawer = () => {
    return (
      <MobileAutocompleteDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSelect={handleBirthsignSelect}
        searchPlaceholder="Search birthsigns..."
        title="Select Birth Sign"
        description="Choose your character's birth sign from the options below"
        triggerText={searchQuery}
        triggerPlaceholder={placeholder}
        store={birthsignStore}
        renderListItem={renderBirthsignListItem}
        emptyMessage="No birthsigns found"
        className={className}
      />
    )
  }

  // Desktop autocomplete
  const DesktopBirthsignAutocomplete = () => (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleDesktopBirthsignSelect}
      placeholder={placeholder}
      className={className}
      renderOption={renderBirthsignOption}
      emptyMessage="No birthsigns found"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )

  return isMobile ? <MobileBirthsignDrawer /> : <DesktopBirthsignAutocomplete />
}
