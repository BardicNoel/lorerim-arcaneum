import { cn } from '@/lib/utils'
import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'

import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { ChevronDown, Grid3X3, List, X } from 'lucide-react'
import { useState } from 'react'
import { useRaceData, useRaceFilters, useRaceState } from '../adapters'
import { RaceCardSimple, RaceDetailsSheet } from '../components/composition'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import type { Race } from '../types'
import { raceToPlayerCreationItem } from '../utils/raceToPlayerCreationItem'

type SortOption = 'name' | 'category' | 'health' | 'magicka' | 'stamina'

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'category', label: 'Category' },
  { value: 'health', label: 'Health' },
  { value: 'magicka', label: 'Magicka' },
  { value: 'stamina', label: 'Stamina' },
]

const getSortLabel = (sortBy: SortOption) => {
  return sortOptions.find(option => option.value === sortBy)?.label || 'Name'
}

export function RacePageView() {
  const { build } = useCharacterBuild()

  const { races, isLoading, error } = useRaceData()
  const { viewMode, setViewMode } = useRaceState()
  const { filteredRaces } = useRaceFilters({
    races,
  })

  // Sort state
  const [sortBy, setSortBy] = useState<SortOption>('name')

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const allKeywords = [
      ...new Set(
        races.flatMap(race => race.keywords.map(keyword => keyword.edid))
      ),
    ]

    const allSkills = [
      ...new Set(
        races.flatMap(race => race.skillBonuses.map(bonus => bonus.skill))
      ),
    ]

    const raceCategories = [...new Set(races.map(race => race.category))]

    return [
      {
        id: 'keywords',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: allKeywords.map(keyword => ({
          id: `keyword-${keyword}`,
          label: keyword,
          value: keyword,
          category: 'Fuzzy Search',
          description: `Races with ${keyword} keyword`,
        })),
      },
      {
        id: 'skill-bonuses',
        name: 'Skill Bonuses',
        placeholder: 'Search by skill...',
        options: allSkills.map(skill => ({
          id: `skill-${skill}`,
          label: skill,
          value: skill,
          category: 'Skill Bonuses',
          description: `Races with ${skill} bonus`,
        })),
      },
      {
        id: 'categories',
        name: 'Race Categories',
        placeholder: 'Filter by category...',
        options: raceCategories.map(category => ({
          id: `category-${category}`,
          label: category,
          value: category,
          category: 'Race Categories',
          description: `${category} races`,
        })),
      },
    ]
  }

  const searchCategories = generateSearchCategories()

  // --- Custom tag/filter state for fuzzy search ---
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  // Add a tag (from autocomplete or custom input)
  const handleTagSelect = (optionOrTag: SearchOption | string) => {
    let tag: SelectedTag
    if (typeof optionOrTag === 'string') {
      tag = {
        id: `custom-${optionOrTag}`,
        label: optionOrTag,
        value: optionOrTag,
        category: 'Fuzzy Search',
      }
    } else {
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
    }
    // Prevent duplicate tags
    if (
      !selectedTags.some(
        t => t.value === tag.value && t.category === tag.category
      )
    ) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  // Apply all filters to races
  const filteredRacesWithTags = filteredRaces.filter((race: Race) => {
    // If no tags are selected, show all races
    if (selectedTags.length === 0) return true

    // Check each selected tag
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Fuzzy Search':
          // For fuzzy search, we'll handle this separately
          return true

        case 'Race Categories':
          // Filter by race category (Human, Elf, Beast)
          return race.category === tag.value

        case 'Skill Bonuses':
          // Filter by skill bonuses
          return race.skillBonuses.some(bonus => bonus.skill === tag.value)

        case 'Keywords':
          // Filter by keywords
          return race.keywords.some(keyword => keyword.edid === tag.value)

        default:
          return true
      }
    })
  })

  // Apply fuzzy search to the filtered races
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  const { filteredRaces: fuzzyFilteredRaces } = useFuzzySearch(
    filteredRacesWithTags as Race[],
    fuzzySearchQuery
  )

  // Sort the filtered races
  const sortedRaces = fuzzyFilteredRaces.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'category':
        return a.category.localeCompare(b.category)
      case 'health':
        return b.startingStats.health - a.startingStats.health
      case 'magicka':
        return b.startingStats.magicka - a.startingStats.magicka
      case 'stamina':
        return b.startingStats.stamina - a.startingStats.stamina
      default:
        return 0
    }
  })

  // Convert to PlayerCreationItem format, but include originalRace for details
  const displayItems = sortedRaces.map(race => {
    const item = raceToPlayerCreationItem(race)
    return { ...item, originalRace: race }
  })

  // Handle sheet state
  const [selectedRace, setSelectedRace] = useState<Race | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleRaceClick = (race: Race) => {
    setSelectedRace(race)
    setIsSheetOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading races...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <BuildPageShell
      title="Races"
      description="Choose your character's race. Each race has unique abilities, starting attributes, and racial traits that will shape your journey through Tamriel."
    >
      {/* 1. Search Bar Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
          />
        </div>
      </div>

      {/* 2. View Controls Section */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>

        {/* Right: Sort Options */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                Sort: {getSortLabel(sortBy)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 3. Selected Tags Section */}
      <div className="my-4">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Clear All Button */}
            <button
              onClick={() => setSelectedTags([])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
              title="Clear all filters"
            >
              <X className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
              Clear All
            </button>

            {/* Individual Tags */}
            {selectedTags.map(tag => (
              <span
                key={tag.id}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
                onClick={() => handleTagRemove(tag.id)}
                title="Click to remove"
              >
                {tag.label}
                <span className="ml-2 text-skyrim-gold/70 group-hover:text-skyrim-gold transition-colors duration-200">
                  ×
                </span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. Content Area */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-6">
          {displayItems.map(item => {
            const isSelected = build.race === item.originalRace?.edid

            return (
              <RaceCardSimple
                key={item.id}
                item={item}
                originalRace={item.originalRace}
                onClick={() => handleRaceClick(item.originalRace)}
                className={cn(
                  isSelected &&
                    'bg-skyrim-gold/20 border-2 border-skyrim-gold/30 shadow-sm'
                )}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full mt-6">
          {displayItems.map(item => {
            const isSelected = build.race === item.originalRace?.edid

            return (
              <RaceCardSimple
                key={item.id}
                item={item}
                originalRace={item.originalRace}
                onClick={() => handleRaceClick(item.originalRace)}
                className={cn(
                  isSelected &&
                    'bg-skyrim-gold/20 border-2 border-skyrim-gold/30 shadow-sm'
                )}
              />
            )
          })}
        </div>
      )}

      {displayItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No races found matching your criteria.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}

      {/* Race Details Sheet */}
      <RaceDetailsSheet
        race={selectedRace}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </BuildPageShell>
  )
}
