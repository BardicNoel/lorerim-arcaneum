import { useMemo } from 'react'
import { useEnchantmentsStore } from '@/shared/stores'
import type { EnchantmentWithComputed } from '../types'

export interface EnchantmentStatistics {
  totalEnchantments: number
  categoryBreakdown: Record<string, number>
  targetTypeDistribution: Record<string, number>
  pluginSources: Record<string, number>
  topEffects: Array<{ name: string; count: number }>
  itemTypeDistribution: Record<string, number>
  averageEffectsPerEnchantment: number
  enchantmentsWithWornRestrictions: number
  totalEffects: number
  totalItems: number
  uniqueEffects: number
  uniqueItemTypes: number
}

export function useEnchantmentStatistics(): EnchantmentStatistics {
  const { data: enchantments } = useEnchantmentsStore()

  return useMemo(() => {
    if (!enchantments || enchantments.length === 0) {
      return {
        totalEnchantments: 0,
        categoryBreakdown: {},
        targetTypeDistribution: {},
        pluginSources: {},
        topEffects: [],
        itemTypeDistribution: {},
        averageEffectsPerEnchantment: 0,
        enchantmentsWithWornRestrictions: 0,
        totalEffects: 0,
        totalItems: 0,
        uniqueEffects: 0,
        uniqueItemTypes: 0,
      }
    }

    // Initialize counters
    const categoryCounts: Record<string, number> = {}
    const targetTypeCounts: Record<string, number> = {}
    const pluginCounts: Record<string, number> = {}
    const effectCounts: Record<string, number> = {}
    const itemTypeCounts: Record<string, number> = {}
    
    let totalEffects = 0
    let totalItems = 0
    let enchantmentsWithWornRestrictions = 0

    // Process each enchantment
    enchantments.forEach(enchantment => {
      // Category breakdown
      const category = enchantment.category || 'Unknown'
      categoryCounts[category] = (categoryCounts[category] || 0) + 1

      // Target type distribution
      const targetType = enchantment.targetType || 'Unknown'
      targetTypeCounts[targetType] = (targetTypeCounts[targetType] || 0) + 1

      // Plugin sources
      const plugin = enchantment.plugin || 'Unknown'
      pluginCounts[plugin] = (pluginCounts[plugin] || 0) + 1

      // Effects analysis
      enchantment.effects.forEach(effect => {
        const effectName = effect.name || 'Unknown Effect'
        effectCounts[effectName] = (effectCounts[effectName] || 0) + 1
        totalEffects++
      })

      // Item type distribution
      enchantment.foundOnItems.forEach(item => {
        const itemType = item.type || 'Unknown'
        itemTypeCounts[itemType] = (itemTypeCounts[itemType] || 0) + 1
        totalItems++
      })

      // Worn restrictions
      if (enchantment.wornRestrictions && enchantment.wornRestrictions.length > 0) {
        enchantmentsWithWornRestrictions++
      }
    })

    // Calculate top effects (top 10)
    const topEffects = Object.entries(effectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate averages
    const averageEffectsPerEnchantment = totalEffects / enchantments.length

    // Get unique counts
    const uniqueEffects = Object.keys(effectCounts).length
    const uniqueItemTypes = Object.keys(itemTypeCounts).length

    return {
      totalEnchantments: enchantments.length,
      categoryBreakdown: categoryCounts,
      targetTypeDistribution: targetTypeCounts,
      pluginSources: pluginCounts,
      topEffects,
      itemTypeDistribution: itemTypeCounts,
      averageEffectsPerEnchantment: Math.round(averageEffectsPerEnchantment * 100) / 100,
      enchantmentsWithWornRestrictions,
      totalEffects,
      totalItems,
      uniqueEffects,
      uniqueItemTypes,
    }
  }, [enchantments])
}

// Helper function to convert statistics to chart data
export function useChartData(statistics: EnchantmentStatistics) {
  return useMemo(() => {
    const categoryData = Object.entries(statistics.categoryBreakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const targetTypeData = Object.entries(statistics.targetTypeDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const pluginData = Object.entries(statistics.pluginSources)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    const itemTypeData = Object.entries(statistics.itemTypeDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15) // Limit to top 15 for readability

    return {
      categoryData,
      targetTypeData,
      pluginData,
      itemTypeData,
      effectsData: statistics.topEffects,
    }
  }, [statistics])
}

