import type { 
  Enchantment, 
  EnchantmentWithComputed, 
  EnchantmentFilters, 
  EnchantmentSearchResult,
  EnchantmentTargetType,
  EnchantmentItemType
} from '../types'

export class EnchantmentModel {
  /**
   * Validate if an enchantment has all required fields
   */
  static isValid(enchantment: any): enchantment is Enchantment {
    return (
      typeof enchantment === 'object' &&
      enchantment !== null &&
      typeof enchantment.name === 'string' &&
      typeof enchantment.baseEnchantmentId === 'string' &&
      typeof enchantment.enchantmentType === 'string' &&
      typeof enchantment.targetType === 'string' &&
      ['touch', 'self'].includes(enchantment.targetType) &&
      Array.isArray(enchantment.effects) &&
      Array.isArray(enchantment.wornRestrictions) &&
      Array.isArray(enchantment.foundOnItems) &&
      typeof enchantment.globalFormId === 'string' &&
      typeof enchantment.plugin === 'string' &&
      typeof enchantment.foundOnItemsTrimmed === 'string'
    )
  }

  /**
   * Check if two enchantments are equal by baseEnchantmentId
   */
  static equals(enchantment1: Enchantment, enchantment2: Enchantment): boolean {
    return enchantment1.baseEnchantmentId === enchantment2.baseEnchantmentId
  }

  /**
   * Add computed properties to an enchantment
   */
  static addComputedProperties(enchantment: Enchantment, category: string): EnchantmentWithComputed {
    const hasEffects = enchantment.effects.length > 0
    const effectCount = enchantment.effects.length
    const isWeaponEnchantment = enchantment.targetType === 'touch'
    const isArmorEnchantment = enchantment.targetType === 'self'
    const itemCount = enchantment.foundOnItems.length
    
    // Generate tags
    const tags = this.generateTags(enchantment, {
      hasEffects,
      isWeaponEnchantment,
      isArmorEnchantment,
      category
    })

    // Create searchable text for fuzzy search
    const searchableText = this.createSearchableText(enchantment, category)

    return {
      ...enchantment,
      hasEffects,
      effectCount,
      isWeaponEnchantment,
      isArmorEnchantment,
      itemCount,
      tags,
      searchableText,
      category
    }
  }

  /**
   * Generate tags for an enchantment based on its properties
   */
  private static generateTags(enchantment: Enchantment, computed: {
    hasEffects: boolean
    isWeaponEnchantment: boolean
    isArmorEnchantment: boolean
    category: string
  }): string[] {
    const tags: string[] = []

    // Target type tags
    tags.push(enchantment.targetType)
    
    // Category tags
    tags.push(computed.category)

    // Effect type tags
    if (computed.hasEffects) {
      tags.push('Has Effects')
    }
    if (computed.isWeaponEnchantment) {
      tags.push('Weapon Enchantment')
    }
    if (computed.isArmorEnchantment) {
      tags.push('Armor Enchantment')
    }

    // Item type tags
    const itemTypes = [...new Set(enchantment.foundOnItems.map(item => item.type))]
    tags.push(...itemTypes)

    // Plugin tags
    tags.push(enchantment.plugin)

    // Effect name tags
    enchantment.effects.forEach(effect => {
      tags.push(effect.name)
    })

    return [...new Set(tags)]
  }

  /**
   * Create searchable text for an enchantment
   */
  private static createSearchableText(enchantment: Enchantment, category: string): string {
    const searchableParts = [
      enchantment.name,
      category,
      enchantment.plugin,
      ...enchantment.effects.map(effect => `${effect.name} ${effect.description}`),
      ...enchantment.foundOnItems.map(item => `${item.name} ${item.type}`),
      ...enchantment.wornRestrictions
    ]

    return searchableParts.join(' ').toLowerCase()
  }

  /**
   * Filter enchantments based on criteria
   */
  static filterEnchantments(enchantments: EnchantmentWithComputed[], filters: EnchantmentFilters): EnchantmentWithComputed[] {
    return enchantments.filter(enchantment => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(enchantment.category)) {
        return false
      }
      
      // Target type filter
      if (filters.targetTypes.length > 0 && !filters.targetTypes.includes(enchantment.targetType)) {
        return false
      }
      
      // Item type filter
      if (filters.itemTypes.length > 0) {
        const hasMatchingItemType = enchantment.foundOnItems.some(item => 
          filters.itemTypes.includes(item.type)
        )
        if (!hasMatchingItemType) {
          return false
        }
      }
      
      // Plugin filter
      if (filters.plugins.length > 0 && !filters.plugins.includes(enchantment.plugin)) {
        return false
      }
      
      // Effects filter
      if (filters.hasEffects !== null && enchantment.hasEffects !== filters.hasEffects) {
        return false
      }
      
      // Worn restrictions filter
      if (filters.hasWornRestrictions !== null) {
        const hasRestrictions = enchantment.wornRestrictions.length > 0
        if (hasRestrictions !== filters.hasWornRestrictions) {
          return false
        }
      }
      
      // Item count filter
      if (filters.minItemCount !== null && enchantment.itemCount < filters.minItemCount) {
        return false
      }
      
      if (filters.maxItemCount !== null && enchantment.itemCount > filters.maxItemCount) {
        return false
      }
      
      return true
    })
  }

  /**
   * Sort enchantments
   */
  static sortEnchantments(enchantments: EnchantmentWithComputed[], sortBy: string, sortOrder: 'asc' | 'desc'): EnchantmentWithComputed[] {
    const sorted = [...enchantments].sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case 'targetType':
          aValue = a.targetType
          bValue = b.targetType
          break
        case 'plugin':
          aValue = a.plugin.toLowerCase()
          bValue = b.plugin.toLowerCase()
          break
        case 'itemCount':
          aValue = a.itemCount
          bValue = b.itemCount
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    
    return sorted
  }

  /**
   * Search enchantments
   */
  static searchEnchantments(enchantments: EnchantmentWithComputed[], query: string): EnchantmentSearchResult[] {
    const lowerQuery = query.toLowerCase()
    const results: EnchantmentSearchResult[] = []

    enchantments.forEach(enchantment => {
      let score = 0
      const matchedFields: string[] = []

      // Name match (highest priority)
      if (enchantment.name.toLowerCase().includes(lowerQuery)) {
        score += 10
        matchedFields.push('name')
      }

      // Effect name match
      enchantment.effects.forEach(effect => {
        if (effect.name.toLowerCase().includes(lowerQuery)) {
          score += 5
          matchedFields.push('effect')
        }
        if (effect.description.toLowerCase().includes(lowerQuery)) {
          score += 3
          matchedFields.push('effect_description')
        }
      })

      // Category match
      if (enchantment.category.toLowerCase().includes(lowerQuery)) {
        score += 4
        matchedFields.push('category')
      }

      // Plugin match
      if (enchantment.plugin.toLowerCase().includes(lowerQuery)) {
        score += 2
        matchedFields.push('plugin')
      }

      // Item name match
      enchantment.foundOnItems.forEach(item => {
        if (item.name.toLowerCase().includes(lowerQuery)) {
          score += 3
          matchedFields.push('item')
        }
      })

      // Tag match
      enchantment.tags.forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          score += 1
          matchedFields.push('tag')
        }
      })

      if (score > 0) {
        results.push({
          enchantment,
          score,
          matchedFields: [...new Set(matchedFields)]
        })
      }
    })

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score)
  }

  /**
   * Filter enchantments by enchantment type (weapon vs armor)
   */
  static filterByEnchantmentType(enchantments: EnchantmentWithComputed[], type: 'weapon' | 'armor'): EnchantmentWithComputed[] {
    return enchantments.filter(enchantment => {
      if (type === 'weapon') {
        return enchantment.isWeaponEnchantment
      }
      if (type === 'armor') {
        return enchantment.isArmorEnchantment
      }
      return true
    })
  }

  /**
   * Filter enchantments by armor restriction
   */
  static filterByArmorRestriction(enchantments: EnchantmentWithComputed[], restriction: string): EnchantmentWithComputed[] {
    return enchantments.filter(enchantment => 
      enchantment.wornRestrictions.includes(restriction)
    )
  }

  /**
   * Filter enchantments by fuzzy search
   */
  static filterByFuzzySearch(enchantments: EnchantmentWithComputed[], searchTerm: string): EnchantmentWithComputed[] {
    if (!searchTerm) return enchantments
    
    const lowerSearchTerm = searchTerm.toLowerCase()
    return enchantments.filter(enchantment => 
      enchantment.searchableText.toLowerCase().includes(lowerSearchTerm)
    )
  }

  /**
   * Get statistics for enchantments
   */
  static getStatistics(enchantments: EnchantmentWithComputed[]) {
    const totalEnchantments = enchantments.length
    
    // Get unique categories
    const categories = [...new Set(enchantments.map(e => e.category))]
    
    // Get unique plugins
    const plugins = [...new Set(enchantments.map(e => e.plugin))]
    
    // Get unique target types
    const targetTypes = [...new Set(enchantments.map(e => e.targetType))]
    
    // Get unique item types
    const itemTypes = [...new Set(enchantments.flatMap(e => e.foundOnItems.map(item => item.type)))]
    
    // Count enchantments with effects
    const withEffects = enchantments.filter(e => e.hasEffects).length
    
    // Count enchantments with restrictions
    const withRestrictions = enchantments.filter(e => e.wornRestrictions.length > 0).length
    
    // Calculate average item count
    const averageItemCount = totalEnchantments > 0 
      ? enchantments.reduce((sum, e) => sum + e.itemCount, 0) / totalEnchantments 
      : 0

    return {
      totalEnchantments,
      categories: categories.length,
      plugins: plugins.length,
      targetTypes: targetTypes.length,
      itemTypes: itemTypes.length,
      withEffects,
      withRestrictions,
      averageItemCount: Math.round(averageItemCount * 100) / 100
    }
  }
}
