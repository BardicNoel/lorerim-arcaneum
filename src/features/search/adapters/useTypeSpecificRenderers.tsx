import type { SearchResult } from '../model/SearchModel'
import type { ViewMode } from '../model/TypeSpecificComponents'
import { transformSearchResultData } from '../utils/typeTransformers'
import { getComponentForType } from './componentMapping'

export function useTypeSpecificRenderers() {
  // Simple function to render a search result with the appropriate component
  const renderSearchResult = (
    result: SearchResult,
    viewMode: ViewMode = 'card',
    isSelected: boolean = false,
    onSelect?: (result: SearchResult) => void
  ) => {
    const Component = getComponentForType(result.item.type, viewMode)
    const transformedData = transformSearchResultData(result)

    const props = {
      ...transformedData,
      isSelected,
      onClick: onSelect ? () => onSelect(result) : undefined,
      searchHighlights: result.highlights,
      searchResult: result,
    }

    return <Component {...props} />
  }

  return { renderSearchResult }
}
