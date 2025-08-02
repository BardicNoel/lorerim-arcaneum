interface SkillLevelRequirement {
  skill: string
  level: number
}

interface PerkRank {
  rank: number
  edid: string
  name: string
  description: {
    base: string
    subtext: string
  }
  prerequisites?: {
    skillLevel?: SkillLevelRequirement
    items?: Array<{
      type: string
      id: string
    }>
  }
}

interface Perk {
  edid: string
  name: string
  ranks: PerkRank[]
  totalRanks: number
  connections: {
    parents: string[]
    children: string[]
  }
  isRoot: boolean
  position: {
    x: number
    y: number
    horizontal: number
    vertical: number
  }
}

interface PerkTree {
  treeId: string
  treeName: string
  treeDescription: string
  category: string
  perks: Perk[]
}

import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'

/**
 * Get perk trees data from the centralized store
 */
function getPerkTreesData(): PerkTree[] {
  return usePerkTreesStore.getState().data
}

/**
 * Calculate the minimum skill level required for a given skill based on selected perks
 * @param skillId - The skill ID (e.g., 'AVSmithing')
 * @param selectedPerks - Array of selected perk EDIDs for this skill
 * @param perkRanks - Record of perk EDID to current rank
 * @returns The minimum required skill level, or 0 if no perks require a level
 */
export function calculateMinimumSkillLevel(
  skillId: string,
  selectedPerks: string[],
  perkRanks: Record<string, number>
): number {
  if (selectedPerks.length === 0) {
    return 0
  }

  // Get perk trees data from store
  const perkTreesData = getPerkTreesData()

  // Find the perk tree for this skill
  const perkTree = perkTreesData.find(tree => tree.treeId === skillId)
  if (!perkTree) {
    return 0
  }

  let maxRequiredLevel = 0

  // Check each selected perk
  for (const perkEdid of selectedPerks) {
    const perk = perkTree.perks.find(p => p.edid === perkEdid)
    if (!perk) continue

    // Get the current rank for this perk (default to 1 if not specified)
    const currentRank = perkRanks[perkEdid] || 1

    // Find the rank data for the current rank
    const rankData = perk.ranks.find(r => r.rank === currentRank)
    if (!rankData) continue

    // Check if this rank has a skill level requirement
    if (rankData.prerequisites?.skillLevel) {
      const requiredLevel = rankData.prerequisites.skillLevel.level
      maxRequiredLevel = Math.max(maxRequiredLevel, requiredLevel)
    }
  }

  return maxRequiredLevel
}

/**
 * Calculate minimum skill levels for all skills based on selected perks
 * @param perks - The perks object from build state
 * @returns Record of skillId to minimum required level
 */
export function calculateAllSkillLevels(perks: {
  selected: Record<string, string[]>
  ranks: Record<string, number>
}): Record<string, number> {
  const skillLevels: Record<string, number> = {}

  // Calculate minimum level for each skill that has selected perks
  for (const [skillId, selectedPerks] of Object.entries(perks.selected)) {
    if (selectedPerks.length > 0) {
      const minLevel = calculateMinimumSkillLevel(
        skillId,
        selectedPerks,
        perks.ranks
      )
      // Only include skills that actually have level requirements
      if (minLevel > 0) {
        skillLevels[skillId] = minLevel
      }
    }
  }

  return skillLevels
}
