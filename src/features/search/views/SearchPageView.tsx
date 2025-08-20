import {
  PlayerCreationContent,
  PlayerCreationFilters,
  PlayerCreationItemsSection,
} from '@/shared/components/playerCreation'
import type {
  PlayerCreationItem,
} from '@/shared/components/playerCreation/types'
import type { SearchResult } from '../model/SearchModel'
import { useSearchComputed } from '../adapters/useSearchComputed'
import { useSearchData } from '../adapters/useSearchData'
import { useSearchFilters } from '../adapters/useSearchFilters'
import { useSearchState } from '../hooks/useSearchState'
import { SearchPageLayout } from '../components/SearchPageLayout'
import { SearchFilters as SearchFiltersComponent } from '../components/composition/SearchFilters'
import { SearchResultsGrid } from '../components/composition/SearchResultsGrid'

export function SearchPageView() {
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
  const { availableFilters } = useSearchFilters()
  const { playerCreationItems, totalResults } = useSearchComputed()
  
  // Type the playerCreationItems to include originalSearchResult
  const typedPlayerCreationItems = playerCreationItems as (PlayerCreationItem & { originalSearchResult: SearchResult })[]

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
        onViewModeChange={handleViewModeChange}
      >
        <SearchFiltersComponent
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
            results={typedPlayerCreationItems.map(item => item.originalSearchResult)}
            viewMode={viewMode}
            useTypeSpecificRendering={true}
            renderMode="grouped"
          />
        </PlayerCreationItemsSection>
      </PlayerCreationContent>
    </SearchPageLayout>
  )
}
