import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { SkillsPageSkill } from '../adapters/useSkillsPage'

/**
 * Transforms a SkillsPageSkill to PlayerCreationItem format for use with shared components
 */
export function skillToPlayerCreationItem(
  skill: SkillsPageSkill
): PlayerCreationItem {
  return {
    id: skill.id,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    tags: [...skill.metaTags, skill.category.toLowerCase()],
    effects: [
      // Add key abilities as effects
      ...skill.keyAbilities.map(ability => ({
        type: 'positive' as const,
        name: 'Key Ability',
        description: ability,
        target: 'ability',
      })),
    ],
    summary:
      skill.description.length > 100
        ? `${skill.description.substring(0, 100)}...`
        : skill.description,
    associatedItems: [],
    imageUrl: undefined,
  }
}

/**
 * Transforms an array of SkillsPageSkill to PlayerCreationItem array
 */
export function skillsToPlayerCreationItems(
  skills: SkillsPageSkill[]
): PlayerCreationItem[] {
  return skills.map(skillToPlayerCreationItem)
}
