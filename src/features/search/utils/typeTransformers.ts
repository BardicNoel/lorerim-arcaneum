import type { SearchHighlight, SearchResult } from '../model/SearchModel'

// Type definitions for transformed data
export interface TransformedRaceData {
  id: string
  name: string
  description?: string
  originalData: any
  searchHighlights: SearchHighlight[]
  // Add other race-specific fields as needed
}

export interface TransformedBirthsignData {
  id: string
  name: string
  description?: string
  originalData: any
  searchHighlights: SearchHighlight[]
  // Add other birthsign-specific fields as needed
}

export interface TransformedSkillData {
  id: string
  name: string
  description?: string
  originalData: any
  searchHighlights: SearchHighlight[]
  // Add other skill-specific fields as needed
}

export interface TransformedTraitData {
  id: string
  name: string
  description?: string
  originalData: any
  searchHighlights: SearchHighlight[]
  // Add other trait-specific fields as needed
}

export interface TransformedDestinyData {
  id: string
  name: string
  description?: string
  originalData: any
  searchHighlights: SearchHighlight[]
  // Add other destiny-specific fields as needed
}

export interface TransformedPerkData {
  id: string
  name: string
  description?: string
  originalData: any
  searchHighlights: SearchHighlight[]
  // Add other perk-specific fields as needed
}

// Generic function to apply search highlights to data
export function applySearchHighlights(
  data: any,
  highlights: SearchHighlight[]
) {
  const highlightedFields: Record<string, string> = {}

  highlights.forEach(highlight => {
    highlightedFields[highlight.field] = highlight.snippet
  })

  return {
    ...data,
    searchHighlights: highlights,
    highlightedFields,
  }
}

// Transform race data
export function transformRaceData(result: SearchResult): TransformedRaceData {
  const originalData = result.item.originalData

  const base = applySearchHighlights(
    {
      id: result.item.id,
      name: result.item.name,
      description: result.item.description,
      originalData,
      ...originalData,
    },
    result.highlights
  )

  // Provide props expected by RaceCard
  ;(base as any).item = {
    id: result.item.id,
    name: result.item.name,
    description: result.item.description,
    category: (originalData && (originalData as any).category) || result.item.category,
  }
  ;(base as any).originalRace = originalData
  return base
}

// Transform birthsign data
export function transformBirthsignData(
  result: SearchResult
): TransformedBirthsignData {
  const originalData = result.item.originalData

  const base = applySearchHighlights(
    {
      id: result.item.id,
      name: result.item.name,
      description: result.item.description,
      originalData,
      ...originalData,
    },
    result.highlights
  )

  const group = (originalData && (originalData as any).group) || 'Other'
  // Provide props expected by BirthsignCard
  ;(base as any).birthsign = {
    name: result.item.name,
    group,
    description: result.item.description || '',
    powers: (originalData && (originalData as any).powers) || [],
    stat_modifications:
      (originalData && (originalData as any).stat_modifications) || [],
  }
  ;(base as any).item = {
    id: result.item.id,
    name: result.item.name,
    description: result.item.description,
    category: result.item.category,
  }
  return base
}

// Transform skill data
export function transformSkillData(result: SearchResult): TransformedSkillData {
  const originalData = result.item.originalData

  return applySearchHighlights(
    {
      id: result.item.id,
      name: result.item.name,
      description: result.item.description,
      originalData,
      // Add skill-specific fields from originalData
      ...originalData,
    },
    result.highlights
  )
}

// Transform trait data
export function transformTraitData(result: SearchResult): TransformedTraitData {
  const originalData = result.item.originalData

  return applySearchHighlights(
    {
      id: result.item.id,
      name: result.item.name,
      description: result.item.description,
      originalData,
      // Add trait-specific fields from originalData
      ...originalData,
    },
    result.highlights
  )
}

// Transform destiny data
export function transformDestinyData(
  result: SearchResult
): TransformedDestinyData {
  const originalData = result.item.originalData

  return applySearchHighlights(
    {
      id: result.item.id,
      name: result.item.name,
      description: result.item.description,
      originalData,
      // Add destiny-specific fields from originalData
      ...originalData,
    },
    result.highlights
  )
}

// Transform perk data
export function transformPerkData(result: SearchResult): TransformedPerkData {
  const originalData = result.item.originalData

  return applySearchHighlights(
    {
      id: result.item.id,
      name: result.item.name,
      description: result.item.description,
      originalData,
      // Add perk-specific fields from originalData
      ...originalData,
    },
    result.highlights
  )
}

// Generic transformer function
export function transformSearchResultData(result: SearchResult): any {
  switch (result.item.type) {
    case 'race':
      return transformRaceData(result)
    case 'birthsign':
      return transformBirthsignData(result)
    case 'skill':
      return transformSkillData(result)
    case 'trait':
      return transformTraitData(result)
    case 'destiny':
      return transformDestinyData(result)
    case 'perk':
      return transformPerkData(result)
    case 'recipe':
      // Transform recipe data to include originalData properly
      return applySearchHighlights(
        {
          id: result.item.id,
          name: result.item.name,
          description: result.item.description,
          originalData: result.item.originalData,
          // Include recipe-specific fields
          ...result.item.originalData,
        },
        result.highlights
      )
    case 'religion':
      // For now, return generic data for religion
      return applySearchHighlights(
        {
          id: result.item.id,
          name: result.item.name,
          description: result.item.description,
          originalData: result.item.originalData,
        },
        result.highlights
      )
    default:
      // Fallback for unknown types
      return applySearchHighlights(
        {
          id: result.item.id,
          name: result.item.name,
          description: result.item.description,
          originalData: result.item.originalData,
        },
        result.highlights
      )
  }
}

// Transform multiple results for grid/accordion views
export function transformSearchResultsData(results: SearchResult[]): any[] {
  return results.map(transformSearchResultData)
}

// Group results by type for type-specific rendering
export function groupResultsByType(
  results: SearchResult[]
): Record<string, SearchResult[]> {
  return results.reduce(
    (groups, result) => {
      const type = result.item.type
      if (!groups[type]) {
        groups[type] = []
      }
      groups[type].push(result)
      return groups
    },
    {} as Record<string, SearchResult[]>
  )
}
