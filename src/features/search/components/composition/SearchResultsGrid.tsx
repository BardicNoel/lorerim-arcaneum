import { ItemGrid } from '@/shared/components/playerCreation/ItemGrid'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { SearchResult } from '../../model/SearchModel'
import { searchResultToPlayerCreationItem } from '../../model/SearchUtilities'
import { SearchResultWrapper } from '../atomic/SearchResultWrapper'
import { TypeSpecificSearchResults } from './TypeSpecificSearchResults'

interface SearchResultsGridProps {
  results: SearchResult[]
  viewMode?: 'grid' | 'list'
  className?: string
  useTypeSpecificRendering?: boolean
  renderMode?: 'grouped' | 'unified' | 'type-defaults'
}

export function SearchResultsGrid({
  results,
  viewMode = 'grid',
  className,
  useTypeSpecificRendering = true,
  renderMode = 'grouped',
}: SearchResultsGridProps) {
  // Use type-specific rendering if enabled
  if (useTypeSpecificRendering) {
    return (
      <TypeSpecificSearchResults
        results={results}
        selectedResult={null}
        onResultSelect={() => {}} // No selection needed
        viewMode={viewMode === 'list' ? 'accordion' : 'card'}
        renderMode={renderMode}
        className={className}
      />
    )
  }

  // Fallback to original implementation
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
        isSelected={false}
        onSelect={() => {}} // No selection needed
        variant="card"
      />
    )
  }

  return (
    <div className={className}>
      <ItemGrid
        items={playerCreationItems}
        viewMode={viewMode}
        onItemSelect={() => {}} // No selection needed
        selectedItem={null}
        renderItemCard={renderItemCard}
      />
    </div>
  )
}
