/**
 * Sanitizes strings for display by converting underscores to spaces and applying proper formatting
 */

/**
 * Converts underscore-separated strings to user-friendly format
 * Example: "stat_modifications" -> "Stat Modifications"
 */
export function sanitizeUnderscoreString(text: string): string {
  if (!text) return text
  
  return text
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Sanitizes stat names for display
 * Example: "weapon_damage" -> "Weapon Damage"
 */
export function sanitizeStatName(stat: string): string {
  if (!stat) return ''
  
  return sanitizeUnderscoreString(stat)
}

/**
 * Sanitizes skill names for display
 * Example: "lockpicking_durability" -> "Lockpicking Durability"
 */
export function sanitizeSkillName(skill: string): string {
  if (!skill) return ''
  
  return sanitizeUnderscoreString(skill)
}

/**
 * Sanitizes effect names for display
 */
export function sanitizeEffectName(effectName: string): string {
  if (!effectName) return ''
  
  return sanitizeUnderscoreString(effectName)
}

/**
 * Sanitizes effect descriptions for display
 */
export function sanitizeEffectDescription(description: string): string {
  if (!description) return ''
  
  return description
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Capitalize first letter of each word, but preserve common prepositions
    .replace(/\b\w/g, (l, index, string) => {
      // Don't capitalize common prepositions and articles
      const lowerWord = string.slice(index).split(/\s+/)[0].toLowerCase()
      const commonWords = ['by', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'a', 'an', 'the', 'and', 'or', 'but']
      if (commonWords.includes(lowerWord)) {
        return l.toLowerCase()
      }
      return l.toUpperCase()
    })
}

/**
 * Enhanced version of getUserFriendlyStat that uses the sanitizer
 * This maintains backward compatibility with existing code
 */
export function getUserFriendlyStatEnhanced(stat: string): string {
  const statMapping: Record<string, string> = {
    health: 'Health',
    magicka: 'Magicka',
    stamina: 'Stamina',
    weapon_damage: 'Weapon Damage',
    armor_penetration: 'Armor Penetration',
    unarmed_damage: 'Unarmed Damage',
    movement_speed: 'Movement Speed',
    sprint_speed: 'Sprint Speed',
    carry_weight: 'Carry Weight',
    spell_strength: 'Spell Strength',
    magicka_regeneration: 'Magicka Regeneration',
    lockpicking_durability: 'Lockpicking Durability',
    lockpicking_expertise: 'Lockpicking Expertise',
    pickpocketing_success: 'Pickpocketing Success',
    stealth_detection: 'Stealth Detection',
    speech: 'Speech',
    shout_cooldown: 'Shout Cooldown',
    price_modification: 'Price Modification',
    damage_reflection: 'Damage Reflection',
    poison_resistance: 'Poison Resistance',
    fire_resistance: 'Fire Resistance',
    enchanting_strength: 'Enchanting Strength',
  }

  return statMapping[stat] || sanitizeStatName(stat)
}
