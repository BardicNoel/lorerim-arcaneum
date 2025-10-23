import { useAlchemyStore } from '@/shared/stores/alchemyStore'
import { useMemo } from 'react'
import { AlchemyIngredientModel } from '../model/AlchemyIngredientModel'
import type {
  AlchemyIngredientWithComputed,
  AlchemyMetaAnalysis,
  AlchemyStatistics,
  EffectComparison,
} from '../types'

interface UseAlchemyComputedReturn {
  // Statistics
  statistics: AlchemyStatistics | null
  metaAnalysis: AlchemyMetaAnalysis | null

  // Available options for filters
  availableEffectTypes: string[]
  availableEffects: string[]
  availableSkills: string[]
  availablePlugins: string[]
  availableRarities: string[]
  availableFlags: string[]

  // Computed data
  totalIngredients: number
  ingredientsByEffectType: Record<string, number>
  ingredientsByPlugin: Record<string, number>
  ingredientsByRarity: Record<string, number>
  ingredientsBySkill: Record<string, number>

  // Utility functions
  getEffectComparisons: (
    ingredient: AlchemyIngredientWithComputed
  ) => EffectComparison[]
  getIngredientStats: (ingredient: AlchemyIngredientWithComputed) => {
    effectCount: number
    totalMagnitude: number
    maxDuration: number
    totalBaseCost: number
    averageMagnitude: number
    averageDuration: number
    rarity: string
    effectTypes: string[]
    skills: string[]
  }
}

export function useAlchemyComputed(
  ingredients: AlchemyIngredientWithComputed[]
): UseAlchemyComputedReturn {
  const { statistics, metaAnalysis } = useAlchemyStore()

  // Available options for filters
  const availableEffectTypes = useMemo(() => {
    return AlchemyIngredientModel.getUniqueEffectTypes(ingredients)
  }, [ingredients])

  const availableEffects = useMemo(() => {
    return AlchemyIngredientModel.getUniqueEffects(ingredients)
  }, [ingredients])

  const availableSkills = useMemo(() => {
    return AlchemyIngredientModel.getUniqueSkills(ingredients)
  }, [ingredients])

  const availablePlugins = useMemo(() => {
    return AlchemyIngredientModel.getUniquePlugins(ingredients)
  }, [ingredients])

  const availableRarities = useMemo(() => {
    return AlchemyIngredientModel.getUniqueRarities(ingredients)
  }, [ingredients])

  const availableFlags = useMemo(() => {
    return AlchemyIngredientModel.getUniqueFlags(ingredients)
  }, [ingredients])

  // Computed data
  const totalIngredients = useMemo(() => {
    return ingredients.length
  }, [ingredients])

  const ingredientsByEffectType = useMemo(() => {
    const counts: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      ingredient.effectTypes.forEach(effectType => {
        counts[effectType] = (counts[effectType] || 0) + 1
      })
    })
    return counts
  }, [ingredients])

  const ingredientsByPlugin = useMemo(() => {
    const counts: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      counts[ingredient.plugin] = (counts[ingredient.plugin] || 0) + 1
    })
    return counts
  }, [ingredients])

  const ingredientsByRarity = useMemo(() => {
    const counts: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      counts[ingredient.rarity] = (counts[ingredient.rarity] || 0) + 1
    })
    return counts
  }, [ingredients])

  const ingredientsBySkill = useMemo(() => {
    const counts: Record<string, number> = {}
    ingredients.forEach(ingredient => {
      ingredient.skills.forEach(skill => {
        counts[skill] = (counts[skill] || 0) + 1
      })
    })
    return counts
  }, [ingredients])

  // Utility functions
  const getEffectComparisons = useMemo(() => {
    return (ingredient: AlchemyIngredientWithComputed): EffectComparison[] => {
      return AlchemyIngredientModel.getEffectComparisons(
        ingredient,
        ingredients
      )
    }
  }, [ingredients])

  const getIngredientStats = useMemo(() => {
    return (ingredient: AlchemyIngredientWithComputed) => {
      return {
        effectCount: ingredient.effectCount,
        totalMagnitude: ingredient.totalMagnitude,
        maxDuration: ingredient.maxDuration,
        totalBaseCost: ingredient.totalBaseCost,
        averageMagnitude: ingredient.averageMagnitude,
        averageDuration: ingredient.averageDuration,
        rarity: ingredient.rarity,
        effectTypes: ingredient.effectTypes,
        skills: ingredient.skills,
      }
    }
  }, [])

  return {
    // Statistics
    statistics,
    metaAnalysis,

    // Available options for filters
    availableEffectTypes,
    availableEffects,
    availableSkills,
    availablePlugins,
    availableRarities,
    availableFlags,

    // Computed data
    totalIngredients,
    ingredientsByEffectType,
    ingredientsByPlugin,
    ingredientsByRarity,
    ingredientsBySkill,

    // Utility functions
    getEffectComparisons,
    getIngredientStats,
  }
}
