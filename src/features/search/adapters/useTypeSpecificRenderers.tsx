import type { SearchResult } from '../model/SearchModel'
import type { ViewMode } from '../model/TypeSpecificComponents'
import { transformSearchResultData } from '../utils/typeTransformers'
import { getComponentForType } from './componentMapping'

export function useTypeSpecificRenderers() {
  // Simple function to render a search result with the appropriate component
  const renderSearchResult = (
    result: SearchResult,
    viewMode: ViewMode = 'card',
    isSelected?: boolean,
    onClick?: () => void
  ) => {
    const Component = getComponentForType(result.item.type, viewMode)
    const transformedData = transformSearchResultData(result)

    // For recipe components, pass the result directly
    if (result.item.type === 'recipe') {
      return (
        <Component
          result={result}
          isSelected={isSelected}
          onClick={onClick}
          compact={viewMode === 'compact'}
        />
      )
    }

    // For other components, use the transformed data approach
    const props = {
      ...transformedData,
      searchHighlights: result.highlights,
      searchResult: result,
    }

    return <Component {...props} />
  }

  return { renderSearchResult }
}
