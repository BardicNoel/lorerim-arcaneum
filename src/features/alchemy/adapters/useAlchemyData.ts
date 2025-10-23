import { useAlchemyStore } from '@/shared/stores/alchemyStore'
import { useCallback, useEffect } from 'react'
import type { AlchemyIngredientWithComputed } from '../types'

interface UseAlchemyDataOptions {
  autoLoad?: boolean
  refreshOnMount?: boolean
}

interface UseAlchemyDataReturn {
  // Data
  ingredients: AlchemyIngredientWithComputed[]
  ingredientData: {
    ingredients: AlchemyIngredientWithComputed[]
    totalCount: number
    effectTypes: string[]
    effects: string[]
    skills: string[]
    plugins: string[]
    lastUpdated: string
  } | null

  // State
  loading: boolean
  error: string | null

  // Computed
  totalCount: number
  effectTypes: string[]
  effects: string[]
  skills: string[]
  plugins: string[]
  lastUpdated: string | null

  // Actions
  loadIngredients: () => Promise<void>
  refresh: () => Promise<void>
  clearError: () => void

  // Utilities
  getIngredientByName: (
    name: string
  ) => AlchemyIngredientWithComputed | undefined
  getIngredientsByEffectType: (
    effectType: string
  ) => AlchemyIngredientWithComputed[]
  getIngredientsBySkill: (skill: string) => AlchemyIngredientWithComputed[]
  getIngredientsByPlugin: (plugin: string) => AlchemyIngredientWithComputed[]
  getIngredientsByRarity: (rarity: string) => AlchemyIngredientWithComputed[]
  getIngredientsByEffect: (effect: string) => AlchemyIngredientWithComputed[]
}

export function useAlchemyData(
  options: UseAlchemyDataOptions = {}
): UseAlchemyDataReturn {
  const { autoLoad = true, refreshOnMount = false } = options

  // Use the Zustand store
  const {
    data: ingredients,
    loading,
    error,
    load,
    getByName,
    getByEffectType,
    getBySkill,
    getByPlugin,
    getByRarity,
    getByEffect,
  } = useAlchemyStore()

  // Load ingredients on mount if autoLoad is enabled
  const loadIngredients = useCallback(async () => {
    if (autoLoad && ingredients.length === 0) {
      await load()
    }
  }, [autoLoad, ingredients.length, load])

  const refresh = useCallback(async () => {
    await load()
  }, [load])

  const clearError = useCallback(() => {
    // Note: Zustand stores don't have a clearError method by default
    // This would need to be added to the store if needed
  }, [])

  // Load ingredients on mount if autoLoad is enabled
  useEffect(() => {
    if (autoLoad && ingredients.length === 0) {
      loadIngredients()
    }
  }, [autoLoad, ingredients.length, loadIngredients])

  // Refresh on mount if refreshOnMount is enabled
  useEffect(() => {
    if (refreshOnMount) {
      refresh()
    }
  }, [refreshOnMount, refresh])

  // Compute derived data
  const totalCount = ingredients.length
  const effectTypes = [
    ...new Set(ingredients.flatMap(ingredient => ingredient.effectTypes)),
  ]
  const effects = [
    ...new Set(
      ingredients.flatMap(ingredient =>
        ingredient.effects.map(effect => effect.mgefName)
      )
    ),
  ]
  const skills = [
    ...new Set(ingredients.flatMap(ingredient => ingredient.skills)),
  ]
  const plugins = [...new Set(ingredients.map(ingredient => ingredient.plugin))]
  const lastUpdated = new Date().toISOString()

  const ingredientData =
    ingredients.length > 0
      ? {
          ingredients,
          totalCount,
          effectTypes,
          effects,
          skills,
          plugins,
          lastUpdated,
        }
      : null

  // Utility functions using store methods
  const getIngredientByName = useCallback(
    (name: string) => {
      return getByName(name)
    },
    [getByName]
  )

  const getIngredientsByEffectType = useCallback(
    (effectType: string) => {
      return getByEffectType(effectType)
    },
    [getByEffectType]
  )

  const getIngredientsBySkill = useCallback(
    (skill: string) => {
      return getBySkill(skill)
    },
    [getBySkill]
  )

  const getIngredientsByPlugin = useCallback(
    (plugin: string) => {
      return getByPlugin(plugin)
    },
    [getByPlugin]
  )

  const getIngredientsByRarity = useCallback(
    (rarity: string) => {
      return getByRarity(rarity)
    },
    [getByRarity]
  )

  const getIngredientsByEffect = useCallback(
    (effect: string) => {
      return getByEffect(effect)
    },
    [getByEffect]
  )

  return {
    // Data
    ingredients,
    ingredientData,

    // State
    loading,
    error,

    // Computed
    totalCount,
    effectTypes,
    effects,
    skills,
    plugins,
    lastUpdated,

    // Actions
    loadIngredients,
    refresh,
    clearError,

    // Utilities
    getIngredientByName,
    getIngredientsByEffectType,
    getIngredientsBySkill,
    getIngredientsByPlugin,
    getIngredientsByRarity,
    getIngredientsByEffect,
  }
}
