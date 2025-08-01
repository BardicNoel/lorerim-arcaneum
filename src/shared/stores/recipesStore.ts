import type { RecipeWithComputed } from '@/features/cookbook/types'
import { RecipeDataProvider } from '@/features/cookbook/model/RecipeDataProvider'
import { create } from 'zustand'

interface RecipesStore {
  // Data
  data: RecipeWithComputed[]

  // Loading states
  loading: boolean
  error: string | null

  // Actions
  load: () => Promise<void>

  // Computed
  getById: (id: string) => RecipeWithComputed | undefined
  getByName: (name: string) => RecipeWithComputed | undefined
  search: (query: string) => RecipeWithComputed[]
  getByCategory: (category: string) => RecipeWithComputed[]
  getByDifficulty: (difficulty: string) => RecipeWithComputed[]
  getByIngredient: (ingredient: string) => RecipeWithComputed[]
  getByEffect: (effect: string) => RecipeWithComputed[]
}

export const useRecipesStore = create<RecipesStore>((set, get) => ({
  // Initial state
  data: [],
  loading: false,
  error: null,

  // Actions
  load: async () => {
    const state = get()

    // Return if already loaded
    if (state.data.length > 0) {
      return
    }

    set({ loading: true, error: null })

    try {
      const recipeDataProvider = RecipeDataProvider.getInstance()
      const recipes = await recipeDataProvider.loadRecipes()

      set({
        data: recipes,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load recipes',
        loading: false,
      })
    }
  },

  // Computed
  getById: (id: string) => {
    const state = get()
    return state.data.find(recipe => recipe.name === id) // Using name as ID for now
  },

  getByName: (name: string) => {
    const state = get()
    return state.data.find(recipe => recipe.name === name)
  },

  search: (query: string) => {
    const state = get()
    const lowerQuery = query.toLowerCase()
    return state.data.filter(
      recipe =>
        recipe.name.toLowerCase().includes(lowerQuery) ||
        recipe.output.toLowerCase().includes(lowerQuery) ||
        recipe.description?.toLowerCase().includes(lowerQuery) ||
        recipe.category?.toLowerCase().includes(lowerQuery) ||
        recipe.difficulty?.toLowerCase().includes(lowerQuery) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        recipe.ingredients?.some(ingredient => 
          ingredient.toLowerCase().includes(lowerQuery)
        ) ||
        recipe.effects?.some(effect => 
          effect.name.toLowerCase().includes(lowerQuery) ||
          effect.description?.toLowerCase().includes(lowerQuery)
        )
    )
  },

  getByCategory: (category: string) => {
    const state = get()
    return state.data.filter(recipe => recipe.category === category)
  },

  getByDifficulty: (difficulty: string) => {
    const state = get()
    return state.data.filter(recipe => recipe.difficulty === difficulty)
  },

  getByIngredient: (ingredient: string) => {
    const state = get()
    return state.data.filter(recipe => 
      recipe.ingredients.some(recipeIngredient => 
        recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
      )
    )
  },

  getByEffect: (effect: string) => {
    const state = get()
    return state.data.filter(recipe => 
      recipe.effects.some(recipeEffect => 
        recipeEffect.name.toLowerCase().includes(effect.toLowerCase())
      )
    )
  },
})) 