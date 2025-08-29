import { useMemo } from 'react'
import type { EnchantmentWithComputed } from '../types'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

/**
 * Format worn restriction strings to be user-friendly
 */
function formatWornRestriction(restriction: string): string {
  const formatMap: Record<string, string> = {
    // Armor pieces
    'ArmorBoots': 'Armor Footwear',
    'ArmorHelmet': 'Armor Headgear', 
    'ArmorCuirass': 'Armor Body',
    'ArmorGauntlets': 'Armor Hands',
    'ArmorShield': 'Armor Shield',
    'ArmorGreaves': 'Armor Legs',
    
    // Clothing pieces
    'ClothingFeet': 'Clothing Footwear',
    'ClothingHead': 'Clothing Headgear',
    'ClothingBody': 'Clothing Body',
    'ClothingHands': 'Clothing Hands',
    'ClothingRing': 'Rings',
    'ClothingNecklace': 'Necklaces',
    'ClothingCirclet': 'Circlets',
    
    // Weapon materials (for weapon enchantments)
    'WeapMaterialWood': 'Wooden Weapons',
    'WeapMaterialSteel': 'Steel Weapons',
    'WeapMaterialOrcish': 'Orcish Weapons',
    'WeapMaterialIron': 'Iron Weapons',
    'WeapMaterialGlass': 'Glass Weapons',
    'WeapMaterialElven': 'Elven Weapons',
    'WeapMaterialEbony': 'Ebony Weapons',
    'WeapMaterialDwarven': 'Dwarven Weapons',
    'WeapMaterialDaedric': 'Daedric Weapons',
  }
  
  return formatMap[restriction] || restriction
}

// Export the formatting function for use in other components
export { formatWornRestriction }

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
