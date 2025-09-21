import { useAlchemyStore } from '@/shared/stores/alchemyStore'
import { useCallback, useMemo } from 'react'
import type { AlchemyFilters, AlchemyIngredientWithComputed } from '../types'

interface UseAlchemyFiltersReturn {
  // Filter state
  filters: AlchemyFilters
  filteredIngredients: AlchemyIngredientWithComputed[]

  // Filter actions
  setFilters: (filters: Partial<AlchemyFilters>) => void
  clearFilters: () => void
  setSearchTerm: (searchTerm: string) => void
  setEffectTypes: (effectTypes: string[]) => void
  setEffects: (effects: string[]) => void
  setSkills: (skills: string[]) => void
  setPlugins: (plugins: string[]) => void
  setFlags: (flags: string[]) => void
  setRarities: (rarities: string[]) => void
  setHasEffects: (hasEffects: boolean | null) => void
  setIsComplex: (isComplex: boolean | null) => void
  setValueRange: (min: number | null, max: number | null) => void
  setWeightRange: (min: number | null, max: number | null) => void
  setMagnitudeRange: (min: number | null, max: number | null) => void
  setDurationRange: (min: number | null, max: number | null) => void
  setBaseCostRange: (min: number | null, max: number | null) => void

  // Filter utilities
  isFilterActive: boolean
  activeFilterCount: number
  getActiveFilters: () => Array<{ key: string; value: any; label: string }>
}

export function useAlchemyFilters(
  ingredients: AlchemyIngredientWithComputed[]
): UseAlchemyFiltersReturn {
  const { filters, filteredData, setFilters, clearFilters } = useAlchemyStore()

  // Filter actions
  const setSearchTerm = useCallback(
    (searchTerm: string) => {
      setFilters({ searchTerm })
    },
    [setFilters]
  )

  const setEffectTypes = useCallback(
    (effectTypes: string[]) => {
      setFilters({ effectTypes })
    },
    [setFilters]
  )

  const setEffects = useCallback(
    (effects: string[]) => {
      setFilters({ effects })
    },
    [setFilters]
  )

  const setSkills = useCallback(
    (skills: string[]) => {
      setFilters({ skills })
    },
    [setFilters]
  )

  const setPlugins = useCallback(
    (plugins: string[]) => {
      setFilters({ plugins })
    },
    [setFilters]
  )

  const setFlags = useCallback(
    (flags: string[]) => {
      setFilters({ flags })
    },
    [setFilters]
  )

  const setRarities = useCallback(
    (rarities: string[]) => {
      setFilters({ rarities })
    },
    [setFilters]
  )

  const setHasEffects = useCallback(
    (hasEffects: boolean | null) => {
      setFilters({ hasEffects })
    },
    [setFilters]
  )

  const setIsComplex = useCallback(
    (isComplex: boolean | null) => {
      setFilters({ isComplex })
    },
    [setFilters]
  )

  const setValueRange = useCallback(
    (min: number | null, max: number | null) => {
      setFilters({ minValue: min, maxValue: max })
    },
    [setFilters]
  )

  const setWeightRange = useCallback(
    (min: number | null, max: number | null) => {
      setFilters({ minWeight: min, maxWeight: max })
    },
    [setFilters]
  )

  const setMagnitudeRange = useCallback(
    (min: number | null, max: number | null) => {
      setFilters({ minMagnitude: min, maxMagnitude: max })
    },
    [setFilters]
  )

  const setDurationRange = useCallback(
    (min: number | null, max: number | null) => {
      setFilters({ minDuration: min, maxDuration: max })
    },
    [setFilters]
  )

  const setBaseCostRange = useCallback(
    (min: number | null, max: number | null) => {
      setFilters({ minBaseCost: min, maxBaseCost: max })
    },
    [setFilters]
  )

  // Filter utilities
  const isFilterActive = useMemo(() => {
    return (
      filters.searchTerm.trim() !== '' ||
      filters.effectTypes.length > 0 ||
      filters.effects.length > 0 ||
      filters.skills.length > 0 ||
      filters.plugins.length > 0 ||
      filters.flags.length > 0 ||
      filters.rarities.length > 0 ||
      filters.hasEffects !== null ||
      filters.isComplex !== null ||
      filters.minValue !== null ||
      filters.maxValue !== null ||
      filters.minWeight !== null ||
      filters.maxWeight !== null ||
      filters.minMagnitude !== null ||
      filters.maxMagnitude !== null ||
      filters.minDuration !== null ||
      filters.maxDuration !== null ||
      filters.minBaseCost !== null ||
      filters.maxBaseCost !== null
    )
  }, [filters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.searchTerm.trim() !== '') count++
    if (filters.effectTypes.length > 0) count++
    if (filters.effects.length > 0) count++
    if (filters.skills.length > 0) count++
    if (filters.plugins.length > 0) count++
    if (filters.flags.length > 0) count++
    if (filters.rarities.length > 0) count++
    if (filters.hasEffects !== null) count++
    if (filters.isComplex !== null) count++
    if (filters.minValue !== null || filters.maxValue !== null) count++
    if (filters.minWeight !== null || filters.maxWeight !== null) count++
    if (filters.minMagnitude !== null || filters.maxMagnitude !== null) count++
    if (filters.minDuration !== null || filters.maxDuration !== null) count++
    if (filters.minBaseCost !== null || filters.maxBaseCost !== null) count++
    return count
  }, [filters])

  const getActiveFilters = useCallback(() => {
    const activeFilters: Array<{ key: string; value: any; label: string }> = []

    if (filters.searchTerm.trim() !== '') {
      activeFilters.push({
        key: 'searchTerm',
        value: filters.searchTerm,
        label: `Search: "${filters.searchTerm}"`,
      })
    }

    if (filters.effectTypes.length > 0) {
      activeFilters.push({
        key: 'effectTypes',
        value: filters.effectTypes,
        label: `Effect Types: ${filters.effectTypes.join(', ')}`,
      })
    }

    if (filters.effects.length > 0) {
      activeFilters.push({
        key: 'effects',
        value: filters.effects,
        label: `Effects: ${filters.effects.join(', ')}`,
      })
    }

    if (filters.skills.length > 0) {
      activeFilters.push({
        key: 'skills',
        value: filters.skills,
        label: `Skills: ${filters.skills.join(', ')}`,
      })
    }

    if (filters.plugins.length > 0) {
      activeFilters.push({
        key: 'plugins',
        value: filters.plugins,
        label: `Plugins: ${filters.plugins.join(', ')}`,
      })
    }

    if (filters.flags.length > 0) {
      activeFilters.push({
        key: 'flags',
        value: filters.flags,
        label: `Flags: ${filters.flags.join(', ')}`,
      })
    }

    if (filters.rarities.length > 0) {
      activeFilters.push({
        key: 'rarities',
        value: filters.rarities,
        label: `Rarities: ${filters.rarities.join(', ')}`,
      })
    }

    if (filters.hasEffects !== null) {
      activeFilters.push({
        key: 'hasEffects',
        value: filters.hasEffects,
        label: `Has Effects: ${filters.hasEffects ? 'Yes' : 'No'}`,
      })
    }

    if (filters.isComplex !== null) {
      activeFilters.push({
        key: 'isComplex',
        value: filters.isComplex,
        label: `Complexity: ${filters.isComplex ? 'Complex' : 'Simple'}`,
      })
    }

    if (filters.minValue !== null || filters.maxValue !== null) {
      const range = `${filters.minValue ?? '0'} - ${filters.maxValue ?? '∞'}`
      activeFilters.push({
        key: 'valueRange',
        value: { min: filters.minValue, max: filters.maxValue },
        label: `Value: ${range}`,
      })
    }

    if (filters.minWeight !== null || filters.maxWeight !== null) {
      const range = `${filters.minWeight ?? '0'} - ${filters.maxWeight ?? '∞'}`
      activeFilters.push({
        key: 'weightRange',
        value: { min: filters.minWeight, max: filters.maxWeight },
        label: `Weight: ${range}`,
      })
    }

    if (filters.minMagnitude !== null || filters.maxMagnitude !== null) {
      const range = `${filters.minMagnitude ?? '0'} - ${filters.maxMagnitude ?? '∞'}`
      activeFilters.push({
        key: 'magnitudeRange',
        value: { min: filters.minMagnitude, max: filters.maxMagnitude },
        label: `Magnitude: ${range}`,
      })
    }

    if (filters.minDuration !== null || filters.maxDuration !== null) {
      const range = `${filters.minDuration ?? '0'} - ${filters.maxDuration ?? '∞'}`
      activeFilters.push({
        key: 'durationRange',
        value: { min: filters.minDuration, max: filters.maxDuration },
        label: `Duration: ${range}`,
      })
    }

    if (filters.minBaseCost !== null || filters.maxBaseCost !== null) {
      const range = `${filters.minBaseCost ?? '0'} - ${filters.maxBaseCost ?? '∞'}`
      activeFilters.push({
        key: 'baseCostRange',
        value: { min: filters.minBaseCost, max: filters.maxBaseCost },
        label: `Base Cost: ${range}`,
      })
    }

    return activeFilters
  }, [filters])

  return {
    // Filter state
    filters,
    filteredIngredients: filteredData,

    // Filter actions
    setFilters,
    clearFilters,
    setSearchTerm,
    setEffectTypes,
    setEffects,
    setSkills,
    setPlugins,
    setFlags,
    setRarities,
    setHasEffects,
    setIsComplex,
    setValueRange,
    setWeightRange,
    setMagnitudeRange,
    setDurationRange,
    setBaseCostRange,

    // Filter utilities
    isFilterActive,
    activeFilterCount,
    getActiveFilters,
  }
}
