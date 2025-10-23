import { BackToTopButton, ViewModeToggle } from '@/shared/components/generic'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type {
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { Button } from '@/shared/ui/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { ChevronDown, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  useAlchemyComputed,
  useAlchemyData,
  useAlchemyFilters,
} from '../adapters'
import { useAlchemyPagination } from '../adapters/useAlchemyPagination'
import {
  AlchemyMetaAnalysis,
  IngredientList,
  StatisticsDashboard,
  type ViewMode,
} from '../components'
import { VirtualIngredientGrid } from '../components/composition/VirtualIngredientGrid'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import type { AlchemyIngredientWithComputed } from '../types'

type SortOption = 'alphabetical' | 'value' | 'weight'

export function AlchemyPageView() {
  // Data adapters
  const { ingredients, loading, error } = useAlchemyData()

  // Filter adapters
  const { filteredIngredients: baseFilteredIngredients } =
    useAlchemyFilters(ingredients)

  // Computed adapters
  const { statistics, availableEffects, getEffectComparisons } =
    useAlchemyComputed(ingredients)

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // State for sorting
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')

  // Debug sortBy changes
  useEffect(() => {
    console.log(`🎯 sortBy changed to: ${sortBy}`)
  }, [sortBy])

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    try {
      // Check if ingredients are loaded
      if (!ingredients || ingredients.length === 0) {
        return []
      }

      // Use the pre-computed available options from useAlchemyComputed
      // This ensures consistency and avoids duplicate calculations
      const allEffects = availableEffects || []

      return [
        {
          id: 'fuzzy-search',
          name: 'Fuzzy Search',
          placeholder: 'Search by name, effects, or description...',
          options: [], // No autocomplete options - this should be free-form text input
        },
        {
          id: 'effects',
          name: 'Effects',
          placeholder: 'Filter by effect...',
          options: allEffects.map(effect => ({
            id: `effect-${effect}`,
            label: effect,
            value: effect,
            category: 'Effects',
            description: `Ingredients with ${effect} effect`,
          })),
        },
      ]
    } catch (error) {
      return []
    }
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

  // Apply all filters to ingredients
  const filteredIngredientsWithTags = baseFilteredIngredients.filter(
    (ingredient: AlchemyIngredientWithComputed) => {
      // If no tags are selected, show all ingredients
      if (selectedTags.length === 0) return true

      // Check each selected tag
      return selectedTags.every(tag => {
        switch (tag.category) {
          case 'Fuzzy Search':
            // For fuzzy search, we'll handle this separately
            return true

          case 'Effects':
            // Filter by effects
            return ingredient.effects.some(
              effect => effect.mgefName === tag.value
            )

          default:
            return true
        }
      })
    }
  )

  // Apply fuzzy search to the filtered ingredients
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  const { filteredIngredients } = useFuzzySearch(
    filteredIngredientsWithTags as AlchemyIngredientWithComputed[],
    fuzzySearchQuery
  )

  // Sort the filtered ingredients BEFORE pagination
  const sortedIngredients = useMemo(() => {
    console.log(
      `🔄 Sorting triggered - sortBy: ${sortBy}, filteredIngredients.length: ${filteredIngredients.length}`
    )

    const sorted = [...filteredIngredients].sort((a, b) => {
      let result = 0
      switch (sortBy) {
        case 'alphabetical':
          result = a.name.localeCompare(b.name)
          break
        case 'value':
          result = b.value - a.value // Descending
          if (result === 0) result = a.name.localeCompare(b.name)
          break
        case 'weight':
          result = a.weight - b.weight // Ascending
          if (result === 0) result = a.name.localeCompare(b.name)
          break
        default:
          result = 0
      }
      return result
    })

    // Debug logging
    console.log(
      `✅ Sort complete - sortBy: ${sortBy}, Total items: ${sorted.length}`
    )
    if (sorted.length > 0) {
      console.log(
        `📊 First 3 items after sort:`,
        sorted.slice(0, 3).map(item => ({
          name: item.name,
          value: item.value,
          weight: item.weight,
        }))
      )
    }

    return sorted
  }, [filteredIngredients, sortBy])

  // Add pagination
  const { displayedItems, loadMore, resetPagination, paginationInfo, hasMore } =
    useAlchemyPagination(sortedIngredients)

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
  }, [selectedTags, sortBy, resetPagination])

  const handleIngredientClick = (ingredient: AlchemyIngredientWithComputed) => {
    // TODO: Implement ingredient detail view or modal
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading alchemy ingredients...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-2">
            Error loading alchemy ingredients
          </p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Search Bar Section */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
          />
        </div>
      </div>

      {/* View Controls Section */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: View Mode Toggle */}
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />

        {/* Right: Sort Options */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => {
              const newSort = e.target.value as SortOption
              console.log(`🔄 Select changed from ${sortBy} to ${newSort}`)
              setSortBy(newSort)
            }}
            className="appearance-none bg-background border border-border rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
          >
            <option value="alphabetical">Sort: A-Z</option>
            <option value="value">Sort: Value</option>
            <option value="weight">Sort: Weight</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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

      {/* Tabs */}
      <Tabs defaultValue="ingredients" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="meta">Meta Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients">
          {/* Ingredient Display */}
          <div className="space-y-4">
            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing {paginationInfo.displayedItems} of{' '}
              {paginationInfo.totalItems} ingredients
            </div>

            {/* Dynamic Ingredient Display based on view mode */}
            {viewMode === 'grid' && (
              <VirtualIngredientGrid
                ingredients={displayedItems}
                variant="default"
                columns={3}
                onIngredientClick={handleIngredientClick}
                showEffects={true}
                showProperties={true}
                getEffectComparisons={getEffectComparisons}
                loadMore={loadMore}
                hasMore={hasMore}
              />
            )}

            {viewMode === 'list' && (
              <div className="space-y-3">
                <IngredientList
                  ingredients={displayedItems}
                  variant="default"
                  onIngredientClick={handleIngredientClick}
                  showEffects={true}
                  showProperties={true}
                  getEffectComparisons={getEffectComparisons}
                />

                {/* Load More Button for List View */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={loadMore}
                      className="w-full max-w-xs"
                    >
                      Load More ({paginationInfo.displayedItems} of{' '}
                      {paginationInfo.totalItems})
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          {/* Statistics Dashboard */}
          {statistics && <StatisticsDashboard statistics={statistics} />}
        </TabsContent>

        <TabsContent value="meta">
          {/* Alchemy Meta Analysis */}
          <AlchemyMetaAnalysis ingredients={ingredients} />
        </TabsContent>
      </Tabs>

      {/* Back to Top Button */}
      <BackToTopButton threshold={400} />
    </div>
  )
}
