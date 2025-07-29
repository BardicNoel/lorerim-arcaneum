import { useState, useCallback } from 'react'

interface UseSpellStateReturn {
  selectedSpell: string | null
  viewMode: 'grid' | 'list' | 'accordion'
  expandedSections: Set<string>
  setSelectedSpell: (spellId: string | null) => void
  setViewMode: (mode: 'grid' | 'list' | 'accordion') => void
  toggleExpandedSection: (sectionId: string) => void
  addExpandedSection: (sectionId: string) => void
  removeExpandedSection: (sectionId: string) => void
  clearExpandedSections: () => void
}

export function useSpellState(): UseSpellStateReturn {
  const [selectedSpell, setSelectedSpell] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'accordion'>('grid')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleExpandedSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }, [])

  const addExpandedSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      newSet.add(sectionId)
      return newSet
    })
  }, [])

  const removeExpandedSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      newSet.delete(sectionId)
      return newSet
    })
  }, [])

  const clearExpandedSections = useCallback(() => {
    setExpandedSections(new Set())
  }, [])

  return {
    selectedSpell,
    viewMode,
    expandedSections,
    setSelectedSpell,
    setViewMode,
    toggleExpandedSection,
    addExpandedSection,
    removeExpandedSection,
    clearExpandedSections,
  }
}