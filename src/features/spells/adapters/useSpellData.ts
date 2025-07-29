import { useState, useEffect, useCallback } from 'react'
import { SpellDataProvider } from '../model/SpellDataProvider'
import type { SpellWithComputed, SpellDataResponse } from '../types'

interface UseSpellDataOptions {
  autoLoad?: boolean
  refreshOnMount?: boolean
}

interface UseSpellDataReturn {
  // Data
  spells: SpellWithComputed[]
  spellData: SpellDataResponse | null
  
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
  
  const [spells, setSpells] = useState<SpellWithComputed[]>([])
  const [spellData, setSpellData] = useState<SpellDataResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dataProvider = SpellDataProvider.getInstance()

  const loadSpells = useCallback(async () => {
    console.log('useSpellData: Starting to load spells...')
    setLoading(true)
    setError(null)
    
    try {
      const data = await dataProvider.getSpellData()
      console.log('useSpellData: Successfully loaded spells:', {
        spellsCount: data.spells.length,
        totalCount: data.totalCount,
        schools: data.schools,
        levels: data.levels,
        firstSpell: data.spells[0]
      })
      setSpells(data.spells)
      setSpellData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load spells'
      console.error('useSpellData: Error loading spells:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [dataProvider])

  const refresh = useCallback(async () => {
    console.log('useSpellData: Refreshing spells...')
    dataProvider.clearCache()
    await loadSpells()
  }, [dataProvider, loadSpells])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Load spells on mount if autoLoad is enabled
  useEffect(() => {
    console.log('useSpellData: useEffect triggered, autoLoad:', autoLoad)
    if (autoLoad) {
      loadSpells()
    }
  }, [autoLoad, loadSpells])

  // Refresh on mount if refreshOnMount is enabled
  useEffect(() => {
    if (refreshOnMount) {
      refresh()
    }
  }, [refreshOnMount, refresh])

  // Debug logging for state changes
  useEffect(() => {
    console.log('useSpellData: State changed:', {
      spellsLength: spells.length,
      loading,
      error,
      hasSpellData: !!spellData
    })
  }, [spells, loading, error, spellData])

  // Utility functions
  const getSpellByEditorId = useCallback((editorId: string): SpellWithComputed | undefined => {
    return spells.find(spell => spell.editorId === editorId)
  }, [spells])

  const getSpellsBySchool = useCallback((school: string): SpellWithComputed[] => {
    return spells.filter(spell => spell.school === school)
  }, [spells])

  const getSpellsByLevel = useCallback((level: string): SpellWithComputed[] => {
    return spells.filter(spell => spell.level === level)
  }, [spells])

  return {
    // Data
    spells,
    spellData,
    
    // State
    loading,
    error,
    
    // Computed
    totalCount: spellData?.totalCount || 0,
    schools: spellData?.schools || [],
    levels: spellData?.levels || [],
    lastUpdated: spellData?.lastUpdated || null,
    
    // Actions
    loadSpells,
    refresh,
    clearError,
    
    // Utilities
    getSpellByEditorId,
    getSpellsBySchool,
    getSpellsByLevel
  }
} 