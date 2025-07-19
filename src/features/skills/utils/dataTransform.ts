import type { Skill, TransformedSkill } from '../types'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'

export function transformSkillToPlayerCreationItem(
  skill: Skill
): PlayerCreationItem {
  return {
    id: skill.name.toLowerCase().replace(/\s+/g, '-'),
    name: skill.name,
    description: skill.description,
    category: skill.category,
    tags: [...skill.metaTags, skill.category.toLowerCase()],
    effects: [
      {
        type: 'positive' as const,
        name: 'Scaling',
        description: skill.scaling,
        target: 'scaling',
      },
      ...skill.keyAbilities.map(ability => ({
        type: 'positive' as const,
        name: 'Key Ability',
        description: ability,
        target: 'ability',
      })),
    ],
  }
}

export function getAllCategories(skills: Skill[]): string[] {
  const categories = new Set<string>()
  skills.forEach(skill => {
    if (skill.category) {
      categories.add(skill.category)
    }
  })
  return Array.from(categories).sort()
}

export function getAllMetaTags(skills: Skill[]): string[] {
  const tags = new Set<string>()
  skills.forEach(skill => {
    skill.metaTags.forEach(tag => {
      tags.add(tag)
    })
  })
  return Array.from(tags).sort()
}

export function getAllKeyAbilities(skills: Skill[]): string[] {
  const abilities = new Set<string>()
  skills.forEach(skill => {
    skill.keyAbilities.forEach(ability => {
      abilities.add(ability)
    })
  })
  return Array.from(abilities).sort()
}

export function getCategoryPriority(category: string): number {
  switch (category) {
    case 'Combat':
      return 1
    case 'Magic':
      return 2
    case 'Stealth':
      return 3
    default:
      return 4
  }
}
