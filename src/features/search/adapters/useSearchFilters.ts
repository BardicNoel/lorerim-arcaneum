import { useMemo } from 'react'
import { useSearchState } from '../hooks/useSearchState'
import { useSearchData } from './useSearchData'

export function useSearchFilters() {
  const { search, getAvailableFilters, isReady, getSearchableItems } =
    useSearchData()
  const { activeFilters } = useSearchState()

  // Get the current count of searchable items to trigger re-computation
  const searchableItemsCount = useMemo(() => {
    return getSearchableItems().length
  }, [getSearchableItems])

  const searchResults = useMemo(() => {
    if (!isReady || !activeFilters) return []

    // If no filters are applied, show all items
    const hasFilters =
      (activeFilters.tags?.length || 0) > 0 ||
      (activeFilters.types?.length || 0) > 0 ||
      (activeFilters.categories?.length || 0) > 0

    if (!hasFilters) {
      // Return all searchable items when no filters are applied
      const allItems = getSearchableItems()

      return allItems.map(item => ({
        item,
        score: 1, // Perfect score for unfiltered results
        matches: [],
        highlights: [],
      }))
    }

    // Create a search query from tags using OR operator for inclusive fuzzy search
    const searchQuery = (activeFilters.tags || []).join(' | ')

    // Create filters without the search terms (tags will be handled separately)
    const searchFilters = {
      ...(activeFilters || {}),
      tags: [], // Remove tags from filters since they're used for search query
    }

    // If we have type/category filters but no search query, use a wildcard query
    // to ensure the search function processes the filters
    const finalQuery = searchQuery || '*'

    return search(finalQuery, searchFilters)
  }, [isReady, search, activeFilters, getSearchableItems])

  const availableFilters = useMemo(() => {
    if (!isReady)
      return {
        types: [],
        categories: [],
        tags: [],
      }
    return getAvailableFilters()
  }, [isReady, getAvailableFilters, searchableItemsCount])

  const resultCounts = useMemo(() => {
    const counts: Record<string, number> = {}

    searchResults.forEach(result => {
      const type = result.item.type
      counts[type] = (counts[type] || 0) + 1

      if (result.item.category) {
        counts[`category:${result.item.category}`] =
          (counts[`category:${result.item.category}`] || 0) + 1
      }

      result.item.tags.forEach(tag => {
        counts[`tag:${tag}`] = (counts[`tag:${tag}`] || 0) + 1
      })
    })

    return counts
  }, [searchResults])

  return {
    searchResults,
    availableFilters,
    resultCounts,
  }
}
