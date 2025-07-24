// Pure perks state management - no UI dependencies
import type { PerkNode } from './types'

export interface PerkState {
  selectedPerks: Record<string, string[]> // skillId -> perkIds
  perkRanks: Record<string, number>       // perkId -> rank
}

export interface PerkSelection {
  perkId: string
  skillId: string
  isSelected: boolean
  currentRank: number
}

export interface PerkRankUpdate {
  perkId: string
  newRank: number
  skillId: string
}

export const createPerkState = (): PerkState => ({
  selectedPerks: {},
  perkRanks: {},
})

export const createPerkSelection = (
  perkId: string,
  skillId: string,
  isSelected: boolean = false,
  currentRank: number = 0
): PerkSelection => ({
  perkId,
  skillId,
  isSelected,
  currentRank,
})

export const createPerkRankUpdate = (
  perkId: string,
  newRank: number,
  skillId: string
): PerkRankUpdate => ({
  perkId,
  newRank,
  skillId,
})

// Pure state validation functions
export const isPerkSelected = (
  perkId: string,
  skillId: string,
  currentState: PerkState
): boolean => {
  return currentState.selectedPerks[skillId]?.includes(perkId) ?? false
}

export const getPerkRank = (
  perkId: string,
  currentState: PerkState
): number => {
  return currentState.perkRanks[perkId] ?? 0
}

export const getSelectedPerksForSkill = (
  skillId: string,
  currentState: PerkState
): string[] => {
  return currentState.selectedPerks[skillId] ?? []
}

export const getPerkCountForSkill = (
  skillId: string,
  currentState: PerkState
): number => {
  return getSelectedPerksForSkill(skillId, currentState).length
}

export const getTotalPerkRanksForSkill = (
  skillId: string,
  currentState: PerkState
): number => {
  const selectedPerks = getSelectedPerksForSkill(skillId, currentState)
  return selectedPerks.reduce((total, perkId) => {
    return total + getPerkRank(perkId, currentState)
  }, 0)
}

export const canSelectPerk = (
  perkId: string,
  skillId: string,
  currentState: PerkState,
  perkNode: PerkNode
): boolean => {
  // Check if perk is already selected
  if (isPerkSelected(perkId, skillId, currentState)) {
    return true
  }

  // Check if perk is a root perk (always selectable)
  if (perkNode.isRoot) {
    return true
  }

  // Check prerequisites (simplified - would need more complex logic)
  // For now, assume all non-root perks require at least one parent to be selected
  const hasSelectedParent = perkNode.connections.parents.some(parentId =>
    isPerkSelected(parentId, skillId, currentState)
  )

  return hasSelectedParent
} 