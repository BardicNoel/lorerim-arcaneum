import {
  PlayerCreationContent,
  PlayerCreationFilters,
  PlayerCreationItemsSection,
} from '@/shared/components/playerCreation'
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
import { SearchResultsGrid } from '../components/composition/SearchResultsGrid'

export function SearchPageView() {
  const { isReady, isIndexing, error } = useSearchData()
  const {
    activeFilters,
    setActiveFilters,
    clearFilters,
    viewMode,
    setViewMode,
    addTag,
    removeTag,
  } = useSearchState()
  const { availableFilters } = useSearchFilters()
  const { playerCreationItems, totalResults } = useSearchComputed()

  // Tag state management
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

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
  }, [activeFilters.tags, activeFilters.categories])

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

      // Add to appropriate filter based on category
      if (tag.category === 'Categories') {
        setActiveFilters(prev => ({
          ...prev,
          categories: [...prev.categories, tag.value],
        }))
      } else if (tag.category === 'Tags') {
        setActiveFilters(prev => ({
          ...prev,
          tags: [...prev.tags, tag.value],
        }))
      } else {
        // Default to adding as a search tag
        addTag(tag.value)
      }
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    const tag = selectedTags.find(t => t.id === tagId)
    if (tag) {
      setSelectedTags(prev => prev.filter(t => t.id !== tagId))

      // Remove from appropriate filter based on category
      if (tag.category === 'Categories') {
        setActiveFilters(prev => ({
          ...prev,
          categories: prev.categories.filter(c => c !== tag.value),
        }))
      } else if (tag.category === 'Tags') {
        setActiveFilters(prev => ({
          ...prev,
          tags: prev.tags.filter(t => t !== tag.value),
        }))
      } else {
        // Default to removing from search tags
        removeTag(tag.value)
      }
    }
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedTags([])
    clearFilters()
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
      : 'Search across all skills, races, traits, religions, birthsigns, and destiny nodes'

  return (
    <SearchPageLayout title={title} description={description}>
      <PlayerCreationFilters
        searchCategories={[]} // We'll use our custom SearchFilters component
        selectedTags={[]}
        viewMode={viewMode}
        onTagSelect={() => {}} // Handled by SearchFilters
        onTagRemove={() => {}} // Handled by SearchFilters
        onViewModeChange={setViewMode}
      >
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
      </PlayerCreationFilters>

      <PlayerCreationContent>
        <PlayerCreationItemsSection>
          <SearchResultsGrid
            results={playerCreationItems.map(item => item.originalSearchResult)}
            selectedResult={null}
            onResultSelect={() => {}} // No selection needed
            viewMode={viewMode}
            useTypeSpecificRendering={true}
            renderMode="grouped"
          />
        </PlayerCreationItemsSection>
      </PlayerCreationContent>
    </SearchPageLayout>
  )
}
