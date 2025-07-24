// Pure business logic - no UI dependencies
import type { Skill, PerkTree, PerkNode } from './types'
import type { SkillState } from './skillState'
import type { PerkState } from './perkState'
import { SKILL_LIMITS } from './skillState'

// ============================================================================
// SKILL ASSIGNMENT LOGIC
// ============================================================================

export function canAssignSkill(
  skillId: string,
  type: 'major' | 'minor',
  currentState: SkillState
): boolean {
  if (type === 'major') {
    return currentState.majorSkills.length < SKILL_LIMITS.MAJOR
  }
  return currentState.minorSkills.length < SKILL_LIMITS.MINOR
}

export function validateSkillAssignment(
  skillId: string,
  type: 'major' | 'minor',
  currentState: SkillState
): { valid: boolean; reason?: string } {
  // Check if skill is already assigned
  const currentAssignment = isSkillAssigned(skillId, currentState)
  if (currentAssignment === type) {
    return { valid: false, reason: 'Skill is already assigned as this type' }
  }

  // Check if we can assign this type
  if (!canAssignSkill(skillId, type, currentState)) {
    return { 
      valid: false, 
      reason: `Cannot assign more ${type} skills (limit reached)` 
    }
  }

  return { valid: true }
}

export function isSkillAssigned(
  skillId: string,
  currentState: SkillState
): 'major' | 'minor' | 'none' {
  if (currentState.majorSkills.includes(skillId)) {
    return 'major'
  }
  if (currentState.minorSkills.includes(skillId)) {
    return 'minor'
  }
  return 'none'
}

// ============================================================================
// PERK SELECTION LOGIC
// ============================================================================

export function getAllPrerequisites(
  perkId: string,
  tree: PerkTree,
  visited = new Set<string>()
): string[] {
  if (visited.has(perkId)) return [] // Prevent cycles
  visited.add(perkId)

  const perk = tree.perks.find(p => p.edid === perkId)
  if (!perk) return []

  const prerequisites: string[] = []
  
  // Use connections.parents for prerequisite structure
  perk.connections.parents.forEach(parentId => {
    // Check if this prerequisite exists in our tree
    const existsInTree = tree.perks.some(p => p.edid === parentId)
    if (existsInTree && !visited.has(parentId)) {
      prerequisites.push(parentId)
      // Recursively get prerequisites of prerequisites
      const subPrereqs = getAllPrerequisites(parentId, tree, visited)
      prerequisites.push(...subPrereqs)
    }
  })

  return [...new Set(prerequisites)] // Remove duplicates
}

export function getAllDescendants(
  perkId: string,
  tree: PerkTree,
  visited = new Set<string>()
): string[] {
  if (visited.has(perkId)) return [] // Prevent cycles
  visited.add(perkId)

  const descendants: string[] = []

  // Find all perks that have this perk as a prerequisite
  tree.perks.forEach(perk => {
    if (perk.connections.parents.includes(perkId)) {
      descendants.push(perk.edid)
      // Recursively get descendants of descendants
      const subDescendants = getAllDescendants(perk.edid, tree, visited)
      descendants.push(...subDescendants)
    }
  })

  return [...new Set(descendants)] // Remove duplicates
}

export function canSelectPerk(
  perkId: string,
  tree: PerkTree,
  perkState: PerkState,
  skillId: string
): boolean {
  const perk = tree.perks.find(p => p.edid === perkId)
  if (!perk) return false

  // Check if perk is already selected
  const isSelected = perkState.selectedPerks[skillId]?.includes(perkId) ?? false
  if (isSelected) return true

  // Root perks are always selectable
  if (perk.isRoot) return true

  // Check prerequisites
  const prerequisites = getAllPrerequisites(perkId, tree)
  const hasAllPrerequisites = prerequisites.every(prereqId =>
    perkState.selectedPerks[skillId]?.includes(prereqId) ?? false
  )

  return hasAllPrerequisites
}

export function validatePerkSelection(
  perkId: string,
  tree: PerkTree,
  perkState: PerkState,
  skillId: string
): { valid: boolean; reason?: string } {
  if (!canSelectPerk(perkId, tree, perkState, skillId)) {
    return { 
      valid: false, 
      reason: 'Prerequisites not met or perk not available' 
    }
  }

  return { valid: true }
}

// ============================================================================
// PERK RANK LOGIC
// ============================================================================

export function canIncreasePerkRank(
  perkId: string,
  tree: PerkTree,
  perkState: PerkState,
  skillId: string
): boolean {
  const perk = tree.perks.find(p => p.edid === perkId)
  if (!perk) return false

  const currentRank = perkState.perkRanks[perkId] ?? 0
  const maxRank = perk.totalRanks

  return currentRank < maxRank
}

export function validatePerkRankUpdate(
  perkId: string,
  newRank: number,
  tree: PerkTree,
  perkState: PerkState,
  skillId: string
): { valid: boolean; reason?: string } {
  const perk = tree.perks.find(p => p.edid === perkId)
  if (!perk) {
    return { valid: false, reason: 'Perk not found' }
  }

  if (newRank < 0 || newRank > perk.totalRanks) {
    return { 
      valid: false, 
      reason: `Rank must be between 0 and ${perk.totalRanks}` 
    }
  }

  // Check if perk is selected when trying to set rank > 0
  if (newRank > 0) {
    const isSelected = perkState.selectedPerks[skillId]?.includes(perkId) ?? false
    if (!isSelected) {
      return { valid: false, reason: 'Perk must be selected to have rank > 0' }
    }
  }

  return { valid: true }
}

// ============================================================================
// SKILL-PERK INTEGRATION LOGIC
// ============================================================================

export function getSkillWithPerkInfo(
  skill: Skill,
  perkTrees: PerkTree[],
  perkState: PerkState
) {
  const perkTree = perkTrees.find(tree => tree.treeId === skill.edid)
  const totalPerks = perkTree ? perkTree.perks.length : 0
  const selectedPerks = perkState.selectedPerks[skill.edid]?.length ?? 0

  return {
    ...skill,
    totalPerks,
    selectedPerks,
  }
}

export function calculateSkillLevel(
  skillId: string,
  skillState: SkillState,
  perkState: PerkState
): number {
  // Base level from skill assignment
  let level = 0
  if (skillState.majorSkills.includes(skillId)) {
    level += 25 // Major skills start at level 25
  } else if (skillState.minorSkills.includes(skillId)) {
    level += 15 // Minor skills start at level 15
  }

  // Add levels from perks
  const selectedPerks = perkState.selectedPerks[skillId] ?? []
  selectedPerks.forEach(perkId => {
    const perkRank = perkState.perkRanks[perkId] ?? 0
    level += perkRank * 5 // Each perk rank adds 5 levels
  })

  return level
} 