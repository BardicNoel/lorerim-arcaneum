import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Trait } from '@/shared/data/schemas'

interface SearchableTrait {
  id: string
  name: string
  description: string
  category: string
  effects: string[]
  tags: string[]
  originalTrait: Trait
}

/**
 * Hook for fuzzy searching through trait data using Fuse.js
 */
export function useFuzzySearch(traits: Trait[], searchQuery: string) {
  // Create searchable trait objects
  const searchableTraits = useMemo(() => {
    return traits.map(trait => ({
      id: trait.id || trait.name,
      name: trait.name,
      description: trait.description || '',
      category: trait.category || '',
      effects: trait.effects?.map(
        effect => `${effect.type} ${effect.value || ''}`
      ).filter(Boolean) || [],
      tags: trait.tags || [],
      originalTrait: trait,
    }))
  }, [traits])

  // Configure Fuse.js for fuzzy substring matching on descriptions
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: 'description', weight: 0.6 },
        { name: 'name', weight: 0.3 },
        { name: 'effects', weight: 0.1 },
      ],
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true, // So matches can occur anywhere in the text
      minMatchCharLength: 3, // Force a real overlap (reduced from 4 for better matching)
      threshold: 0.6, // More permissive threshold for description matches
    }),
    []
  )

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(searchableTraits, fuseOptions)
  }, [searchableTraits, fuseOptions])

  // Perform search
  const searchResults = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase()
    
    console.log('🔍 [Fuzzy Search Debug] Search query:', trimmedQuery)
    console.log('🔍 [Fuzzy Search Debug] Total traits to search:', searchableTraits.length)
    
    // If no search query, return empty results
    if (!trimmedQuery) {
      console.log('🔍 [Fuzzy Search Debug] No search query, returning empty results')
      return []
    }

    // Run Fuse.js search
    console.log('🔍 [Fuzzy Search Debug] Running Fuse.js search...')
    const results = fuse.search(trimmedQuery)
    console.log('🔍 [Fuzzy Search Debug] Raw Fuse.js results:', results.map(r => ({
      name: r.item.name,
      score: r.score,
      matches: r.matches
    })))

    // Apply prefix boost for better relevance
    const prefix = trimmedQuery.slice(0, Math.min(3, trimmedQuery.length))
    const adjustedResults = results.map(result => {
      const text = result.item.description.toLowerCase()
      const hasPrefix = new RegExp(`\\b${prefix}`).test(text)
      const adjustedScore = hasPrefix ? (result.score ?? 1) * 0.85 : result.score
      
      console.log('🔍 [Fuzzy Search Debug] Score adjustment for', result.item.name, ':', {
        originalScore: result.score,
        hasPrefix,
        adjustedScore
      })
      
      return { ...result, score: adjustedScore }
    })

    // Filter by threshold and sort by score
    const filteredResults = adjustedResults
      .filter(r => (r.score ?? 1) <= 0.6) // More permissive threshold
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))

    console.log('🔍 [Fuzzy Search Debug] Final filtered results:', filteredResults.map(r => ({
      name: r.item.name,
      score: r.score
    })))

    return filteredResults
  }, [fuse, searchQuery, searchableTraits])

  // Return filtered traits based on search results
  const filteredTraits = useMemo(() => {
    return searchResults.map(result => result.item.originalTrait)
  }, [searchResults])

  return {
    filteredTraits,
    searchResults,
    searchableTraits,
  }
}
