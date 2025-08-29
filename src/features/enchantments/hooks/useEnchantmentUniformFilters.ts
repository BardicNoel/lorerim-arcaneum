import { useMemo } from 'react'
import type { EnchantmentWithComputed } from '../types'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

export function useEnchantmentUniformFilters(
  enchantments: EnchantmentWithComputed[],
  selectedTags: SelectedTag[]
) {
  const filteredEnchantments = useMemo(() => {
    if (selectedTags.length === 0) return enchantments
    
    return enchantments.filter(enchantment => {
      // Each tag must match for the enchantment to be included
      return selectedTags.every(tag => {
        switch (tag.category) {
          case 'Categories':
            // Explicit filter: weapon vs armor enchantments
            if (tag.value === 'weapon') {
              return enchantment.isWeaponEnchantment
            }
            if (tag.value === 'armor') {
              return enchantment.isArmorEnchantment
            }
            return true
            
          case 'Armor Restrictions':
            // Explicit filter: check if enchantment has the specified armor restriction
            return enchantment.wornRestrictions.includes(tag.value)
            
          case 'Fuzzy Search':
            // Fuzzy search: search through searchableText
            return enchantment.searchableText.toLowerCase().includes(tag.value.toLowerCase())
            
          default:
            return true
        }
      })
    })
  }, [enchantments, selectedTags])

  return {
    filteredEnchantments,
    totalCount: enchantments.length,
    filteredCount: filteredEnchantments.length
  }
}
