// Spell data structure based on player_spells.json
export interface SpellEffect {
  name: string
  description: string
  magnitude: number
  duration: number
  area: number
}

export interface Spell {
  name: string
  editorId: string
  description: string
  school: string
  level: string
  magickaCost: number
  tome: string
  vendors: string[]
  halfCostPerk: string
  halfCostPerkName: string
  effects: SpellEffect[]
}

// Computed spell properties for enhanced functionality
export interface SpellWithComputed extends Spell {
  // Computed fields
  hasEffects: boolean
  effectCount: number
  isAreaSpell: boolean
  isDurationSpell: boolean
  isInstantSpell: boolean
  totalMagnitude: number
  maxDuration: number
  maxArea: number
  tags: string[]
  searchableText: string
}

// Filter and search types
export interface SpellFilters {
  schools: string[]
  levels: string[]
  searchTerm: string
  hasEffects: boolean | null
  isAreaSpell: boolean | null
  isDurationSpell: boolean | null
  minMagickaCost: number | null
  maxMagickaCost: number | null
  minMagnitude: number | null
  maxMagnitude: number | null
}

export interface SpellSearchResult {
  spell: SpellWithComputed
  score: number
  matchedFields: string[]
}

// View state types
export interface SpellViewState {
  viewMode: 'grid' | 'list'
  sortBy: 'name' | 'school' | 'level' | 'magickaCost' | 'magnitude' | 'duration'
  sortOrder: 'asc' | 'desc'
  selectedSpells: string[]
  expandedSpells: string[]
}

// Spell comparison types
export interface SpellComparison {
  spell1: SpellWithComputed
  spell2: SpellWithComputed
  differences: {
    magickaCost: { difference: number; percentage: number }
    magnitude: { difference: number; percentage: number }
    duration: { difference: number; percentage: number }
    area: { difference: number; percentage: number }
    effects: { added: string[]; removed: string[]; common: string[] }
  }
}

// Spell build integration types
export interface SpellBuildItem {
  spellId: string
  spellName: string
  school: string
  level: string
  magickaCost: number
  isSelected: boolean
}

// API response types
export interface SpellDataResponse {
  spells: Spell[]
  totalCount: number
  schools: string[]
  levels: string[]
  lastUpdated: string
}

// Error types
export interface SpellError {
  code: string
  message: string
  details?: unknown
} 