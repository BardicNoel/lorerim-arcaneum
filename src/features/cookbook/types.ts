// Recipe data structure based on cookbook-wiki.json
export interface RecipeEffect {
  name: string
  description: string
  magnitude: number
  duration: number
  area?: number
}

// Ingredient can be either a string or an object with name/label/id
export interface RecipeIngredient {
  name?: string
  label?: string
  id?: string
  [key: string]: any // Allow other properties
}

export interface Recipe {
  name: string
  output: string
  ingredients: (string | RecipeIngredient)[]
  effects: RecipeEffect[]
  category?: string
  difficulty?: string
  description?: string
  type?: 'food' | 'alcohol' // Indicates if this is a food or alcohol recipe
}

// Computed recipe properties for enhanced functionality
export interface RecipeWithComputed extends Recipe {
  // Computed fields
  hasEffects: boolean
  effectCount: number
  ingredientCount: number
  isComplex: boolean
  isSimple: boolean
  totalMagnitude: number
  maxDuration: number
  tags: string[]
  searchableText: string
  difficulty: 'Simple' | 'Moderate' | 'Complex'
}

// Filter and search types
export interface RecipeFilters {
  categories: string[]
  effects: string[]
  ingredients: string[]
  difficulties: string[]
  searchTerm: string
  hasEffects: boolean | null
  isComplex: boolean | null
  minIngredientCount: number | null
  maxIngredientCount: number | null
  minMagnitude: number | null
  maxMagnitude: number | null
}

export interface RecipeSearchResult {
  recipe: RecipeWithComputed
  score: number
  matchedFields: string[]
}

// View state types
export interface RecipeViewState {
  viewMode: 'grid' | 'list'
  sortBy: 'name' | 'category' | 'difficulty' | 'ingredientCount' | 'effectCount' | 'magnitude' | 'duration'
  sortOrder: 'asc' | 'desc'
  selectedRecipes: string[]
  expandedRecipes: string[]
}

// Recipe comparison types
export interface RecipeComparison {
  recipe1: RecipeWithComputed
  recipe2: RecipeWithComputed
  differences: {
    ingredientCount: { difference: number; percentage: number }
    effectCount: { difference: number; percentage: number }
    magnitude: { difference: number; percentage: number }
    duration: { difference: number; percentage: number }
    ingredients: { added: string[]; removed: string[]; common: string[] }
    effects: { added: string[]; removed: string[]; common: string[] }
  }
}

// Recipe build integration types
export interface RecipeBuildItem {
  recipeId: string
  recipeName: string
  category: string
  difficulty: string
  ingredientCount: number
  isSelected: boolean
}

// Statistics types
export interface RecipeStatistics {
  totalRecipes: number
  foodRecipes: number
  alcoholRecipes: number
  recipesByCategory: Record<string, number>
  recipesByDifficulty: Record<string, number>
  recipesByEffect: Record<string, number>
  averageIngredientCount: number
  averageEffectCount: number
  averageMagnitude: number
  averageDuration: number
  topEffects: Array<{ name: string; count: number }>
  topIngredients: Array<{ name: string; count: number }>
}

// Search category types
export interface SearchCategory {
  name: string
  options: string[]
}

// API response types
export interface RecipeDataResponse {
  recipes: Recipe[]
  totalCount: number
  categories: string[]
  effects: string[]
  ingredients: string[]
  lastUpdated: string
}

// Error types
export interface RecipeError {
  code: string
  message: string
  details?: unknown
} 