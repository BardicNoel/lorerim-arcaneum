import Fuse from 'fuse.js'
import { useMemo } from 'react'
import type { RecipeWithComputed } from '../types'

interface SearchableRecipe {
  id: string
  name: string
  output: string
  description: string
  ingredients: string[]
  effects: string[]
  category: string
  difficulty: string
  type: string
  originalRecipe: RecipeWithComputed
}

/**
 * Hook for fuzzy searching through recipe data using Fuse.js
 */
export function useFuzzySearch(recipes: RecipeWithComputed[], searchQuery: string) {
  // Create searchable recipe objects
  const searchableRecipes = useMemo(() => {
    return recipes.map(recipe => ({
      id: recipe.name.toLowerCase().replace(/\s+/g, '-'),
      name: recipe.name,
      output: recipe.output,
      description: recipe.description || '',
      ingredients: recipe.ingredients,
      effects: recipe.effects.map(effect => effect.name),
      category: recipe.category || '',
      difficulty: recipe.difficulty || '',
      type: recipe.type || '',
      originalRecipe: recipe,
    }))
  }, [recipes])

  // Configure Fuse.js options
  const fuseOptions = useMemo(
    () => ({
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'output', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'ingredients', weight: 0.15 },
        { name: 'effects', weight: 0.15 },
        { name: 'category', weight: 0.1 },
        { name: 'difficulty', weight: 0.05 },
        { name: 'type', weight: 0.05 },
      ],
      threshold: 0.3, // Lower threshold = more strict matching
      includeScore: true,
      includeMatches: true,
    }),
    []
  )

  // Create Fuse instance
  const fuse = useMemo(() => {
    return new Fuse(searchableRecipes, fuseOptions)
  }, [searchableRecipes, fuseOptions])

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return searchableRecipes.map(recipe => ({
        item: recipe,
        score: 0,
        matches: [],
      }))
    }

    return fuse.search(searchQuery)
  }, [fuse, searchQuery])

  // Return filtered recipes based on search results
  const filteredRecipes = useMemo(() => {
    return searchResults.map(result => result.item.originalRecipe)
  }, [searchResults])

  return {
    filteredRecipes,
    searchResults,
    searchableRecipes,
  }
} 