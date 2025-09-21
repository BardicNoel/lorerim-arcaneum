import { useMemo } from 'react'
import { AlchemyIngredientModel } from '../model/AlchemyIngredientModel'
import type { AlchemyIngredientWithComputed } from '../types'

interface UseFuzzySearchReturn {
  filteredIngredients: AlchemyIngredientWithComputed[]
  searchResults: Array<{
    ingredient: AlchemyIngredientWithComputed
    score: number
    matchedFields: string[]
  }>
  isSearching: boolean
  searchTerm: string
}

export function useFuzzySearch(
  ingredients: AlchemyIngredientWithComputed[],
  searchTerm: string
): UseFuzzySearchReturn {
  const { filteredIngredients, searchResults, isSearching } = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        filteredIngredients: ingredients,
        searchResults: [],
        isSearching: false,
      }
    }

    const results = AlchemyIngredientModel.search(ingredients, searchTerm)

    return {
      filteredIngredients: results.map(result => result.ingredient),
      searchResults: results,
      isSearching: true,
    }
  }, [ingredients, searchTerm])

  return {
    filteredIngredients,
    searchResults,
    isSearching,
    searchTerm,
  }
}
