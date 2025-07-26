import { useState, useCallback } from 'react'

export type ViewMode = 'grid' | 'list'

interface UseRaceStateReturn {
  // State
  selectedRace: string | null
  viewMode: ViewMode
  expandedSections: string[]

  // Actions
  setSelectedRace: (id: string | null) => void
  setViewMode: (mode: ViewMode) => void
  toggleExpandedSection: (section: string) => void
  clearExpandedSections: () => void
  expandAllSections: (sections: string[]) => void
}

export function useRaceState(): UseRaceStateReturn {
  const [selectedRace, setSelectedRaceState] = useState<string | null>(null)
  const [viewMode, setViewModeState] = useState<ViewMode>('grid')
  const [expandedSections, setExpandedSectionsState] = useState<string[]>([])

  // Selected race actions
  const setSelectedRace = useCallback((id: string | null) => {
    setSelectedRaceState(id)
  }, [])

  // View mode actions
  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode)
  }, [])

  // Expanded sections actions
  const toggleExpandedSection = useCallback((section: string) => {
    setExpandedSectionsState(prev => {
      if (prev.includes(section)) {
        return prev.filter(s => s !== section)
      } else {
        return [...prev, section]
      }
    })
  }, [])

  const clearExpandedSections = useCallback(() => {
    setExpandedSectionsState([])
  }, [])

  const expandAllSections = useCallback((sections: string[]) => {
    setExpandedSectionsState(sections)
  }, [])

  return {
    // State
    selectedRace,
    viewMode,
    expandedSections,

    // Actions
    setSelectedRace,
    setViewMode,
    toggleExpandedSection,
    clearExpandedSections,
    expandAllSections,
  }
} 