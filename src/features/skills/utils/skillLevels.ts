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
import { useRacesStore } from '@/shared/stores/racesStore'
import { useSkillsStore } from '@/shared/stores/skillsStore'
import type { BuildState } from '@/shared/types/build'

/**
 * Get perk trees data from the centralized store
 */
function getPerkTreesData(): PerkTree[] {
  return usePerkTreesStore.getState().data
}

/**
 * Get races data from the centralized store
 */
function getRacesData() {
  return useRacesStore.getState().data
}

/**
 * Get skill display name from skill ID
 */
function getSkillDisplayName(skillId: string): string {
  const skillsData = useSkillsStore.getState().data
  const skill = skillsData.find(s => s.edid === skillId)
  return skill?.name || skillId
}

/**
 * Get skill ID from display name
 */
function getSkillIdFromDisplayName(displayName: string): string {
  const skillsData = useSkillsStore.getState().data
  const skill = skillsData.find(s => s.name === displayName)
  return skill?.edid || displayName
}

/**
 * Calculate the starting skill level for a given skill
 * Formula: 0 + Race Bonus + Major Skill Bonus (+10) + Minor Skill Bonus (+5)
 * @param skillId - The skill ID (e.g., 'AVSmithing')
 * @param build - The current character build state
 * @returns The starting skill level
 */
export function calculateStartingSkillLevel(
  skillId: string,
  build: BuildState
): number {
  let startingLevel = 0

  // Add race bonus if race is selected
  if (build.race) {
    const races = getRacesData()
    const selectedRace = races.find(race => race.edid === build.race)

    if (selectedRace?.skillBonuses) {
      // Convert skill ID to display name for race bonus lookup
      const skillDisplayName = getSkillDisplayName(skillId)
      const raceBonus = selectedRace.skillBonuses.find(
        bonus => bonus.skill === skillDisplayName
      )
      if (raceBonus) {
        startingLevel += raceBonus.bonus
      }
    }
  }

  // Add major skill bonus (+10) - prioritize major over minor
  if (build.skills.major.includes(skillId)) {
    startingLevel += 10
  }
  // Add minor skill bonus (+5) only if not already a major skill
  else if (build.skills.minor.includes(skillId)) {
    startingLevel += 5
  }

  return startingLevel
}

/**
 * Calculate the total skill level for a given skill
 * Formula: starting level + levels from perks
 * @param skillId - The skill ID (e.g., 'AVSmithing')
 * @param build - The current character build state
 * @returns The total skill level
 */
export function calculateTotalSkillLevel(
  skillId: string,
  build: BuildState
): number {
  // Get starting level
  const startingLevel = calculateStartingSkillLevel(skillId, build)

  // Get levels from perks
  const selectedPerks = build.perks?.selected?.[skillId] || []
  const perkRanks = build.perks?.ranks || {}

  const perkLevels = calculateMinimumSkillLevel(
    skillId,
    selectedPerks,
    perkRanks
  )

  return startingLevel + perkLevels
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
