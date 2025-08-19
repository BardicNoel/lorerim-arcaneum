import type {
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { BackToTopButton } from '@/shared/components/generic'
import { useEffect, useState } from 'react'
import { useSearchComputed } from '../adapters/useSearchComputed'
import { useSearchData } from '../adapters/useSearchData'
import { useSearchFilters } from '../adapters/useSearchFilters'
import { useSearchState } from '../adapters/useSearchState'
import { SearchPageLayout } from '../components/SearchPageLayout'
import { SearchFilters } from '../components/composition/SearchFilters'
import { SearchResultsGrid } from '../components/composition/SearchResultsGrid'
import type { SearchFilters as SearchFiltersType } from '../model/SearchModel'

export function SimpleSearchPageView() {
  const { isReady, isIndexing, error } = useSearchData()
  const { activeFilters, setActiveFilters, clearFilters, addTag, removeTag } =
    useSearchState()
  const { availableFilters, searchResults } = useSearchFilters()
  const { 
    filteredResults, // This now contains the paginated items
    totalResults, 
    loadMore, 
    resetPagination, 
    paginationInfo, 
    hasMore 
  } = useSearchComputed()

  // Tag state management
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  // View mode state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid')

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
  }, [activeFilters, resetPagination])

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
  const handleTagSelect = (tag: SelectedTag) => {
    addTag(tag.value)
    setSelectedTags(prev => [...prev, tag])
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    const tag = selectedTags.find(t => t.id === tagId)
    if (tag) {
      removeTag(tag.value)
      setSelectedTags(prev => prev.filter(t => t.id !== tagId))
    }
  }

  // Handle view mode change
  const handleViewModeChange = (mode: 'list' | 'grid') => {
    setViewMode(mode)
  }

  // Handle clear filters
  const handleClearFilters = () => {
    clearFilters()
    setSelectedTags([])
  }

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">
            {isIndexing ? 'Indexing search data...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive">Error loading search data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const title = 'Search'
  const description =
    selectedTags.length > 0
      ? `Search results for ${selectedTags.length} filter${selectedTags.length !== 1 ? 's' : ''}`
      : 'Search across all skills, races, traits, religions, birthsigns, destiny nodes, and perk references'

  return (
    <>
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
          <SearchResultsGrid
            items={filteredResults.map(result => result.item)} // Use filteredResults (paginated) instead of searchResults
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            onLoadMore={loadMore}
            hasMore={hasMore}
            paginationInfo={paginationInfo}
          />
        </div>
      </SearchPageLayout>
      
      {/* Back to Top Button */}
      <BackToTopButton threshold={400} />
    </>
  )
}
