import { ItemGrid } from '@/shared/components/playerCreation/ItemGrid'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { SearchResult } from '../../model/SearchModel'
import { searchResultToPlayerCreationItem } from '../../model/SearchUtilities'
import { SearchResultWrapper } from '../atomic/SearchResultWrapper'

interface SearchResultsGridProps {
  results: SearchResult[]
  selectedResult: SearchResult | null
  onResultSelect: (result: SearchResult) => void
  viewMode?: 'grid' | 'list'
  className?: string
}

export function SearchResultsGrid({
  results,
  selectedResult,
  onResultSelect,
  viewMode = 'grid',
  className,
}: SearchResultsGridProps) {
  // Transform search results to PlayerCreationItem format
  const playerCreationItems: (PlayerCreationItem & {
    originalSearchResult: SearchResult
  })[] = results.map(searchResultToPlayerCreationItem)

  const renderItemCard = (
    item: PlayerCreationItem & { originalSearchResult: SearchResult },
    isSelected: boolean
  ) => {
    return (
      <SearchResultWrapper
        result={item.originalSearchResult}
        isSelected={isSelected}
        onSelect={onResultSelect}
        variant="card"
      />
    )
  }

  return (
    <div className={className}>
      <ItemGrid
        items={playerCreationItems}
        viewMode={viewMode}
        onItemSelect={item => onResultSelect(item.originalSearchResult)}
        selectedItem={
          selectedResult
            ? searchResultToPlayerCreationItem(selectedResult)
            : null
        }
        renderItemCard={renderItemCard}
      />
    </div>
  )
}
