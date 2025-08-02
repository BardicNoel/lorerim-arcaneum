import { cn } from '@/lib/utils'
import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { AccordionGrid } from '@/shared/components/ui'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List, X } from 'lucide-react'
import { useState } from 'react'
import { useRaceData, useRaceFilters, useRaceState } from '../adapters'
import { RaceAccordion } from '../components/composition/RaceAccordion'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import type { Race } from '../types'
import { raceToPlayerCreationItem } from '../utils/raceToPlayerCreationItem'

export function RacePageView() {
  const { build } = useCharacterBuild()

  const { races, isLoading, error } = useRaceData()
  const { viewMode, setViewMode } = useRaceState()
  const { filteredRaces } = useRaceFilters({
    races,
  })

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

  // Convert to PlayerCreationItem format, but include originalRace for details
  const displayItems = fuzzyFilteredRaces.map(race => {
    const item = raceToPlayerCreationItem(race)
    return { ...item, originalRace: race }
  })

  // Handle accordion expansion
  const [expandedRaces, setExpandedRaces] = useState<Set<string>>(new Set())

  const handleRaceToggle = (raceId: string) => {
    const newExpanded = new Set(expandedRaces)

    if (viewMode === 'grid') {
      // In grid mode, expand/collapse all items in the same row
      const columns = 3 // Match the AccordionGrid columns prop
      const itemIndex = displayItems.findIndex(item => item.id === raceId)
      const rowIndex = Math.floor(itemIndex / columns)
      const rowStartIndex = rowIndex * columns
      const rowEndIndex = Math.min(rowStartIndex + columns, displayItems.length)

      // Check if any item in the row is currently expanded
      const isRowExpanded = displayItems
        .slice(rowStartIndex, rowEndIndex)
        .some(item => newExpanded.has(item.id))

      if (isRowExpanded) {
        // Collapse all items in the row
        displayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.delete(item.id)
        })
      } else {
        // Expand all items in the row
        displayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.add(item.id)
        })
      }
    } else {
      // In list mode, toggle individual items
      if (newExpanded.has(raceId)) {
        newExpanded.delete(raceId)
      } else {
        newExpanded.add(raceId)
      }
    }

    setExpandedRaces(newExpanded)
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
      {/* Custom MultiAutocompleteSearch with FuzzySearchBox for keywords */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex border rounded-lg p-1 bg-muted">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 px-3"
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 px-3"
            title="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selected Tags */}
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

      {viewMode === 'grid' ? (
        <AccordionGrid columns={3} gap="md" className="w-full">
          {displayItems.map(item => {
            const isExpanded = expandedRaces.has(item.id)
            const isSelected = build.race === item.originalRace?.edid

            return (
              <RaceAccordion
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                onToggle={() => handleRaceToggle(item.id)}
                className={cn(
                  'w-full',
                  isSelected &&
                    'bg-skyrim-gold/20 border-2 border-skyrim-gold/30 shadow-sm'
                )}
              />
            )
          })}
        </AccordionGrid>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {displayItems.map(item => {
            const isExpanded = expandedRaces.has(item.id)
            const isSelected = build.race === item.originalRace?.edid

            return (
              <RaceAccordion
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                onToggle={() => handleRaceToggle(item.id)}
                className={cn(
                  'w-full',
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
    </BuildPageShell>
  )
}
