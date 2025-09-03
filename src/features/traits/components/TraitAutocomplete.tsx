import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import type { Trait } from '@/shared/data/schemas'
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

  const handleTraitSelect = (option: AutocompleteOption) => {
    const selectedTrait = traits.find(
      trait => (trait.edid || trait.name) === option.id
    )
    if (selectedTrait) {
      onSelect(selectedTrait)
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

  // Custom renderer for trait options
  const renderTraitOption = (option: AutocompleteOption, isActive: boolean) => (
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
  )

  // Mobile drawer content
  const MobileTraitDrawer = () => (
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
          <SheetTitle>Select Trait</SheetTitle>
          <SheetDescription>
            Choose a trait from the options below
          </SheetDescription>
        </SheetHeader>

        {/* Search Input */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search traits..."
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

        {/* Trait List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {autocompleteOptions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-muted-foreground">No traits found</p>
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
                  onClick={() => handleTraitSelect(option)}
                >
                  <div className="w-full">
                    {renderTraitOption(option, false)}
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
  const DesktopTraitAutocomplete = () => (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleTraitSelect}
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
