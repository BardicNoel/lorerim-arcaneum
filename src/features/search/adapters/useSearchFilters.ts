import { useMemo } from 'react'
import { useSearchData } from './useSearchData'
import { useSearchState } from './useSearchState'

export function useSearchFilters() {
  const { search, getAvailableFilters, isReady, getSearchableItems } =
    useSearchData()
  const { activeFilters } = useSearchState()

  const searchResults = useMemo(() => {
    if (!isReady) return []

    // If no filters are applied, show all items
    const hasFilters =
      activeFilters.tags.length > 0 ||
      activeFilters.types.length > 0 ||
      activeFilters.categories.length > 0

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

    // Create a search query from tags
    const searchQuery = activeFilters.tags.join(' ')

    return search(searchQuery, activeFilters)
  }, [isReady, search, activeFilters, getSearchableItems])

  const availableFilters = useMemo(() => {
    if (!isReady) return { types: [], categories: [], tags: [] }
    return getAvailableFilters()
  }, [isReady, getAvailableFilters])

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
