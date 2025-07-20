import { PlayerCreationLayout } from '@/shared/components/playerCreation'
import type {
  PlayerCreationItem,
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { AccordionGrid } from '@/shared/components/ui'
import { Button } from '@/shared/ui/ui/button'
import { Grid3X3, List, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CustomMultiAutocompleteSearch } from '../components/CustomMultiAutocompleteSearch'
import { RaceAccordion } from '../components/RaceAccordion'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import type { Race } from '../types'
import { transformRaceToPlayerCreationItem } from '../utils/dataTransform'

type ViewMode = 'list' | 'grid'

export function AccordionRacesPage() {
  // Load race data from public/data/playable-races.json at runtime
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedRaces, setExpandedRaces] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  useEffect(() => {
    async function fetchRaces() {
      try {
        setLoading(true)
        const res = await fetch(
          `${import.meta.env.BASE_URL}data/playable-races.json`
        )
        if (!res.ok) throw new Error('Failed to fetch race data')
        const data = await res.json()
        setRaces(data.races as Race[])
      } catch (err) {
        setError('Failed to load race data')
        console.error('Error loading races:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchRaces()
  }, [])

  // Convert races to PlayerCreationItem format using new transformation
  const playerCreationItems: PlayerCreationItem[] = races.map(race =>
    transformRaceToPlayerCreationItem(race)
  )

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

    const categories = [...new Set(races.map(race => race.category))]

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
        options: categories.map(category => ({
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
  const filteredRaces = races.filter(race => {
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
    filteredRaces,
    fuzzySearchQuery
  )

  // Convert to PlayerCreationItem format
  const displayItems: PlayerCreationItem[] = fuzzyFilteredRaces.map(race =>
    transformRaceToPlayerCreationItem(race)
  )

  // Handle accordion expansion
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

  if (loading) {
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
    <PlayerCreationLayout
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
            const originalRace = races.find(
              race => race.edid.toLowerCase().replace('race', '') === item.id
            )
            const isExpanded = expandedRaces.has(item.id)

            return (
              <RaceAccordion
                key={item.id}
                item={item}
                originalRace={originalRace}
                isExpanded={isExpanded}
                onToggle={() => handleRaceToggle(item.id)}
                className="w-full"
              />
            )
          })}
        </AccordionGrid>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {displayItems.map(item => {
            const originalRace = races.find(
              race => race.edid.toLowerCase().replace('race', '') === item.id
            )
            const isExpanded = expandedRaces.has(item.id)

            return (
              <RaceAccordion
                key={item.id}
                item={item}
                originalRace={originalRace}
                isExpanded={isExpanded}
                onToggle={() => handleRaceToggle(item.id)}
                className="w-full"
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
    </PlayerCreationLayout>
  )
}
