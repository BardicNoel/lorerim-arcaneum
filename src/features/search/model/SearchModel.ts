export interface SearchableItem {
  id: string
  type:
    | 'skill'
    | 'race'
    | 'trait'
    | 'religion'
    | 'birthsign'
    | 'destiny'
    | 'perk'
    | 'perk-reference'
    | 'spell'
    | 'recipe'
    | 'enchantment'
  name: string
  description?: string
  category?: string
  tags: string[]
  searchableText: string[]
  originalData: any
  url: string
}

export interface SearchResult {
  item: SearchableItem
  score: number
  matches: Fuse.FuseResultMatch[]
  highlights: SearchHighlight[]
}

export interface SearchHighlight {
  field: string
  snippet: string
  startIndex: number
  endIndex: number
}

export interface SearchFilters {
  types: string[]
  categories: string[]
  tags: string[]
  skillCategories?: string[]
  raceTypes?: string[]
  traitTypes?: string[]
  religionTypes?: string[]
  birthsignGroups?: string[]
  spellSchools?: string[]
  spellLevels?: string[]
}

export interface SearchFilterOptions {
  types: Array<{ value: string; label: string; count: number }>
  categories: Array<{ value: string; label: string; count: number }>
  tags: Array<{ value: string; label: string; count: number }>
}

export interface SearchCategory {
  id: string
  name: string
  placeholder: string
  options: Array<{
    id: string
    label: string
    value: string
    category: string
    description: string
  }>
}

// Type-specific result rendering configuration
export interface SearchResultRenderer {
  type: string
  cardComponent: React.ComponentType<any>
  detailComponent: React.ComponentType<any>
  compactComponent?: React.ComponentType<any> // For modal/quick search
}
