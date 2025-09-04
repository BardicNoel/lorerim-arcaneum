import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { shouldShowFavoredRaces } from '@/shared/config/featureFlags'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/ui/sheet'
import { ChevronDown, Search, Star, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import type { Religion } from '../types'
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

  const handleDeitySelect = (option: AutocompleteOption) => {
    onDeitySelect(option.id)
    setIsDrawerOpen(false)
    setSearchQuery('')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Maintain focus on the input
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }

  // Custom renderer for deity options
  const renderDeityOption = (option: AutocompleteOption, isActive: boolean) => (
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
  )

  // Mobile drawer content
  const MobileDeityDrawer = () => (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal',
            !searchQuery && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <span>{searchQuery || placeholder}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] max-h-[85vh] p-0 flex flex-col"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <SheetHeader className="p-4 border-b flex-shrink-0">
          <SheetTitle>Select Religion</SheetTitle>
          <SheetDescription>
            Choose your character's religion from the options below
          </SheetDescription>
        </SheetHeader>

        {/* Search Input */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search religions..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Deity List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {autocompleteOptions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-muted-foreground">No religions found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {autocompleteOptions.map(option => (
                <Button
                  key={option.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-5 text-left hover:bg-muted/60 rounded-lg"
                  onClick={() => handleDeitySelect(option)}
                >
                  <div className="w-full">
                    {renderDeityOption(option, false)}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  // Desktop autocomplete
  const DesktopDeityAutocomplete = () => (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleDeitySelect}
      placeholder={placeholder}
      className={className}
      renderOption={renderDeityOption}
      emptyMessage="No religions found"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )

  return isMobile ? <MobileDeityDrawer /> : <DesktopDeityAutocomplete />
}
