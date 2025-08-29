import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import type { SpellWithComputed } from '../types'

const ITEMS_PER_PAGE = 50

export function useSpellPagination(spells: SpellWithComputed[]) {
  const [currentPage, setCurrentPage] = useState(1)
  const previousSpellsRef = useRef<SpellWithComputed[]>([])

  // Calculate displayed items directly from spells and current page
  const displayedItems = useMemo(() => {
    const itemsToShow = currentPage * ITEMS_PER_PAGE
    return spells.slice(0, itemsToShow)
  }, [spells, currentPage])

  // Reset to page 1 only when the actual spell content changes, not just the reference
  useEffect(() => {
    const previousSpells = previousSpellsRef.current
    
    // Check if the actual content has changed (not just the reference)
    const hasContentChanged = 
      previousSpells.length !== spells.length ||
      spells.some((spell, index) => spell.name !== previousSpells[index]?.name)
    
    if (hasContentChanged) {
      setCurrentPage(1)
      previousSpellsRef.current = spells
    }
  }, [spells])

  // Check if there are more items to load
  const hasMore = useMemo(() => {
    return displayedItems.length < spells.length
  }, [displayedItems.length, spells.length])

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
    totalItems: spells.length,
    hasMore,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE
  }), [displayedItems.length, spells.length, hasMore, currentPage])

  return {
    displayedItems,
    loadMore,
    resetPagination,
    paginationInfo,
    hasMore
  }
}
