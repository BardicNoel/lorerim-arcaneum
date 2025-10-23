import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AlchemyIngredientWithComputed } from '../types'

interface UseAlchemyPaginationOptions {
  initialPageSize?: number
  maxPageSize?: number
}

interface UseAlchemyPaginationReturn {
  // Pagination state
  currentPage: number
  pageSize: number
  hasMore: boolean
  hasPrevious: boolean

  // Pagination info
  paginationInfo: {
    totalItems: number
    displayedItems: number
    currentPage: number
    hasMore: boolean
    itemsPerPage: number
  }

  // Pagination actions
  setPageSize: (size: number) => void
  loadMore: () => void
  resetPagination: () => void

  // Displayed data
  displayedItems: AlchemyIngredientWithComputed[]
}

export function useAlchemyPagination(
  ingredients: AlchemyIngredientWithComputed[],
  options: UseAlchemyPaginationOptions = {}
): UseAlchemyPaginationReturn {
  const { initialPageSize = 20, maxPageSize = 100 } = options

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const previousIngredientsRef = useRef<AlchemyIngredientWithComputed[]>([])

  // Calculate pagination values
  const totalItems = ingredients.length

  // Get displayed items using accumulative pattern
  const displayedItems = useMemo(() => {
    const itemsToShow = currentPage * pageSize
    return ingredients.slice(0, itemsToShow)
  }, [ingredients, currentPage, pageSize])

  // Check if there are more items to load
  const hasMore = useMemo(() => {
    return displayedItems.length < ingredients.length
  }, [displayedItems.length, ingredients.length])

  const hasPrevious = currentPage > 1

  // Reset to page 1 only when the actual ingredient content changes
  useEffect(() => {
    const previousIngredients = previousIngredientsRef.current

    // Check if the actual content has changed (not just the reference)
    const hasContentChanged =
      previousIngredients.length !== ingredients.length ||
      ingredients.some(
        (ing, index) => ing.name !== previousIngredients[index]?.name
      )

    if (hasContentChanged) {
      setCurrentPage(1)
      previousIngredientsRef.current = ingredients
    }
  }, [ingredients])

  // Pagination info
  const paginationInfo = useMemo(
    () => ({
      totalItems,
      displayedItems: displayedItems.length,
      currentPage,
      hasMore,
      itemsPerPage: pageSize,
    }),
    [totalItems, displayedItems.length, currentPage, hasMore, pageSize]
  )

  // Pagination actions
  const setPageSizeHandler = useCallback(
    (size: number) => {
      const validSize = Math.max(1, Math.min(size, maxPageSize))
      setPageSize(validSize)
      // Reset to first page when page size changes
      setCurrentPage(1)
    },
    [maxPageSize]
  )

  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore])

  const resetPagination = useCallback(() => {
    setCurrentPage(1)
    setPageSize(initialPageSize)
  }, [initialPageSize])

  return {
    // Pagination state
    currentPage,
    pageSize,
    hasMore,
    hasPrevious,

    // Pagination info
    paginationInfo,

    // Pagination actions
    setPageSize: setPageSizeHandler,
    loadMore,
    resetPagination,

    // Displayed data
    displayedItems,
  }
}
