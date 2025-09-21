import { useCallback, useMemo, useState } from 'react'
import type { AlchemyIngredientWithComputed } from '../types'

interface UseAlchemyPaginationOptions {
  initialPageSize?: number
  maxPageSize?: number
}

interface UseAlchemyPaginationReturn {
  // Pagination state
  currentPage: number
  pageSize: number
  totalPages: number
  hasMore: boolean
  hasPrevious: boolean

  // Pagination info
  paginationInfo: {
    totalItems: number
    displayedItems: number
    startIndex: number
    endIndex: number
    currentPage: number
    totalPages: number
  }

  // Pagination actions
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
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

  // Calculate pagination values
  const totalItems = ingredients.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const hasMore = currentPage < totalPages
  const hasPrevious = currentPage > 1

  // Get displayed items
  const displayedItems = useMemo(() => {
    return ingredients.slice(startIndex, endIndex)
  }, [ingredients, startIndex, endIndex])

  // Pagination info
  const paginationInfo = useMemo(
    () => ({
      totalItems,
      displayedItems: displayedItems.length,
      startIndex: startIndex + 1, // 1-based index for display
      endIndex,
      currentPage,
      totalPages,
    }),
    [
      totalItems,
      displayedItems.length,
      startIndex,
      endIndex,
      currentPage,
      totalPages,
    ]
  )

  // Pagination actions
  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(validPage)
    },
    [totalPages]
  )

  const nextPage = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore])

  const previousPage = useCallback(() => {
    if (hasPrevious) {
      setCurrentPage(prev => prev - 1)
    }
  }, [hasPrevious])

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

  // Reset pagination when ingredients change
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return {
    // Pagination state
    currentPage,
    pageSize,
    totalPages,
    hasMore,
    hasPrevious,

    // Pagination info
    paginationInfo,

    // Pagination actions
    goToPage,
    nextPage,
    previousPage,
    setPageSize: setPageSizeHandler,
    loadMore,
    resetPagination,

    // Displayed data
    displayedItems,
  }
}
