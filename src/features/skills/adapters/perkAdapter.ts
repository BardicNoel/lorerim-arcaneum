// Perk adapter - transforms perk tree data for UI consumption
import type { PerkTree, PerkNode } from '../model/types'
import type { PerkState } from '../model/perkState'
import { 
  createPerkState,
  isPerkSelected,
  getPerkRank,
  getSelectedPerksForSkill,
  getPerkCountForSkill,
  getTotalPerkRanksForSkill
} from '../model/perkState'
import {
  canSelectPerk,
  validatePerkSelection,
  canIncreasePerkRank,
  validatePerkRankUpdate,
  getAllPrerequisites,
  getAllDescendants
} from '../model/skillLogic'
import { fetchPerkTrees } from '../model/skillData'

// UI-friendly perk interface
export interface UIPerk {
  id: string
  name: string
  skillId: string
  totalRanks: number
  currentRank: number
  isSelected: boolean
  isRoot: boolean
  canSelect: boolean
  canIncreaseRank: boolean
  prerequisites: string[]
  descendants: string[]
  position: {
    x: number
    y: number
    horizontal: number
    vertical: number
  }
}

// UI-friendly perk tree interface
export interface UIPerkTree {
  id: string
  name: string
  description: string
  category: string
  perks: UIPerk[]
  totalPerks: number
  selectedPerks: number
  totalRanks: number
}

// UI-friendly perk selection interface
export interface UIPerkSelection {
  perkId: string
  skillId: string
  valid: boolean
  reason?: string
}

// UI-friendly perk rank update interface
export interface UIPerkRankUpdate {
  perkId: string
  skillId: string
  newRank: number
  valid: boolean
  reason?: string
}

// Perk adapter class
export class PerkAdapter {
  private perkState: PerkState
  private perkTrees: PerkTree[] = []

  constructor() {
    this.perkState = createPerkState()
  }

  // Initialize adapter with data
  async initialize(): Promise<void> {
    try {
      this.perkTrees = await fetchPerkTrees()
    } catch (error) {
      console.error('Failed to initialize perk adapter:', error)
      throw error
    }
  }

  // Get all perk trees with UI-friendly data
  getPerkTrees(): UIPerkTree[] {
    return this.perkTrees.map(tree => this.transformPerkTreeForUI(tree))
  }

  // Get perk tree by skill ID
  getPerkTreeBySkillId(skillId: string): UIPerkTree | null {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    return tree ? this.transformPerkTreeForUI(tree) : null
  }

  // Get perk by ID
  getPerkById(perkId: string, skillId: string): UIPerk | null {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    if (!tree) return null

    const perk = tree.perks.find(p => p.edid === perkId)
    return perk ? this.transformPerkForUI(perk, tree) : null
  }

  // Get perks for a skill
  getPerksForSkill(skillId: string): UIPerk[] {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    if (!tree) return []

    return tree.perks.map(perk => this.transformPerkForUI(perk, tree))
  }

  // Get selected perks for a skill
  getSelectedPerksForSkill(skillId: string): UIPerk[] {
    const selectedPerkIds = getSelectedPerksForSkill(skillId, this.perkState)
    return selectedPerkIds
      .map(perkId => this.getPerkById(perkId, skillId))
      .filter((perk): perk is UIPerk => perk !== null)
  }

  // Validate perk selection
  validatePerkSelection(perkId: string, skillId: string): UIPerkSelection {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    if (!tree) {
      return {
        perkId,
        skillId,
        valid: false,
        reason: 'Perk tree not found for skill'
      }
    }

    const validation = validatePerkSelection(perkId, tree, this.perkState, skillId)
    return {
      perkId,
      skillId,
      valid: validation.valid,
      reason: validation.reason
    }
  }

  // Select perk
  selectPerk(perkId: string, skillId: string): UIPerkSelection {
    const validation = this.validatePerkSelection(perkId, skillId)
    
    if (validation.valid) {
      // Initialize skill array if it doesn't exist
      if (!this.perkState.selectedPerks[skillId]) {
        this.perkState.selectedPerks[skillId] = []
      }
      
      // Add perk if not already selected
      if (!this.perkState.selectedPerks[skillId].includes(perkId)) {
        this.perkState.selectedPerks[skillId].push(perkId)
      }
    }

    return validation
  }

  // Deselect perk
  deselectPerk(perkId: string, skillId: string): void {
    if (this.perkState.selectedPerks[skillId]) {
      this.perkState.selectedPerks[skillId] = this.perkState.selectedPerks[skillId]
        .filter(id => id !== perkId)
    }
    
    // Remove perk rank when deselected
    if (this.perkState.perkRanks[perkId]) {
      delete this.perkState.perkRanks[perkId]
    }
  }

  // Validate perk rank update
  validatePerkRankUpdate(perkId: string, skillId: string, newRank: number): UIPerkRankUpdate {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    if (!tree) {
      return {
        perkId,
        skillId,
        newRank,
        valid: false,
        reason: 'Perk tree not found for skill'
      }
    }

    const validation = validatePerkRankUpdate(perkId, newRank, tree, this.perkState, skillId)
    return {
      perkId,
      skillId,
      newRank,
      valid: validation.valid,
      reason: validation.reason
    }
  }

  // Update perk rank
  updatePerkRank(perkId: string, skillId: string, newRank: number): UIPerkRankUpdate {
    const validation = this.validatePerkRankUpdate(perkId, skillId, newRank)
    
    if (validation.valid) {
      this.perkState.perkRanks[perkId] = newRank
    }

    return validation
  }

  // Get available perks for a skill (can be selected)
  getAvailablePerksForSkill(skillId: string): UIPerk[] {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    if (!tree) return []

    return tree.perks
      .filter(perk => canSelectPerk(perk.edid, tree, this.perkState, skillId))
      .map(perk => this.transformPerkForUI(perk, tree))
  }

  // Get perk prerequisites
  getPerkPrerequisites(perkId: string, skillId: string): string[] {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    if (!tree) return []

    return getAllPrerequisites(perkId, tree)
  }

  // Get perk descendants
  getPerkDescendants(perkId: string, skillId: string): string[] {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    if (!tree) return []

    return getAllDescendants(perkId, tree)
  }

  // Get perk statistics for a skill
  getPerkStatsForSkill(skillId: string): {
    totalPerks: number
    selectedPerks: number
    totalRanks: number
  } {
    const tree = this.perkTrees.find(t => t.treeId === skillId)
    if (!tree) {
      return { totalPerks: 0, selectedPerks: 0, totalRanks: 0 }
    }

    return {
      totalPerks: tree.perks.length,
      selectedPerks: getPerkCountForSkill(skillId, this.perkState),
      totalRanks: getTotalPerkRanksForSkill(skillId, this.perkState)
    }
  }

  // Search perks by name
  searchPerks(query: string): UIPerk[] {
    const lowerQuery = query.toLowerCase()
    const results: UIPerk[] = []

    this.perkTrees.forEach(tree => {
      const matchingPerks = tree.perks
        .filter(perk => perk.name.toLowerCase().includes(lowerQuery))
        .map(perk => this.transformPerkForUI(perk, tree))
      results.push(...matchingPerks)
    })

    return results
  }

  // Export current state (for persistence)
  exportState(): PerkState {
    return { ...this.perkState }
  }

  // Import state (for restoration)
  importState(state: PerkState): void {
    this.perkState = { ...state }
  }

  // Private method to transform perk tree for UI
  private transformPerkTreeForUI(tree: PerkTree): UIPerkTree {
    const perks = tree.perks.map(perk => this.transformPerkForUI(perk, tree))
    const stats = this.getPerkStatsForSkill(tree.treeId)

    return {
      id: tree.treeId,
      name: tree.treeName,
      description: tree.treeDescription,
      category: tree.category,
      perks,
      totalPerks: stats.totalPerks,
      selectedPerks: stats.selectedPerks,
      totalRanks: stats.totalRanks
    }
  }

  // Private method to transform perk for UI
  private transformPerkForUI(perk: PerkNode, tree: PerkTree): UIPerk {
    const skillId = tree.treeId
    const isSelected = isPerkSelected(perk.edid, skillId, this.perkState)
    const currentRank = getPerkRank(perk.edid, this.perkState)
    const canSelect = canSelectPerk(perk.edid, tree, this.perkState, skillId)
    const canIncreaseRank = canIncreasePerkRank(perk.edid, tree, this.perkState, skillId)
    const prerequisites = getAllPrerequisites(perk.edid, tree)
    const descendants = getAllDescendants(perk.edid, tree)

    return {
      id: perk.edid,
      name: perk.name,
      skillId,
      totalRanks: perk.totalRanks,
      currentRank,
      isSelected,
      isRoot: perk.isRoot,
      canSelect,
      canIncreaseRank,
      prerequisites,
      descendants,
      position: perk.position
    }
  }
} 