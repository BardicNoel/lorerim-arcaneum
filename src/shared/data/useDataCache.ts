// src/shared/data/useDataCache.ts
// React hooks for the cache-mapped data loader

import { useState, useEffect, useCallback } from 'react'
import {
  loadDataset,
  getDataset,
  isCached,
  isLoading,
  type DatasetMap,
} from './dataCache'

// Hook state interface
interface UseDatasetState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Hook for loading and accessing a dataset
 * @param name Dataset name
 * @returns Object with data, loading state, error, and reload function
 */
export function useDataset<K extends keyof DatasetMap>(name: K) {
  const [state, setState] = useState<UseDatasetState<DatasetMap[K]>>({
    data: null,
    loading: false,
    error: null,
  })

  const loadData = useCallback(async () => {
    // If already cached, return immediately
    if (isCached(name)) {
      try {
        const data = getDataset(name)
        setState({ data, loading: false, error: null })
        return
      } catch (error) {
        setState(prev => ({ ...prev, error: 'Failed to get cached data' }))
        return
      }
    }

    // If already loading, don't start another load
    if (isLoading(name)) {
      setState(prev => ({ ...prev, loading: true }))
      return
    }

    // Start loading
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const data = await loadDataset(name)
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load data',
      })
    }
  }, [name])

  const reload = useCallback(() => {
    loadData()
  }, [loadData])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    ...state,
    reload,
  }
}

/**
 * Hook for accessing a dataset that must be pre-loaded
 * @param name Dataset name
 * @returns The dataset (throws if not loaded)
 */
export function useDatasetSync<K extends keyof DatasetMap>(name: K): DatasetMap[K] {
  const [data, setData] = useState<DatasetMap[K] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isCached(name)) {
      try {
        const cachedData = getDataset(name)
        setData(cachedData)
        setError(null)
      } catch (err) {
        setError('Failed to get cached data')
      }
    } else {
      setError(`Dataset "${name}" not loaded. Call loadDataset("${name}") first.`)
    }
  }, [name])

  if (error) {
    throw new Error(error)
  }

  if (!data) {
    throw new Error(`Dataset "${name}" not available`)
  }

  return data
}

// Convenience hooks for specific datasets
export function useTraits() {
  return useDataset('traits')
}

export function useSkills() {
  return useDataset('skills')
}

export function useRaces() {
  return useDataset('races')
}

export function useReligions() {
  return useDataset('religions')
}

export function useBirthsigns() {
  return useDataset('birthsigns')
}

export function useDestinyNodes() {
  return useDataset('destinyNodes')
}

export function usePerkTrees() {
  return useDataset('perkTrees')
}

// Synchronous convenience hooks (for when you know data is pre-loaded)
export function useTraitsSync() {
  return useDatasetSync('traits')
}

export function useSkillsSync() {
  return useDatasetSync('skills')
}

export function useRacesSync() {
  return useDatasetSync('races')
}

export function useReligionsSync() {
  return useDatasetSync('religions')
}

export function useBirthsignsSync() {
  return useDatasetSync('birthsigns')
}

export function useDestinyNodesSync() {
  return useDatasetSync('destinyNodes')
}

export function usePerkTreesSync() {
  return useDatasetSync('perkTrees')
} 