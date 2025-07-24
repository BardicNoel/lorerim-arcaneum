import type { Birthsign, TransformedBirthsign } from '../types'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'

/**
 * Extract all unique groups from birthsigns
 */
export function getAllGroups(birthsigns: Birthsign[]): string[] {
  const groups = birthsigns.map(birthsign => birthsign.group)
  return [...new Set(groups)].sort()
}

/**
 * Extract all unique stats from birthsigns
 */
export function getAllStats(birthsigns: Birthsign[]): string[] {
  const allStats = birthsigns.flatMap(birthsign => [
    ...birthsign.stat_modifications.map(stat => stat.stat),
    ...birthsign.skill_bonuses.map(skill => skill.stat),
  ])
  return [...new Set(allStats)].sort()
}

/**
 * Extract all unique powers from birthsigns
 */
export function getAllPowers(birthsigns: Birthsign[]): string[] {
  const allPowers = birthsigns.flatMap(birthsign =>
    birthsign.powers.map(power => power.name)
  )
  return [...new Set(allPowers)].sort()
}

/**
 * Get user-friendly stat names
 */
export function getUserFriendlyStat(stat: string): string {
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

  return (
    statMapping[stat] ||
    stat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  )
}

/**
 * Parse description placeholders like <50> and replace with actual values
 */
export function parseDescription(description: string): string {
  return description.replace(/<(\d+)>/g, '$1')
}
