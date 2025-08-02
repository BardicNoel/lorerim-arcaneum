// Pure data access - now uses centralized stores
import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'
import { useSkillsStore } from '@/shared/stores/skillsStore'
import type { PerkTree, Skill } from './types'

export function fetchSkills(): Skill[] {
  const skills = useSkillsStore.getState().data
  return skills.sort((a: Skill, b: Skill) => a.name.localeCompare(b.name))
}

export function fetchPerkTrees(): PerkTree[] {
  return usePerkTreesStore.getState().data
}

export function fetchSkillsAndPerks(): {
  skills: Skill[]
  perkTrees: PerkTree[]
} {
  return {
    skills: fetchSkills(),
    perkTrees: fetchPerkTrees(),
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
