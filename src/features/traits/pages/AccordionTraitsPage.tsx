import { BuildPageShell } from '@/shared/components/playerCreation'
import type {
  PlayerCreationItem,
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { ChevronDown, Grid3X3, List, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TraitAccordion } from '../components/TraitAccordion'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import { useFuzzySearch } from '../hooks'
import type { Trait } from '../types'
import { getAllCategories, getAllTags } from '../utils'
import { traitToPlayerCreationItem } from '@/shared/utils'

type SortOption = 'alphabetical' | 'category' | 'effect-count'
type ViewMode = 'list' | 'grid'

export function AccordionTraitsPage() {
  const [traits, setTraits] = useState<Trait[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [expandedTraits, setExpandedTraits] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchTraits() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/traits.json`)
        if (!res.ok) throw new Error('Failed to fetch trait data')
        const data = await res.json()
        setTraits(data.traits as Trait[])
      } catch (err) {
        setError('Failed to load trait data')
        console.error('Error loading traits:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTraits()
  }, [])

  // Convert traits to PlayerCreationItem format using the proper transformation
  const traitItems: (PlayerCreationItem & { originalTrait: Trait })[] =
    traits.map(traitToPlayerCreationItem)

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
  const filteredTraits = traits.filter(trait => {
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
          return trait.tags.some(traitTag => traitTag === tag.value)

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

  const { filteredTraits: fuzzyFilteredTraits } = useFuzzySearch(
    filteredTraits,
    fuzzySearchQuery
  )

  // Convert to PlayerCreationItem format
  const displayItems: (PlayerCreationItem & { originalTrait: Trait })[] =
    fuzzyFilteredTraits.map(traitToPlayerCreationItem)

  // Get all valid trait IDs for cleanup
  const allValidTraitIds = traits.map(trait => trait.edid)

  // Sort the display items
  const sortedDisplayItems = [...displayItems].sort((a, b) => {
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

  // Handle accordion expansion
  const handleTraitToggle = (traitId: string) => {
    const newExpanded = new Set(expandedTraits)

    if (viewMode === 'grid') {
      // In grid mode, expand/collapse all items in the same row
      const columns = 3 // Match the grid columns
      const itemIndex = sortedDisplayItems.findIndex(
        item => item.id === traitId
      )
      const rowIndex = Math.floor(itemIndex / columns)
      const rowStartIndex = rowIndex * columns
      const rowEndIndex = Math.min(
        rowStartIndex + columns,
        sortedDisplayItems.length
      )

      // Check if any item in the row is currently expanded
      const isRowExpanded = sortedDisplayItems
        .slice(rowStartIndex, rowEndIndex)
        .some(item => newExpanded.has(item.id))

      if (isRowExpanded) {
        // Collapse all items in the row
        sortedDisplayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.delete(item.id)
        })
      } else {
        // Expand all items in the row
        sortedDisplayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.add(item.id)
        })
      }
    } else {
      // In list mode, toggle individual items
      if (newExpanded.has(traitId)) {
        newExpanded.delete(traitId)
      } else {
        newExpanded.add(traitId)
      }
    }

    setExpandedTraits(newExpanded)
  }

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
      title="Traits"
      description="Choose your character's traits. Traits provide unique abilities and modifiers that will shape your character's capabilities throughout their journey."
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

        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              {sortBy === 'alphabetical'
                ? 'A-Z'
                : sortBy === 'category'
                  ? 'Category'
                  : 'Count'}
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

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
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

      {/* Trait Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-6">
          {sortedDisplayItems.map(item => {
            const isExpanded = expandedTraits.has(item.id)
            return (
              <TraitAccordion
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                onToggle={() => handleTraitToggle(item.id)}
                className="w-full"
                allTraitIds={allValidTraitIds}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full mt-6">
          {sortedDisplayItems.map(item => {
            const isExpanded = expandedTraits.has(item.id)
            return (
              <TraitAccordion
                key={item.id}
                item={item}
                isExpanded={isExpanded}
                onToggle={() => handleTraitToggle(item.id)}
                className="w-full"
                allTraitIds={allValidTraitIds}
              />
            )
          })}
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
