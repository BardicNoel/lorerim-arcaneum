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

  const handleBirthsignSelect = (option: AutocompleteOption) => {
    const selectedBirthsign = birthsigns.find(
      birthsign => birthsign.edid === option.id
    )
    if (selectedBirthsign) {
      onSelect(selectedBirthsign)
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

  // Custom renderer for birthsign options
  const renderBirthsignOption = (
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
  )

  // Mobile drawer content
  const MobileBirthsignDrawer = () => (
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
          <SheetTitle>Select Birth Sign</SheetTitle>
          <SheetDescription>
            Choose your character's birth sign from the options below
          </SheetDescription>
        </SheetHeader>

        {/* Search Input */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search birthsigns..."
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

        {/* Birthsign List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {autocompleteOptions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-muted-foreground">No birthsigns found</p>
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
                  onClick={() => handleBirthsignSelect(option)}
                >
                  <div className="w-full">
                    {renderBirthsignOption(option, false)}
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
  const DesktopBirthsignAutocomplete = () => (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleBirthsignSelect}
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
