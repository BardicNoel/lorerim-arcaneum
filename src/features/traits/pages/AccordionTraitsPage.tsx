import { BuildPageShell } from '@/shared/components/playerCreation'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  PlayerCreationItem,
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import type { Trait } from '@/shared/data/schemas'
import { useTraits } from '@/shared/stores/useDataStores'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { traitToPlayerCreationItem } from '@/shared/utils'
import { ChevronDown, Grid3X3, List, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { TraitAccordion } from '../components/TraitAccordion'
import { useFuzzySearch } from '../hooks'
import { getAllCategories, getAllTags } from '../utils'

type SortOption = 'alphabetical' | 'category' | 'effect-count'
type ViewMode = 'grid' | 'list'

const getSortLabel = (sortBy: SortOption) => {
  switch (sortBy) {
    case 'alphabetical':
      return 'A-Z'
    case 'category':
      return 'Category'
    case 'effect-count':
      return 'Effect Count'
    default:
      return 'A-Z'
  }
}

export function AccordionTraitsPage() {
  // Use the shared data store hook
  const { data: traitsData, loading, error } = useTraits()
  const traits = traitsData || []

  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Memoize the trait items to prevent unnecessary re-renders
  const traitItems = useMemo(
    () => traits.map(traitToPlayerCreationItem),
    [traits]
  )

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const categories = getAllCategories(traits)
    const tags = getAllTags(traits)

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: [], // Fuzzy search doesn't need predefined options
      },
      {
        id: 'categories',
        name: 'Categories',
        placeholder: 'Search by category...',
        options: categories.map(category => ({
          id: `category-${category}`,
          label: category,
          value: category,
          category: 'Categories',
          description: `Traits in ${category} category`,
        })),
      },
      {
        id: 'tags',
        name: 'Tags',
        placeholder: 'Search by tag...',
        options: tags.map(tag => ({
          id: `tag-${tag}`,
          label: tag,
          value: tag,
          category: 'Tags',
          description: `Traits tagged with ${tag}`,
        })),
      },
    ]
  }

  const searchCategories = generateSearchCategories()

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

  // Apply all filters to traits
  const filteredTraits = traits.filter((trait: Trait) => {
    // If no tags are selected, show all traits
    if (selectedTags.length === 0) return true

    // Check each selected tag
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Fuzzy Search':
          // For fuzzy search, we'll handle this separately
          return true

        case 'Categories':
          // Filter by category
          return trait.category === tag.value

        case 'Tags':
          // Filter by tags
          return (
            trait.tags?.some((traitTag: string) => traitTag === tag.value) ||
            false
          )

        default:
          return true
      }
    })
  })

  // Apply fuzzy search to the filtered traits
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  const { filteredTraits: fuzzyFilteredTraits, searchResults } = useFuzzySearch(
    filteredTraits,
    fuzzySearchQuery
  )

  // Determine which traits to display
  const hasFuzzySearchTags = selectedTags.some(tag => tag.category === 'Fuzzy Search')
  const traitsToDisplay = hasFuzzySearchTags ? fuzzyFilteredTraits : filteredTraits

  // Convert to PlayerCreationItem format
  const displayItems: (PlayerCreationItem & { originalTrait: Trait })[] =
    traitsToDisplay.map(traitToPlayerCreationItem)

  // Get all valid trait IDs for cleanup (use id or name as fallback)
  const allValidTraitIds = traits.map((trait: Trait) => trait.id || trait.name)

  // Sort the display items
  const sortedDisplayItems = [...displayItems].sort((a, b) => {
    // If fuzzy search is active, respect the search ranking
    if (hasFuzzySearchTags && searchResults.length > 0) {
      const aResult = searchResults.find(result => result.item.originalTrait.id === a.id || result.item.originalTrait.name === a.name)
      const bResult = searchResults.find(result => result.item.originalTrait.id === b.id || result.item.originalTrait.name === b.name)
      
      // If both items have search results, sort by score (lower score = better match)
      if (aResult && bResult) {
        return (aResult.score ?? 1) - (bResult.score ?? 1)
      }
      
      // If only one has search results, prioritize the one with results
      if (aResult && !bResult) return -1
      if (!aResult && bResult) return 1
      
      // If neither has search results, fall back to alphabetical
      return a.name.localeCompare(b.name)
    }

    // Otherwise, use the normal sort logic
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name)
      case 'category':
        // Define priority order for categories
        const getCategoryPriority = (category: string | undefined) => {
          switch (category) {
            case 'Combat':
              return 1
            case 'Magic':
              return 2
            case 'Stealth':
              return 3
            case 'Social':
              return 4
            case 'Survival':
              return 5
            default:
              return 6
          }
        }

        const aPriority = getCategoryPriority(a.category)
        const bPriority = getCategoryPriority(b.category)

        // First sort by priority, then alphabetically within each category
        if (aPriority !== bPriority) return aPriority - bPriority
        return a.name.localeCompare(b.name)

      case 'effect-count':
        // Sort by number of effects (descending)
        const aEffectCount = a.effects?.length || 0
        const bEffectCount = b.effects?.length || 0
        if (aEffectCount !== bEffectCount) return bEffectCount - aEffectCount
        return a.name.localeCompare(b.name)

      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading traits...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <p className="text-muted-foreground">Please refresh the page to try again.</p>
        </div>
      </div>
    )
  }

  return (
    <BuildPageShell
      title="Traits"
      description="Choose your character's traits. Traits provide unique abilities and modifiers that will shape your character's capabilities throughout their journey."
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
              <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                Alphabetical
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('category')}>
                Category
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('effect-count')}>
                Effect Count
              </DropdownMenuItem>
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
          {sortedDisplayItems.map(item => (
            <TraitAccordion
              key={item.id}
              item={item}
              className="w-full"
              allTraitIds={allValidTraitIds}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full mt-6">
          {sortedDisplayItems.map(item => (
            <TraitAccordion
              key={item.id}
              item={item}
              className="w-full"
              allTraitIds={allValidTraitIds}
            />
          ))}
        </div>
      )}

      {sortedDisplayItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No traits found matching your criteria.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </BuildPageShell>
  )
}
