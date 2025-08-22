import type {
  PlayerCreationItem,
} from '@/shared/components/playerCreation/types'
import { BackToTopButton } from '@/shared/components/generic'
import { useEffect } from 'react'
import { useSearchComputed } from '../adapters/useSearchComputed'
import { useSearchData } from '../adapters/useSearchData'
import { useSearchFilters } from '../adapters/useSearchFilters'
import { useSearchState } from '../hooks/useSearchState'
import { SearchPageLayout } from '../components/SearchPageLayout'
import { SearchFilters } from '../components/composition/SearchFilters'
import { SearchResultsGrid } from '../components/composition/SearchResultsGrid'
import type { SearchResult } from '../model/SearchModel'

export function SimpleSearchPageView() {
  const { isReady, isIndexing, error } = useSearchData()
  const {
    activeFilters,
    selectedTags,
    viewMode,
    setActiveFilters,
    handleTagSelect,
    handleTagRemove,
    handleClearFilters,
    handleViewModeChange,
  } = useSearchState()
  const { availableFilters, searchResults } = useSearchFilters()
  const { 
    filteredResults, // This now contains the paginated items
    totalResults, 
    loadMore, 
    resetPagination, 
    paginationInfo, 
    hasMore 
  } = useSearchComputed()

  // Reset pagination when filters change
  useEffect(() => {
    resetPagination()
  }, [activeFilters, resetPagination])

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
