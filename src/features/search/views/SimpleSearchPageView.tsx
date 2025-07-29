import type {
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { useEffect, useState } from 'react'
import { useSearchComputed } from '../adapters/useSearchComputed'
import { useSearchData } from '../adapters/useSearchData'
import { useSearchFilters } from '../adapters/useSearchFilters'
import { useSearchState } from '../adapters/useSearchState'
import { SearchPageLayout } from '../components/SearchPageLayout'
import { SearchFilters } from '../components/composition/SearchFilters'
import { SearchResultsAccordionGrid } from '../components/composition/SearchResultsAccordionGrid'

export function SimpleSearchPageView() {
  const { isReady, isIndexing, error } = useSearchData()
  const { activeFilters, setActiveFilters, clearFilters, addTag, removeTag } =
    useSearchState()
  const { availableFilters, searchResults } = useSearchFilters()
  const { totalResults } = useSearchComputed()

  // Tag state management
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Sync selectedTags with activeFilters.tags from URL
  useEffect(() => {
    const urlTags: SelectedTag[] = []

    // Add tags from URL
    activeFilters.tags.forEach(tag => {
      urlTags.push({
        id: `custom-${tag}`,
        label: tag,
        value: tag,
        category: 'Search All',
      })
    })

    // Add type filters from URL
    activeFilters.types.forEach(type => {
      urlTags.push({
        id: `type-${type}`,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
        category: 'Types',
      })
    })

    // Add category filters from URL
    activeFilters.categories.forEach(category => {
      urlTags.push({
        id: `category-${category}`,
        label: category,
        value: category,
        category: 'Categories',
      })
    })

    setSelectedTags(urlTags)
  }, [activeFilters.tags, activeFilters.types, activeFilters.categories])

  // Add a tag (from autocomplete or custom input)
  const handleTagSelect = (optionOrTag: SearchOption | string) => {
    let tag: SelectedTag
    if (typeof optionOrTag === 'string') {
      tag = {
        id: `custom-${optionOrTag}`,
        label: optionOrTag,
        value: optionOrTag,
        category: 'Search All',
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
      addTag(tag.value)
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    const tag = selectedTags.find(t => t.id === tagId)
    if (tag) {
      setSelectedTags(prev => prev.filter(t => t.id !== tagId))

      // Remove from appropriate filter based on category
      if (tag.category === 'Types') {
        setActiveFilters(prev => ({
          ...prev,
          types: prev.types.filter(t => t !== tag.value),
        }))
      } else if (tag.category === 'Categories') {
        setActiveFilters(prev => ({
          ...prev,
          categories: prev.categories.filter(c => c !== tag.value),
        }))
      } else {
        // Default to removing from tags
        removeTag(tag.value)
      }
    }
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedTags([])
    clearFilters()
  }

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  if (!isReady) {
    return (
      <SearchPageLayout title="Search" description="Building search index...">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            {isIndexing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            ) : null}
            <p className="text-muted-foreground">
              {isIndexing ? 'Building search index...' : 'Loading search...'}
            </p>
          </div>
        </div>
      </SearchPageLayout>
    )
  }

  if (error) {
    return (
      <SearchPageLayout title="Search" description="Error loading search">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Failed to load search: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </SearchPageLayout>
    )
  }

  const title = selectedTags.length > 0 ? `Search Results` : 'Search'
  const description =
    selectedTags.length > 0
      ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for ${selectedTags.length} filter${selectedTags.length !== 1 ? 's' : ''}`
      : 'Search across all skills, races, traits, religions, birthsigns, destiny nodes, and perk references'

  return (
    <SearchPageLayout title={title} description={description}>
      {/* Filters Section */}
      <div className="mb-6">
        <SearchFilters
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          onClearFilters={handleClearFilters}
          availableFilters={availableFilters}
          resultCount={totalResults}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
          selectedTags={selectedTags}
        />
      </div>

      {/* Results Section */}
      <div className="w-full">
        <SearchResultsAccordionGrid
          items={searchResults.map(result => result.item)}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
      </div>
    </SearchPageLayout>
  )
}
