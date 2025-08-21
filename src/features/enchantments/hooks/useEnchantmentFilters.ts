import { useEnchantmentsStore } from '@/shared/stores'
import { useMemo, useCallback } from 'react'
import type { EnchantmentWithComputed } from '../types'

export const useEnchantmentFilters = () => {
  const { data: enchantments, filters } = useEnchantmentsStore()
  
  // Memoize filter functions for better performance
  const createSearchFilter = useCallback((searchTerm: string) => {
    if (!searchTerm) return () => true
    const searchLower = searchTerm.toLowerCase()
    return (enchantment: EnchantmentWithComputed) => 
      enchantment.searchableText.includes(searchLower)
  }, [])

  const createCategoryFilter = useCallback((categories: string[]) => {
    if (categories.length === 0) return () => true
    return (enchantment: EnchantmentWithComputed) => 
      categories.includes(enchantment.category)
  }, [])

  const createTargetTypeFilter = useCallback((targetTypes: string[]) => {
    if (targetTypes.length === 0) return () => true
    return (enchantment: EnchantmentWithComputed) => 
      targetTypes.includes(enchantment.targetType)
  }, [])

  const createPluginFilter = useCallback((plugins: string[]) => {
    if (plugins.length === 0) return () => true
    return (enchantment: EnchantmentWithComputed) => 
      plugins.includes(enchantment.plugin)
  }, [])

  const createItemTypeFilter = useCallback((itemTypes: string[]) => {
    if (itemTypes.length === 0) return () => true
    return (enchantment: EnchantmentWithComputed) => {
      const enchantmentItemTypes = enchantment.foundOnItems.map(item => item.type)
      return enchantmentItemTypes.some(type => itemTypes.includes(type))
    }
  }, [])

  const createHasEffectsFilter = useCallback((hasEffects: boolean | null) => {
    if (hasEffects === null) return () => true
    return (enchantment: EnchantmentWithComputed) => 
      enchantment.hasEffects === hasEffects
  }, [])

  const createHasWornRestrictionsFilter = useCallback((hasWornRestrictions: boolean | null) => {
    if (hasWornRestrictions === null) return () => true
    return (enchantment: EnchantmentWithComputed) => {
      const hasRestrictions = enchantment.wornRestrictions.length > 0
      return hasRestrictions === hasWornRestrictions
    }
  }, [])

  const createItemCountFilter = useCallback((minCount: number | null, maxCount: number | null) => {
    if (minCount === null && maxCount === null) return () => true
    return (enchantment: EnchantmentWithComputed) => {
      if (minCount !== null && enchantment.itemCount < minCount) return false
      if (maxCount !== null && enchantment.itemCount > maxCount) return false
      return true
    }
  }, [])
  
  const filteredEnchantments = useMemo(() => {
    // Create filter functions
    const searchFilter = createSearchFilter(filters.searchTerm)
    const categoryFilter = createCategoryFilter(filters.categories)
    const targetTypeFilter = createTargetTypeFilter(filters.targetTypes)
    const pluginFilter = createPluginFilter(filters.plugins)
    const itemTypeFilter = createItemTypeFilter(filters.itemTypes)
    const hasEffectsFilter = createHasEffectsFilter(filters.hasEffects)
    const hasWornRestrictionsFilter = createHasWornRestrictionsFilter(filters.hasWornRestrictions)
    const itemCountFilter = createItemCountFilter(filters.minItemCount, filters.maxItemCount)

    // Apply all filters
    return enchantments.filter(enchantment => {
      return searchFilter(enchantment) &&
             categoryFilter(enchantment) &&
             targetTypeFilter(enchantment) &&
             pluginFilter(enchantment) &&
             itemTypeFilter(enchantment) &&
             hasEffectsFilter(enchantment) &&
             hasWornRestrictionsFilter(enchantment) &&
             itemCountFilter(enchantment)
    })
  }, [
    enchantments, 
    filters, 
    createSearchFilter, 
    createCategoryFilter, 
    createTargetTypeFilter, 
    createPluginFilter, 
    createItemTypeFilter, 
    createHasEffectsFilter, 
    createHasWornRestrictionsFilter, 
    createItemCountFilter
  ])
  
  return {
    filteredEnchantments,
    filters,
    totalCount: enchantments.length,
    filteredCount: filteredEnchantments.length
  }
}
