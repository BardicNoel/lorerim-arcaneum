import { useMemo } from 'react'
import type { RecipeWithComputed } from '../types'

/**
 * Hook for fuzzy searching through recipe data
 * This is a simple string-based search that searches across all recipe fields
 */
export function useFuzzySearch(recipes: RecipeWithComputed[], searchQuery: string) {
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) {
      return recipes
    }

    const query = searchQuery.toLowerCase().trim()
    const searchTerms = query.split(/\s+/)

    return recipes.filter(recipe => {
      // Create a searchable text string from all recipe fields
      const searchableText = [
        recipe.name,
        recipe.output,
        recipe.description || '',
        ...recipe.ingredients.map(ingredient => {
          if (typeof ingredient === 'string') {
            return ingredient
          }
          if (ingredient && typeof ingredient === 'object') {
            return ingredient.name || ingredient.label || ingredient.id || String(ingredient)
          }
          return String(ingredient)
        }),
        ...recipe.effects.map(effect => effect.name),
        ...recipe.effects.map(effect => effect.description),
        recipe.category || '',
        recipe.difficulty || '',
        recipe.type || '',
        ...recipe.tags
      ].join(' ').toLowerCase()

      // Check if all search terms are found in the searchable text
      return searchTerms.every(term => searchableText.includes(term))
    })
  }, [recipes, searchQuery])

  return {
    filteredRecipes,
    searchQuery: searchQuery.trim()
  }
} 