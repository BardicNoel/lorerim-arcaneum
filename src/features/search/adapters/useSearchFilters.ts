import { useMemo } from 'react'
import { useSearchData } from './useSearchData'
import { useSearchState } from './useSearchState'

export function useSearchFilters() {
  const { search, getAvailableFilters, isReady } = useSearchData()
  const { query, activeFilters } = useSearchState()

  const searchResults = useMemo(() => {
    if (!isReady || !query.trim()) return []
    return search(query, activeFilters)
  }, [isReady, search, query, activeFilters])

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
