import type { SearchResult } from '../model/SearchModel'
import type { ViewMode } from '../model/TypeSpecificComponents'
import { transformSearchResultData } from '../utils/typeTransformers'
import { getComponentForType } from './componentMapping'

export function useTypeSpecificRenderers() {
  // Simple function to render a search result with the appropriate component
  const renderSearchResult = (
    result: SearchResult,
    viewMode: ViewMode = 'card'
  ) => {
    const Component = getComponentForType(result.item.type, viewMode)
    const transformedData = transformSearchResultData(result)

    const props = {
      ...transformedData,
      searchHighlights: result.highlights,
      searchResult: result,
    }

    return <Component {...props} />
  }

  return { renderSearchResult }
}
