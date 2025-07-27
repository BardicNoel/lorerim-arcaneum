import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { SearchFilters, SearchResult } from '../model/SearchModel'

// Helper function to compare arrays efficiently
function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  return a.every((item, index) => item === b[index])
}

// Helper function to parse URL params consistently
function parseURLParams(searchParams: URLSearchParams) {
  return {
    query: searchParams.get('q') || '',
    types: searchParams.get('types')?.split(',').filter(Boolean) || [],
    categories:
      searchParams.get('categories')?.split(',').filter(Boolean) || [],
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    viewMode:
      (searchParams.get('view') as 'grid' | 'list') || ('grid' as const),
  }
}

export function useSearchState() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isUpdatingFromURL = useRef(false)
  const lastURLParams = useRef<string>('')
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get initial state from URL params
  const initialParams = parseURLParams(searchParams)

  const [query, setQuery] = useState(initialParams.query)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  )
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    types: initialParams.types,
    categories: initialParams.categories,
    tags: initialParams.tags,
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    initialParams.viewMode
  )

  // Watch for URL parameter changes and update state
  useEffect(() => {
    // Skip if we're currently updating the URL to avoid circular dependency
    if (isUpdatingFromURL.current) return

    // Create a string representation of current URL params to detect changes
    const currentURLParams = searchParams.toString()

    // Only update if URL params have actually changed
    if (currentURLParams === lastURLParams.current) return

    lastURLParams.current = currentURLParams

    const urlParams = parseURLParams(searchParams)

    // Update state only if values have actually changed
    if (urlParams.query !== query) {
      setQuery(urlParams.query)
    }

    if (!arraysEqual(urlParams.types, activeFilters.types)) {
      setActiveFilters(prev => ({ ...prev, types: urlParams.types }))
    }

    if (!arraysEqual(urlParams.categories, activeFilters.categories)) {
      setActiveFilters(prev => ({ ...prev, categories: urlParams.categories }))
    }

    if (!arraysEqual(urlParams.tags, activeFilters.tags)) {
      setActiveFilters(prev => ({ ...prev, tags: urlParams.tags }))
    }

    if (urlParams.viewMode !== viewMode) {
      setViewMode(urlParams.viewMode)
    }
  }, [
    searchParams,
    query,
    activeFilters.types,
    activeFilters.categories,
    activeFilters.tags,
    viewMode,
  ])

  // Update URL when state changes
  useEffect(() => {
    // Clear any pending timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    // Set flag to prevent circular dependency
    isUpdatingFromURL.current = true

    const newParams = new URLSearchParams()

    if (query) {
      newParams.set('q', query)
    }

    if (activeFilters.types.length > 0) {
      newParams.set('types', activeFilters.types.join(','))
    }

    if (activeFilters.categories.length > 0) {
      newParams.set('categories', activeFilters.categories.join(','))
    }

    if (activeFilters.tags.length > 0) {
      newParams.set('tags', activeFilters.tags.join(','))
    }

    if (viewMode !== 'grid') {
      newParams.set('view', viewMode)
    }

    setSearchParams(newParams, { replace: true })

    // Reset flag after a short delay to ensure URL change is processed
    updateTimeoutRef.current = setTimeout(() => {
      isUpdatingFromURL.current = false
    }, 10)
  }, [query, activeFilters, viewMode, setSearchParams])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery)
    // Clear selection when query changes
    setSelectedResult(null)
  }, [])

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setActiveFilters(prev => ({ ...prev, ...newFilters }))
    // Clear selection when filters change
    setSelectedResult(null)
  }, [])

  const clearFilters = useCallback(() => {
    setActiveFilters({
      types: [],
      categories: [],
      tags: [],
    })
    setSelectedResult(null)
  }, [])

  const selectResult = useCallback((result: SearchResult | null) => {
    setSelectedResult(result)
  }, [])

  const updateViewMode = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
  }, [])

  return {
    query,
    setQuery: updateQuery,
    selectedResult,
    setSelectedResult: selectResult,
    activeFilters,
    setActiveFilters: updateFilters,
    clearFilters,
    viewMode,
    setViewMode: updateViewMode,
  }
}
