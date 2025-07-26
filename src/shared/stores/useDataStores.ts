// Convenience hooks for accessing data stores
// These provide the same API as the old useDataCache.ts

import { useBirthsignsStore } from './birthsignsStore'
import { useDestinyNodesStore } from './destinyNodesStore'
import { usePerkTreesStore } from './perkTreesStore'
import { useRacesStore } from './racesStore'
import { useReligionsStore } from './religionsStore'
import { useSkillsStore } from './skillsStore'
import { useTraitsStore } from './traitsStore'

// Hook state interface (matches old useDataCache pattern)
interface UseDatasetState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Hook for accessing skills data
 */
export function useSkills() {
  const { data, loading, error } = useSkillsStore()

  return {
    data: data.length > 0 ? data : null,
    loading,
    error,
  }
}

/**
 * Hook for accessing races data
 */
export function useRaces() {
  const { data, loading, error } = useRacesStore()

  return {
    data: data.length > 0 ? data : null,
    loading,
    error,
  }
}

/**
 * Hook for accessing traits data
 */
export function useTraits() {
  const { data, loading, error } = useTraitsStore()

  return {
    data: data.length > 0 ? data : null,
    loading,
    error,
  }
}

/**
 * Hook for accessing religions data
 */
export function useReligions() {
  const { data, loading, error } = useReligionsStore()

  return {
    data: data.length > 0 ? data : null,
    loading,
    error,
  }
}

/**
 * Hook for accessing birthsigns data
 */
export function useBirthsigns() {
  const { data, loading, error } = useBirthsignsStore()

  return {
    data: data.length > 0 ? data : null,
    loading,
    error,
  }
}

/**
 * Hook for accessing destiny nodes data
 */
export function useDestinyNodes() {
  const { data, loading, error } = useDestinyNodesStore()

  return {
    data: data.length > 0 ? data : null,
    loading,
    error,
  }
}

/**
 * Hook for accessing perk trees data
 */
export function usePerkTrees() {
  const { data, loading, error } = usePerkTreesStore()

  return {
    data: data.length > 0 ? data : null,
    loading,
    error,
  }
}

// Synchronous hooks for when you know data is loaded
export function useSkillsSync() {
  const { data } = useSkillsStore()
  if (data.length === 0) {
    throw new Error('Skills data not loaded. Call loadAllData() first.')
  }
  return data
}

export function useRacesSync() {
  const { data } = useRacesStore()
  if (data.length === 0) {
    throw new Error('Races data not loaded. Call loadAllData() first.')
  }
  return data
}

export function useTraitsSync() {
  const { data } = useTraitsStore()
  if (data.length === 0) {
    throw new Error('Traits data not loaded. Call loadAllData() first.')
  }
  return data
}

export function useReligionsSync() {
  const { data } = useReligionsStore()
  if (data.length === 0) {
    throw new Error('Religions data not loaded. Call loadAllData() first.')
  }
  return data
}

export function useBirthsignsSync() {
  const { data } = useBirthsignsStore()
  if (data.length === 0) {
    throw new Error('Birthsigns data not loaded. Call loadAllData() first.')
  }
  return data
}

export function useDestinyNodesSync() {
  const { data } = useDestinyNodesStore()
  if (data.length === 0) {
    throw new Error('Destiny nodes data not loaded. Call loadAllData() first.')
  }
  return data
}

export function usePerkTreesSync() {
  const { data } = usePerkTreesStore()
  if (data.length === 0) {
    throw new Error('Perk trees data not loaded. Call loadAllData() first.')
  }
  return data
}
