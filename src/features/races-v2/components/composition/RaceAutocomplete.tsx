import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
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
import { ChevronDown, Search, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
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

  const handleRaceSelect = (option: AutocompleteOption) => {
    const selectedRace = races.find(race => race.edid === option.id)
    if (selectedRace) {
      onSelect(selectedRace)
      setIsDrawerOpen(false)
      setSearchQuery('')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Maintain focus on the input
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
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
          <FormattedText
            text={option.description}
            className="text-sm text-muted-foreground line-clamp-2 mt-1"
          />
        )}
      </div>
    </div>
  )

  // Mobile drawer content
  const MobileRaceDrawer = () => (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal',
            !searchQuery && 'text-muted-foreground',
            className
          )}
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
          <SheetTitle>Select Race</SheetTitle>
          <SheetDescription>
            Choose your character's race from the options below
          </SheetDescription>
        </SheetHeader>

        {/* Search Input */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search races..."
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

        {/* Race List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {autocompleteOptions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-muted-foreground">No races found</p>
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
                  onClick={() => handleRaceSelect(option)}
                >
                  <div className="w-full">
                    {renderRaceOption(option, false)}
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
  const DesktopRaceAutocomplete = () => (
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

  return isMobile ? <MobileRaceDrawer /> : <DesktopRaceAutocomplete />
}
