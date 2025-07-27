import { useTypeSpecificRenderers } from '../../adapters/useTypeSpecificRenderers'
import type { SearchResult } from '../../model/SearchModel'
import { groupResultsByType } from '../../utils/typeTransformers'

interface TypeSpecificSearchResultsProps {
  results: SearchResult[]
  selectedResult: SearchResult | null
  onResultSelect: (result: SearchResult) => void
  viewMode?: 'card' | 'accordion' | 'grid'
  renderMode?: 'grouped' | 'unified' | 'type-defaults'
  className?: string
}

export function TypeSpecificSearchResults({
  results,
  selectedResult,
  onResultSelect,
  viewMode = 'card',
  renderMode = 'grouped',
  className,
}: TypeSpecificSearchResultsProps) {
  const { renderSearchResult } = useTypeSpecificRenderers()

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    onResultSelect(result)
  }

  // Render based on the selected mode
  const renderContent = () => {
    switch (renderMode) {
      case 'grouped':
        // Group results by type and render each group
        const groupedResults = groupResultsByType(results)
        return Object.entries(groupedResults).map(([type, typeResults]) => (
          <div key={type} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {type}s ({typeResults.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {typeResults.map(result => (
                <div key={result.item.id}>
                  {renderSearchResult(
                    result,
                    viewMode,
                    selectedResult?.item.id === result.item.id,
                    handleResultSelect
                  )}
                </div>
              ))}
            </div>
          </div>
        ))

      case 'type-defaults':
        // Use type-specific default view modes
        const groupedByType = groupResultsByType(results)
        return Object.entries(groupedByType).map(([type, typeResults]) => {
          // Use type-specific default view mode
          const defaultViewMode =
            type === 'skill' || type === 'perk'
              ? 'grid'
              : type === 'birthsign' || type === 'destiny'
                ? 'accordion'
                : 'card'

          return (
            <div key={type} className="mb-8">
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {type}s ({typeResults.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeResults.map(result => (
                  <div key={result.item.id}>
                    {renderSearchResult(
                      result,
                      defaultViewMode,
                      selectedResult?.item.id === result.item.id,
                      handleResultSelect
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })

      case 'unified':
      default:
        // Render all results in a unified grid with type-specific components
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(result => (
              <div key={result.item.id}>
                {renderSearchResult(
                  result,
                  viewMode,
                  selectedResult?.item.id === result.item.id,
                  handleResultSelect
                )}
              </div>
            ))}
          </div>
        )
    }
  }

  if (results.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No results found</p>
      </div>
    )
  }

  return <div className={className}>{renderContent()}</div>
}

// Component for rendering a single type group
interface TypeGroupProps {
  type: string
  results: SearchResult[]
  viewMode: 'card' | 'accordion' | 'grid'
  onResultSelect: (result: SearchResult) => void
  className?: string
}

export function TypeGroup({
  type,
  results,
  viewMode,
  onResultSelect,
  className,
}: TypeGroupProps) {
  const { renderSearchResult } = useTypeSpecificRenderers()

  return (
    <div className={`mb-8 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 capitalize">
        {type}s ({results.length})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(result => (
          <div key={result.item.id}>
            {renderSearchResult(result, viewMode, false, onResultSelect)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Component for rendering results in a specific view mode
interface ViewModeResultsProps {
  results: SearchResult[]
  viewMode: 'card' | 'accordion' | 'grid'
  onResultSelect: (result: SearchResult) => void
  className?: string
}

export function ViewModeResults({
  results,
  viewMode,
  onResultSelect,
  className,
}: ViewModeResultsProps) {
  const { renderSearchResult } = useTypeSpecificRenderers()

  return (
    <div className={className}>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(result => (
            <div key={result.item.id}>
              {renderSearchResult(result, viewMode, false, onResultSelect)}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map(result => (
            <div key={result.item.id}>
              {renderSearchResult(result, viewMode, false, onResultSelect)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
