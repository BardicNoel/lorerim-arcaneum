import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { RecipeWithComputed } from '../types'

const ITEMS_PER_PAGE = 50

export function useRecipePagination(recipes: RecipeWithComputed[]) {
  const [currentPage, setCurrentPage] = useState(1)
  const previousRecipesRef = useRef<RecipeWithComputed[]>([])

  // Calculate displayed items directly from recipes and current page
  const displayedItems = useMemo(() => {
    const itemsToShow = currentPage * ITEMS_PER_PAGE
    return recipes.slice(0, itemsToShow)
  }, [recipes, currentPage])

  // Reset to page 1 only when the actual recipe content changes, not just the reference
  useEffect(() => {
    const previousRecipes = previousRecipesRef.current
    
    // Check if the actual content has changed (not just the reference)
    const hasContentChanged = 
      previousRecipes.length !== recipes.length ||
      recipes.some((recipe, index) => recipe.name !== previousRecipes[index]?.name)
    
    if (hasContentChanged) {
      setCurrentPage(1)
      previousRecipesRef.current = recipes
    }
  }, [recipes])

  // Check if there are more items to load
  const hasMore = useMemo(() => {
    return displayedItems.length < recipes.length
  }, [displayedItems.length, recipes.length])

  // Load more items
  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore])

  // Manual reset function
  const resetPagination = useCallback(() => {
    setCurrentPage(1)
  }, [])

  // Get pagination info
  const paginationInfo = useMemo(() => ({
    displayedItems: displayedItems.length,
    totalItems: recipes.length,
    hasMore,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  }), [displayedItems.length, recipes.length, hasMore, currentPage])

  return {
    displayedItems,
    loadMore,
    resetPagination,
    paginationInfo,
    hasMore
  }
}
