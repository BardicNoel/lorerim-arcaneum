import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Trait } from '@/shared/data/schemas'

/**
 * Extract all unique categories from traits
 */
export function getAllCategories(traits: Trait[]): string[] {
  const categories = traits.map(trait => trait.category).filter(Boolean)
  return [...new Set(categories)].sort()
}

/**
 * Extract all unique effect types from traits
 */
export function getAllEffectTypes(traits: Trait[]): string[] {
  const allEffectTypes = traits.flatMap(trait =>
    trait.effects?.map(effect => effect.type) || []
  )
  return [...new Set(allEffectTypes)].sort()
}

/**
 * Extract all unique tags from traits
 */
export function getAllTags(traits: Trait[]): string[] {
  const allTags = traits.flatMap(trait => trait.tags || [])
  return [...new Set(allTags)].sort()
}

/**
 * Get user-friendly effect type names
 */
export function getUserFriendlyEffectType(effectType: string): string {
  const effectTypeMapping: Record<string, string> = {
    special_effect: 'Special Effect',
    damage_dealt: 'Damage Dealt',
    health: 'Health',
    magicka: 'Magicka',
    stamina: 'Stamina',
    movement_speed: 'Movement Speed',
    carry_weight: 'Carry Weight',
    armor_rating: 'Armor Rating',
    weapon_damage: 'Weapon Damage',
    spell_strength: 'Spell Strength',
    magicka_regeneration: 'Magicka Regeneration',
    stamina_regeneration: 'Stamina Regeneration',
    health_regeneration: 'Health Regeneration',
    lockpicking: 'Lockpicking',
    pickpocketing: 'Pickpocketing',
    sneak: 'Sneak',
    speech: 'Speech',
    alchemy: 'Alchemy',
    enchanting: 'Enchanting',
    smithing: 'Smithing',
    price_modification: 'Price Modification',
    poison_resistance: 'Poison Resistance',
    fire_resistance: 'Fire Resistance',
    frost_resistance: 'Frost Resistance',
    shock_resistance: 'Shock Resistance',
    magic_resistance: 'Magic Resistance',
    disease_resistance: 'Disease Resistance',
  }

  return (
    effectTypeMapping[effectType] ||
    effectType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  )
}

/**
 * Parse description placeholders like <50> and replace with actual values
 * Preserves ***text*** formatting for the FormattedText component
 */
export function parseDescription(description: string): string {
  // Only replace angle bracket placeholders, preserve ***text*** formatting
  return description.replace(/<(\d+)>/g, '$1')
}
