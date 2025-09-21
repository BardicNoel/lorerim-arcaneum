// Alchemy ingredient data structure based on alchemy-ingredients.json
export interface AlchemyEffect {
  mgefFormId: string
  mgefName: string
  mgefDescription: string
  effectType: string
  skill: string
  baseCost: number
  magnitude: number
  duration: number
  area: number
  originalEFID: string
  originalEFIT: {
    magnitude: number
    area: number
    duration: number
  }
}

// Effect comparison data for statistics
export interface EffectComparison {
  name: string
  magnitude: {
    value: number
    mean: number
    difference: number
    percentage: number
  }
  duration: {
    value: number
    mean: number
    difference: number
    percentage: number
  }
  baseCost: {
    value: number
    mean: number
    difference: number
    percentage: number
  }
}

export interface AlchemyIngredient {
  name: string
  edid: string
  globalFormId: string
  plugin: string
  value: number
  weight: number
  flags: string[]
  effects: AlchemyEffect[]
}

// Computed ingredient properties for enhanced functionality
export interface AlchemyIngredientWithComputed extends AlchemyIngredient {
  // Computed fields
  hasEffects: boolean
  effectCount: number
  isComplex: boolean
  isSimple: boolean
  totalMagnitude: number
  maxDuration: number
  minDuration: number
  totalBaseCost: number
  averageMagnitude: number
  averageDuration: number
  tags: string[]
  searchableText: string
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
  effectTypes: string[]
  skills: string[]
}

// Filter and search types
export interface AlchemyFilters {
  effectTypes: string[]
  effects: string[]
  skills: string[]
  plugins: string[]
  flags: string[]
  searchTerm: string
  hasEffects: boolean | null
  isComplex: boolean | null
  minValue: number | null
  maxValue: number | null
  minWeight: number | null
  maxWeight: number | null
  minMagnitude: number | null
  maxMagnitude: number | null
  minDuration: number | null
  maxDuration: number | null
  minBaseCost: number | null
  maxBaseCost: number | null
  rarities: string[]
}

export interface AlchemySearchResult {
  ingredient: AlchemyIngredientWithComputed
  score: number
  matchedFields: string[]
}

// View state types
export interface AlchemyViewState {
  viewMode: 'grid' | 'list'
  sortBy:
    | 'name'
    | 'value'
    | 'weight'
    | 'effectCount'
    | 'magnitude'
    | 'duration'
    | 'baseCost'
    | 'plugin'
  sortOrder: 'asc' | 'desc'
  selectedIngredients: string[]
  expandedIngredients: string[]
}

// Ingredient comparison types
export interface AlchemyComparison {
  ingredient1: AlchemyIngredientWithComputed
  ingredient2: AlchemyIngredientWithComputed
  differences: {
    effectCount: { difference: number; percentage: number }
    magnitude: { difference: number; percentage: number }
    duration: { difference: number; percentage: number }
    baseCost: { difference: number; percentage: number }
    value: { difference: number; percentage: number }
    weight: { difference: number; percentage: number }
    effects: { added: string[]; removed: string[]; common: string[] }
    effectTypes: { added: string[]; removed: string[]; common: string[] }
  }
}

// Statistics types
export interface AlchemyStatistics {
  totalIngredients: number
  ingredientsByEffectType: Record<string, number>
  ingredientsByPlugin: Record<string, number>
  ingredientsByRarity: Record<string, number>
  ingredientsBySkill: Record<string, number>
  averageEffectCount: number
  averageMagnitude: number
  averageDuration: number
  averageBaseCost: number
  averageValue: number
  averageWeight: number
  topEffects: Array<{ name: string; count: number }>
  topEffectTypes: Array<{ name: string; count: number }>
  topPlugins: Array<{ name: string; count: number }>
  topSkills: Array<{ name: string; count: number }>
  valueDistribution: {
    min: number
    max: number
    mean: number
    median: number
  }
  weightDistribution: {
    min: number
    max: number
    mean: number
    median: number
  }
}

// Search category types
export interface SearchCategory {
  name: string
  options: string[]
}

// API response types
export interface AlchemyDataResponse {
  ingredients: AlchemyIngredient[]
  totalCount: number
  effectTypes: string[]
  effects: string[]
  skills: string[]
  plugins: string[]
  lastUpdated: string
}

// Error types
export interface AlchemyError {
  code: string
  message: string
  details?: unknown
}

// Build integration types
export interface AlchemyBuildItem {
  ingredientId: string
  ingredientName: string
  plugin: string
  effectCount: number
  isSelected: boolean
}

// Meta analysis types
export interface AlchemyMetaAnalysis {
  effectSynergies: Array<{
    effect1: string
    effect2: string
    frequency: number
    averageMagnitude: number
  }>
  pluginContributions: Array<{
    plugin: string
    ingredientCount: number
    uniqueEffects: number
    averageValue: number
  }>
  rarityAnalysis: {
    common: number
    uncommon: number
    rare: number
    epic: number
    legendary: number
  }
  economicAnalysis: {
    valuePerWeight: Array<{
      ingredient: string
      ratio: number
    }>
    mostValuable: Array<{
      ingredient: string
      value: number
    }>
  }
}
