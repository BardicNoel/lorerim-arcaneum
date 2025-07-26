import type { Birthsign } from '@/features/birthsigns/types'
import type { Religion } from '@/features/religions/types'
import type { Trait } from '@/features/traits/types'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'

/**
 * Maps a Religion entity to a PlayerCreationItem for use in shared player creation UIs.
 * Includes tenet and blessing effects, favored races as tags, and type as category.
 */
export function religionToPlayerCreationItem(
  religion: Religion
): PlayerCreationItem {
  return {
    id: `religion-${religion.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: religion.name,
    description: religion.tenet?.description || '',
    tags: religion.favoredRaces || [],
    summary: religion.tenet?.description || '',
    effects: [
      // Include tenet effects
      ...(religion.tenet?.effects?.map(effect => ({
        type: 'positive' as const,
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || '',
      })) || []),
      // Include blessing effects if available
      ...(religion.blessing?.effects?.map(effect => ({
        type: 'positive' as const,
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || '',
      })) || []),
    ],
    associatedItems: [],
    imageUrl: undefined,
    category: religion.type,
  }
}

/**
 * Maps a Trait entity to a PlayerCreationItem for use in shared player creation UIs.
 * Returns all core PlayerCreationItem fields, but also spreads in all domain-specific fields from the original Trait for extensibility.
 */
export function traitToPlayerCreationItem(
  trait: Trait
): PlayerCreationItem & { originalTrait: Trait } {
  return {
    ...trait, // Spread domain-specific fields first
    id: trait.edid, // Use edid for character build compatibility
    name: trait.name,
    description: trait.description,
    tags: trait.tags || [],
    summary: trait.description,
    effects: [
      ...(trait.effects?.map(effect => ({
        type: 'positive' as const, // Could be improved if effect.type is more granular
        name: effect.type,
        description: effect.condition
          ? `${effect.type} (${effect.condition})`
          : effect.type,
        value: effect.value,
      })) || []),
    ],
    associatedItems: [],
    imageUrl: undefined,
    category: trait.category,
    originalTrait: trait, // Include original trait for extensibility
  }
}

/**
 * Maps a Birthsign entity to a PlayerCreationItem for use in shared player creation UIs.
 * Returns all core PlayerCreationItem fields, but also spreads in all domain-specific fields from the original Birthsign for extensibility.
 */
export function birthsignToPlayerCreationItem(
  birthsign: Birthsign
): PlayerCreationItem & { originalBirthsign: Birthsign } {
  // Core effects (stat_modifications, skill_bonuses, powers)
  const effects = [
    // Stat modifications
    ...(birthsign.stat_modifications?.map(stat => ({
      type:
        stat.type === 'bonus' ? ('positive' as const) : ('negative' as const),
      name: `${stat.stat} ${stat.type === 'bonus' ? '+' : '-'}${stat.value}${stat.value_type === 'percentage' ? '%' : ''}`,
      description: `${stat.stat} ${stat.type === 'bonus' ? 'increased' : 'decreased'} by ${stat.value}${stat.value_type === 'percentage' ? '%' : ''}`,
      value: stat.value,
      target: stat.stat,
    })) || []),
    // Skill bonuses
    ...(birthsign.skill_bonuses?.map(skill => ({
      type: 'positive' as const,
      name: `${skill.stat} +${skill.value}${skill.value_type === 'percentage' ? '%' : ''}`,
      description: `${skill.stat} skill increased by ${skill.value}${skill.value_type === 'percentage' ? '%' : ''}`,
      value: skill.value,
      target: skill.stat,
    })) || []),
    // Powers
    ...(birthsign.powers?.map(power => ({
      type: 'positive' as const,
      name: power.name,
      description: power.description,
      value: power.magnitude || 0,
      target: 'power',
    })) || []),
    // Conditional effects
    ...(birthsign.conditional_effects?.map(effect => ({
      type: 'neutral' as const,
      name: effect.stat,
      description: effect.description,
      value: effect.value,
      target: effect.stat,
    })) || []),
    // Mastery effects
    ...(birthsign.mastery_effects?.map(effect => ({
      type: 'positive' as const,
      name: effect.stat,
      description: effect.description,
      value: effect.value,
      target: effect.stat,
    })) || []),
  ]

  // Tags: group, stat_modifications, skill_bonuses, power names
  const tags = [
    birthsign.group,
    ...(birthsign.stat_modifications?.map(stat => stat.stat) || []),
    ...(birthsign.skill_bonuses?.map(skill => skill.stat) || []),
    ...(birthsign.powers?.map(power => power.name) || []),
  ].filter((tag, index, arr) => arr.indexOf(tag) === index)

  return {
    ...birthsign, // Spread domain-specific fields first
    id: birthsign.edid, // Use edid for character build compatibility
    name: birthsign.name,
    description: birthsign.description,
    tags,
    summary: birthsign.description,
    effects,
    associatedItems: [],
    imageUrl: undefined,
    category: birthsign.group,
    originalBirthsign: birthsign, // Include original birthsign for extensibility
  }
}
