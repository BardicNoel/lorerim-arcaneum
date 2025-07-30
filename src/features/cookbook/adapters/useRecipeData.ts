import { useCallback, useEffect } from 'react'
import { useRecipesStore } from '@/shared/stores/recipesStore'
import type { RecipeWithComputed } from '../types'

interface UseRecipeDataOptions {
  autoLoad?: boolean
  refreshOnMount?: boolean
}

interface UseRecipeDataReturn {
  // Data
  recipes: RecipeWithComputed[]
  recipeData: {
    recipes: RecipeWithComputed[]
    totalCount: number
    categories: string[]
    effects: string[]
    ingredients: string[]
    lastUpdated: string
  } | null
  
  // State
  loading: boolean
  error: string | null
  
  // Computed
  totalCount: number
  categories: string[]
  effects: string[]
  ingredients: string[]
  lastUpdated: string | null
  
  // Actions
  loadRecipes: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
  
  // Utilities
  getRecipeByName: (name: string) => RecipeWithComputed | undefined
  getRecipesByCategory: (category: string) => RecipeWithComputed[]
  getRecipesByDifficulty: (difficulty: string) => RecipeWithComputed[]
  getRecipesByIngredient: (ingredient: string) => RecipeWithComputed[]
  getRecipesByEffect: (effect: string) => RecipeWithComputed[]
}

export function useRecipeData(options: UseRecipeDataOptions = {}): UseRecipeDataReturn {
  const { autoLoad = true, refreshOnMount = false } = options
  
  // Use the Zustand store
  const { data: recipes, loading, error, load } = useRecipesStore()

  // Load recipes on mount if autoLoad is enabled
  const loadRecipes = useCallback(async () => {
    if (autoLoad && recipes.length === 0) {
      await load()
    }
  }, [autoLoad, recipes.length, load])

  const refresh = useCallback(async () => {
    // For now, just reload the data
    await load()
  }, [load])

  const clearError = useCallback(() => {
    // Note: Zustand stores don't have a clearError method by default
    // This would need to be added to the store if needed
  }, [])

  // Load recipes on mount if autoLoad is enabled
  useEffect(() => {
    if (autoLoad && recipes.length === 0) {
      loadRecipes()
    }
  }, [autoLoad, recipes.length, loadRecipes])

  // Refresh on mount if refreshOnMount is enabled
  useEffect(() => {
    if (refreshOnMount) {
      refresh()
    }
  }, [refreshOnMount, refresh])

  // Compute derived data
  const totalCount = recipes.length
  const categories = [...new Set(recipes.map(recipe => recipe.category).filter(Boolean))]
  const effects = [...new Set(recipes.flatMap(recipe => recipe.effects.map(effect => effect.name)))]
  const ingredients = [...new Set(recipes.flatMap(recipe => recipe.ingredients))]
  const lastUpdated = new Date().toISOString()

  const recipeData = recipes.length > 0 ? {
    recipes,
    totalCount,
    categories,
    effects,
    ingredients,
    lastUpdated,
  } : null

  // Utility functions using store methods
  const getRecipeByName = useCallback((name: string) => {
    return useRecipesStore.getState().getByName(name)
  }, [])

  const getRecipesByCategory = useCallback((category: string) => {
    return useRecipesStore.getState().getByCategory(category)
  }, [])

  const getRecipesByDifficulty = useCallback((difficulty: string) => {
    return useRecipesStore.getState().getByDifficulty(difficulty)
  }, [])

  const getRecipesByIngredient = useCallback((ingredient: string) => {
    return useRecipesStore.getState().getByIngredient(ingredient)
  }, [])

  const getRecipesByEffect = useCallback((effect: string) => {
    return useRecipesStore.getState().getByEffect(effect)
  }, [])

  return {
    // Data
    recipes,
    recipeData,
    
    // State
    loading,
    error,
    
    // Computed
    totalCount,
    categories,
    effects,
    ingredients,
    lastUpdated,
    
    // Actions
    loadRecipes,
    refresh,
    clearError,
    
    // Utilities
    getRecipeByName,
    getRecipesByCategory,
    getRecipesByDifficulty,
    getRecipesByIngredient,
    getRecipesByEffect,
  }
} 