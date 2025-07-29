import { useState, useCallback } from 'react'

interface UseSpellStateReturn {
  selectedSpell: string | null
  viewMode: 'grid' | 'list'
  setSelectedSpell: (spellId: string | null) => void
  setViewMode: (mode: 'grid' | 'list') => void
}

export function useSpellState(): UseSpellStateReturn {
  const [selectedSpell, setSelectedSpell] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return {
    selectedSpell,
    viewMode,
    setSelectedSpell,
    setViewMode,
  }
}