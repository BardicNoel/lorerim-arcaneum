// Pure data fetching - no UI dependencies
import type { Skill, PerkTree } from './types'
import { getDataUrl } from '@/shared/utils/baseUrl'

export async function fetchSkills(): Promise<Skill[]> {
  const response = await fetch(getDataUrl('data/skills.json'))
  if (!response.ok) {
    throw new Error('Failed to load skills data')
  }
  const data = await response.json()
  return (data.skills || []).sort((a: Skill, b: Skill) =>
    a.name.localeCompare(b.name)
  )
}

export async function fetchPerkTrees(): Promise<PerkTree[]> {
  const response = await fetch(getDataUrl('data/perk-trees.json'))
  if (!response.ok) {
    throw new Error('Failed to load perk trees data')
  }
  return response.json()
}

export async function fetchSkillsAndPerks(): Promise<{
  skills: Skill[]
  perkTrees: PerkTree[]
}> {
  try {
    const [skills, perkTrees] = await Promise.all([
      fetchSkills(),
      fetchPerkTrees(),
    ])
    return { skills, perkTrees }
  } catch (error) {
    throw new Error(`Failed to load skills and perks data: ${error}`)
  }
}

// Data transformation functions
export function transformSkillToDisplayFormat(skill: Skill) {
  return {
    id: skill.edid,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    scaling: skill.scaling,
    keyAbilities: skill.keyAbilities,
    metaTags: skill.metaTags,
    abbreviation: skill.abbreviation,
  }
}

export function transformPerkTreeToDisplayFormat(perkTree: PerkTree) {
  return {
    ...perkTree,
    perks: perkTree.perks.map(perk => ({
      ...perk,
      selected: false,
      currentRank: 0,
    })),
  }
}

export function getPerkTreeForSkill(
  skillId: string,
  perkTrees: PerkTree[]
): PerkTree | undefined {
  return perkTrees.find(tree => tree.treeId === skillId)
}

export function getPerkCountForSkill(
  skillId: string,
  perkTrees: PerkTree[]
): number {
  const tree = getPerkTreeForSkill(skillId, perkTrees)
  return tree ? tree.perks.length : 0
} 