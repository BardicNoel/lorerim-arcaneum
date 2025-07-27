import React, { useCallback, useState } from 'react'
import type { SearchResult, SearchResultRenderer } from '../model/SearchModel'
import {
  FALLBACK_RENDERER,
  SEARCH_RESULT_RENDERERS,
} from '../model/SearchRenderers'

export function useSearchRenderers() {
  const [rendererCache, setRendererCache] = useState<
    Record<string, SearchResultRenderer>
  >({})

  const getRendererForType = useCallback(
    async (type: string): Promise<SearchResultRenderer> => {
      // Check cache first
      if (rendererCache[type]) {
        return rendererCache[type]
      }

      try {
        const renderer = SEARCH_RESULT_RENDERERS[type] || FALLBACK_RENDERER

        // Cache the renderer
        setRendererCache(prev => ({
          ...prev,
          [type]: renderer,
        }))

        return renderer
      } catch (error) {
        console.error(`Failed to load renderer for type ${type}:`, error)
        return FALLBACK_RENDERER
      }
    },
    [rendererCache]
  )

  const renderSearchResultCard = useCallback(
    async (
      result: SearchResult,
      isSelected: boolean,
      variant: 'card' | 'compact' = 'card'
    ) => {
      const renderer = await getRendererForType(result.item.type)
      const Component =
        variant === 'compact'
          ? renderer.compactComponent || renderer.cardComponent
          : renderer.cardComponent

      return React.createElement(Component, {
        result,
        isSelected,
        onClick: () => {}, // Will be handled by parent
      })
    },
    [getRendererForType]
  )

  const renderSearchResultDetail = useCallback(
    async (result: SearchResult) => {
      const renderer = await getRendererForType(result.item.type)
      const Component = renderer.detailComponent

      return React.createElement(Component, {
        result,
      })
    },
    [getRendererForType]
  )

  const getCachedRenderer = useCallback(
    (type: string): SearchResultRenderer | null => {
      return rendererCache[type] || null
    },
    [rendererCache]
  )

  return {
    getRendererForType,
    renderSearchResultCard,
    renderSearchResultDetail,
    getCachedRenderer,
  }
}
