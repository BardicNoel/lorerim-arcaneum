import { useMemo } from 'react'
import { RecipeModel } from '../model/RecipeModel'
import type { RecipeWithComputed, RecipeStatistics, SearchCategory, RecipeComparison } from '../types'

interface UseRecipeComputedOptions {
  enableStatistics?: boolean
  enableGrouping?: boolean
}

interface UseRecipeComputedReturn {
  // Statistics
  statistics: RecipeStatistics
  
  // Grouped data
  recipesByCategory: Record<string, RecipeWithComputed[]>
  recipesByDifficulty: Record<string, RecipeWithComputed[]>
  recipesByEffect: Record<string, RecipeWithComputed[]>
  recipesByIngredient: Record<string, RecipeWithComputed[]>
  
  // Available filter options
  availableCategories: string[]
  availableDifficulties: string[]
  availableEffects: string[]
  availableIngredients: string[]
  
  // Search categories
  searchCategories: SearchCategory[]
  
  // Utility functions
  compareRecipes: (recipe1: RecipeWithComputed, recipe2: RecipeWithComputed) => RecipeComparison
  getRecipeEfficiency: (recipe: RecipeWithComputed) => number
  getRecipeComplexity: (recipe: RecipeWithComputed) => number
}

export function useRecipeComputed(
  recipes: RecipeWithComputed[],
  options: UseRecipeComputedOptions = {}
): UseRecipeComputedReturn {
  const { enableStatistics = true, enableGrouping = true } = options

  // Ensure recipes is always an array
  const safeRecipes = Array.isArray(recipes) ? recipes : []

  // Statistics
  const statistics = useMemo(() => {
    if (!enableStatistics) {
      return {
        totalRecipes: 0,
        recipesByCategory: {},
        recipesByDifficulty: {},
        recipesByEffect: {},
        averageIngredientCount: 0,
        averageEffectCount: 0,
        mostCommonIngredients: [],
        mostCommonEffects: []
      }
    }
    return RecipeModel.getStatistics(safeRecipes)
  }, [safeRecipes, enableStatistics])

  // Grouped data
  const recipesByCategory = useMemo(() => {
    if (!enableGrouping) return {}
    
    const grouped: Record<string, RecipeWithComputed[]> = {}
    safeRecipes.forEach(recipe => {
      const category = recipe.category || 'Uncategorized'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(recipe)
    })
    return grouped
  }, [safeRecipes, enableGrouping])

  const recipesByDifficulty = useMemo(() => {
    if (!enableGrouping) return {}
    
    const grouped: Record<string, RecipeWithComputed[]> = {}
    safeRecipes.forEach(recipe => {
      const difficulty = recipe.difficulty
      if (!grouped[difficulty]) {
        grouped[difficulty] = []
      }
      grouped[difficulty].push(recipe)
    })
    return grouped
  }, [safeRecipes, enableGrouping])

  const recipesByEffect = useMemo(() => {
    if (!enableGrouping) return {}
    
    const grouped: Record<string, RecipeWithComputed[]> = {}
    safeRecipes.forEach(recipe => {
      recipe.effects.forEach(effect => {
        if (!grouped[effect.name]) {
          grouped[effect.name] = []
        }
        grouped[effect.name].push(recipe)
      })
    })
    return grouped
  }, [safeRecipes, enableGrouping])

  const recipesByIngredient = useMemo(() => {
    if (!enableGrouping) return {}
    
    const grouped: Record<string, RecipeWithComputed[]> = {}
    safeRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if (!grouped[ingredient]) {
          grouped[ingredient] = []
        }
        grouped[ingredient].push(recipe)
      })
    })
    return grouped
  }, [safeRecipes, enableGrouping])

  // Available filter options
  const availableCategories = useMemo(() => {
    return RecipeModel.getUniqueCategories(safeRecipes)
  }, [safeRecipes])

  const availableDifficulties = useMemo(() => {
    return RecipeModel.getUniqueDifficulties(safeRecipes)
  }, [safeRecipes])

  const availableEffects = useMemo(() => {
    return RecipeModel.getUniqueEffects(safeRecipes)
  }, [safeRecipes])

  const availableIngredients = useMemo(() => {
    return RecipeModel.getUniqueIngredients(safeRecipes)
  }, [safeRecipes])

  // Search categories
  const searchCategories = useMemo(() => {
    return [
      {
        name: 'Recipe Categories',
        options: availableCategories
      },
      {
        name: 'Effects',
        options: availableEffects
      },
      {
        name: 'Ingredients',
        options: availableIngredients
      },
      {
        name: 'Difficulty',
        options: availableDifficulties
      }
    ]
  }, [availableCategories, availableEffects, availableIngredients, availableDifficulties])

  // Utility functions
  const compareRecipes = useMemo(() => {
    return (recipe1: RecipeWithComputed, recipe2: RecipeWithComputed): RecipeComparison => {
      const ingredientCountDiff = recipe1.ingredientCount - recipe2.ingredientCount
      const effectCountDiff = recipe1.effectCount - recipe2.effectCount
      const magnitudeDiff = recipe1.totalMagnitude - recipe2.totalMagnitude
      const durationDiff = recipe1.maxDuration - recipe2.maxDuration

      // Find ingredient differences
      const ingredients1 = new Set(recipe1.ingredients)
      const ingredients2 = new Set(recipe2.ingredients)
      const commonIngredients = [...ingredients1].filter(ingredient => ingredients2.has(ingredient))
      const addedIngredients = [...ingredients1].filter(ingredient => !ingredients2.has(ingredient))
      const removedIngredients = [...ingredients2].filter(ingredient => !ingredients1.has(ingredient))

      // Find effect differences
      const effects1 = new Set(recipe1.effects.map(effect => effect.name))
      const effects2 = new Set(recipe2.effects.map(effect => effect.name))
      const commonEffects = [...effects1].filter(effect => effects2.has(effect))
      const addedEffects = [...effects1].filter(effect => !effects2.has(effect))
      const removedEffects = [...effects2].filter(effect => !effects1.has(effect))

      return {
        recipe1,
        recipe2,
        differences: {
          ingredientCount: {
            difference: ingredientCountDiff,
            percentage: recipe2.ingredientCount > 0 ? (ingredientCountDiff / recipe2.ingredientCount) * 100 : 0
          },
          effectCount: {
            difference: effectCountDiff,
            percentage: recipe2.effectCount > 0 ? (effectCountDiff / recipe2.effectCount) * 100 : 0
          },
          magnitude: {
            difference: magnitudeDiff,
            percentage: recipe2.totalMagnitude > 0 ? (magnitudeDiff / recipe2.totalMagnitude) * 100 : 0
          },
          duration: {
            difference: durationDiff,
            percentage: recipe2.maxDuration > 0 ? (durationDiff / recipe2.maxDuration) * 100 : 0
          },
          ingredients: {
            added: addedIngredients,
            removed: removedIngredients,
            common: commonIngredients
          },
          effects: {
            added: addedEffects,
            removed: removedEffects,
            common: commonEffects
          }
        }
      }
    }
  }, [])

  const getRecipeEfficiency = useMemo(() => {
    return (recipe: RecipeWithComputed): number => {
      // Calculate efficiency based on effects vs ingredients
      if (recipe.ingredientCount === 0) return 0
      
      const effectValue = recipe.totalMagnitude * recipe.maxDuration
      const ingredientCost = recipe.ingredientCount
      
      return effectValue / ingredientCost
    }
  }, [])

  const getRecipeComplexity = useMemo(() => {
    return (recipe: RecipeWithComputed): number => {
      // Calculate complexity score based on multiple factors
      let complexity = 0
      
      // Ingredient count factor
      complexity += recipe.ingredientCount * 0.3
      
      // Effect count factor
      complexity += recipe.effectCount * 0.4
      
      // Effect complexity factor
      complexity += recipe.effects.reduce((sum, effect) => {
        return sum + (effect.magnitude * effect.duration * 0.1)
      }, 0)
      
      // Difficulty factor
      switch (recipe.difficulty) {
        case 'Simple':
          complexity += 1
          break
        case 'Moderate':
          complexity += 2
          break
        case 'Complex':
          complexity += 3
          break
      }
      
      return Math.round(complexity * 10) / 10 // Round to 1 decimal place
    }
  }, [])

  return {
    // Statistics
    statistics,
    
    // Grouped data
    recipesByCategory,
    recipesByDifficulty,
    recipesByEffect,
    recipesByIngredient,
    
    // Available filter options
    availableCategories,
    availableDifficulties,
    availableEffects,
    availableIngredients,
    
    // Search categories
    searchCategories,
    
    // Utility functions
    compareRecipes,
    getRecipeEfficiency,
    getRecipeComplexity,
  }
} 