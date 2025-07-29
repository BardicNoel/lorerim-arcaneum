import { useCallback, useEffect } from 'react'
import { useSpellsStore } from '@/shared/stores/spellsStore'
import type { SpellWithComputed } from '../types'

interface UseSpellDataOptions {
  autoLoad?: boolean
  refreshOnMount?: boolean
}

interface UseSpellDataReturn {
  // Data
  spells: SpellWithComputed[]
  spellData: {
    spells: SpellWithComputed[]
    totalCount: number
    schools: string[]
    levels: string[]
    lastUpdated: string
  } | null
  
  // State
  loading: boolean
  error: string | null
  
  // Computed
  totalCount: number
  schools: string[]
  levels: string[]
  lastUpdated: string | null
  
  // Actions
  loadSpells: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void
  
  // Utilities
  getSpellByEditorId: (editorId: string) => SpellWithComputed | undefined
  getSpellsBySchool: (school: string) => SpellWithComputed[]
  getSpellsByLevel: (level: string) => SpellWithComputed[]
}

export function useSpellData(options: UseSpellDataOptions = {}): UseSpellDataReturn {
  const { autoLoad = true, refreshOnMount = false } = options
  
  // Use the Zustand store
  const { data: spells, loading, error, load } = useSpellsStore()

  // Load spells on mount if autoLoad is enabled
  const loadSpells = useCallback(async () => {
    if (autoLoad && spells.length === 0) {
      await load()
    }
  }, [autoLoad, spells.length, load])

  const refresh = useCallback(async () => {
    // For now, just reload the data
    await load()
  }, [load])

  const clearError = useCallback(() => {
    // Note: Zustand stores don't have a clearError method by default
    // This would need to be added to the store if needed
  }, [])

  // Load spells on mount if autoLoad is enabled
  useEffect(() => {
    if (autoLoad && spells.length === 0) {
      loadSpells()
    }
  }, [autoLoad, spells.length, loadSpells])

  // Refresh on mount if refreshOnMount is enabled
  useEffect(() => {
    if (refreshOnMount) {
      refresh()
    }
  }, [refreshOnMount, refresh])

  // Compute derived data
  const totalCount = spells.length
  const schools = [...new Set(spells.map(spell => spell.school).filter(Boolean))]
  const levels = [...new Set(spells.map(spell => spell.level).filter(Boolean))]
  const lastUpdated = new Date().toISOString()

  const spellData = spells.length > 0 ? {
    spells,
    totalCount,
    schools,
    levels,
    lastUpdated,
  } : null

  // Utility functions using store methods
  const getSpellByEditorId = useCallback((editorId: string) => {
    return useSpellsStore.getState().getByEditorId(editorId)
  }, [])

  const getSpellsBySchool = useCallback((school: string) => {
    return useSpellsStore.getState().getBySchool(school)
  }, [])

  const getSpellsByLevel = useCallback((level: string) => {
    return useSpellsStore.getState().getByLevel(level)
  }, [])

  return {
    spells,
    spellData,
    loading,
    error,
    totalCount,
    schools,
    levels,
    lastUpdated,
    loadSpells,
    refresh,
    clearError,
    getSpellByEditorId,
    getSpellsBySchool,
    getSpellsByLevel,
  }
} 