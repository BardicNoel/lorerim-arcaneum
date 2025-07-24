// Unified adapter - coordinates skill and perk adapters
import { SkillAdapter, type UISkill, type UISkillAssignment, type UISkillSummary } from './skillAdapter'
import { PerkAdapter, type UIPerk, type UIPerkTree, type UIPerkSelection, type UIPerkRankUpdate } from './perkAdapter'
import type { SkillState, PerkState } from '../model'

// Unified skill with perk information
export interface UnifiedSkill {
  // Basic skill properties
  id: string
  name: string
  category: string
  description: string
  scaling: string
  keyAbilities: string[]
  metaTags: string[]
  assignmentType: 'major' | 'minor' | 'none'
  canAssignMajor: boolean
  canAssignMinor: boolean
  level: number
  totalPerks: number
  selectedPerksCount: number
  isSelected: boolean
  
  // Perk information
  perkTree: UIPerkTree | null
  perks: UIPerk[]
  selectedPerks: UIPerk[]
  availablePerks: UIPerk[]
}

// Unified build state
export interface UnifiedBuildState {
  skills: UnifiedSkill[]
  skillSummary: UISkillSummary
  totalPerks: number
  totalPerkRanks: number
  selectedSkill: UnifiedSkill | null
}

// Unified search result
export interface UnifiedSearchResult {
  skills: UnifiedSkill[]
  perks: UIPerk[]
  totalResults: number
}

// Unified adapter class
export class UnifiedAdapter {
  private skillAdapter: SkillAdapter
  private perkAdapter: PerkAdapter
  private isInitialized = false

  constructor() {
    this.skillAdapter = new SkillAdapter()
    this.perkAdapter = new PerkAdapter()
  }

  // Initialize both adapters
  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      await Promise.all([
        this.skillAdapter.initialize(),
        this.perkAdapter.initialize()
      ])
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize unified adapter:', error)
      throw error
    }
  }

  // Get unified build state
  getBuildState(): UnifiedBuildState {
    const skills = this.getUnifiedSkills()
    const skillSummary = this.skillAdapter.getSkillSummary()
    const selectedSkill = this.getSelectedSkill()
    
    // Calculate total perks and ranks
    let totalPerks = 0
    let totalPerkRanks = 0
    
    skills.forEach(skill => {
      totalPerks += skill.selectedPerks.length
      totalPerkRanks += skill.selectedPerks.reduce((sum, perk) => sum + perk.currentRank, 0)
    })

    return {
      skills,
      skillSummary,
      totalPerks,
      totalPerkRanks,
      selectedSkill
    }
  }

  // Get all unified skills
  getUnifiedSkills(): UnifiedSkill[] {
    const skills = this.skillAdapter.getSkills()
    return skills.map(skill => this.enrichSkillWithPerks(skill))
  }

  // Get unified skill by ID
  getUnifiedSkillById(skillId: string): UnifiedSkill | null {
    const skill = this.skillAdapter.getSkillById(skillId)
    return skill ? this.enrichSkillWithPerks(skill) : null
  }

  // Get skills by category
  getSkillsByCategory(category: string): UnifiedSkill[] {
    const skills = this.skillAdapter.getSkillsByCategory(category)
    return skills.map(skill => this.enrichSkillWithPerks(skill))
  }

  // Get skills by assignment type
  getSkillsByAssignment(type: 'major' | 'minor'): UnifiedSkill[] {
    const skills = this.skillAdapter.getSkillsByAssignment(type)
    return skills.map(skill => this.enrichSkillWithPerks(skill))
  }

  // Get selected skill
  getSelectedSkill(): UnifiedSkill | null {
    const skill = this.skillAdapter.getSelectedSkill()
    return skill ? this.enrichSkillWithPerks(skill) : null
  }

  // Set selected skill
  setSelectedSkill(skillId: string | null): void {
    this.skillAdapter.setSelectedSkill(skillId)
  }

  // Assign skill
  assignSkill(skillId: string, type: 'major' | 'minor'): UISkillAssignment {
    return this.skillAdapter.assignSkill(skillId, type)
  }

  // Unassign skill
  unassignSkill(skillId: string): void {
    this.skillAdapter.unassignSkill(skillId)
  }

  // Select perk
  selectPerk(perkId: string, skillId: string): UIPerkSelection {
    const result = this.perkAdapter.selectPerk(perkId, skillId)
    
    // Update skill adapter with new perk state
    if (result.valid) {
      this.skillAdapter.updatePerkState(this.perkAdapter.exportState())
    }
    
    return result
  }

  // Deselect perk
  deselectPerk(perkId: string, skillId: string): void {
    this.perkAdapter.deselectPerk(perkId, skillId)
    this.skillAdapter.updatePerkState(this.perkAdapter.exportState())
  }

  // Update perk rank
  updatePerkRank(perkId: string, skillId: string, newRank: number): UIPerkRankUpdate {
    const result = this.perkAdapter.updatePerkRank(perkId, skillId, newRank)
    
    // Update skill adapter with new perk state
    if (result.valid) {
      this.skillAdapter.updatePerkState(this.perkAdapter.exportState())
    }
    
    return result
  }

  // Search across skills and perks
  search(query: string): UnifiedSearchResult {
    const skills = this.skillAdapter.searchSkills(query)
    const perks = this.perkAdapter.searchPerks(query)
    
    const unifiedSkills = skills.map(skill => this.enrichSkillWithPerks(skill))
    
    return {
      skills: unifiedSkills,
      perks,
      totalResults: unifiedSkills.length + perks.length
    }
  }

  // Get available skills for assignment
  getAvailableSkillsForAssignment(type: 'major' | 'minor'): UnifiedSkill[] {
    const skills = type === 'major' 
      ? this.skillAdapter.getAvailableMajorSkills()
      : this.skillAdapter.getAvailableMinorSkills()
    
    return skills.map(skill => this.enrichSkillWithPerks(skill))
  }

  // Get perk tree for skill
  getPerkTreeForSkill(skillId: string): UIPerkTree | null {
    return this.perkAdapter.getPerkTreeBySkillId(skillId)
  }

  // Get perks for skill
  getPerksForSkill(skillId: string): UIPerk[] {
    return this.perkAdapter.getPerksForSkill(skillId)
  }

  // Get selected perks for skill
  getSelectedPerksForSkill(skillId: string): UIPerk[] {
    return this.perkAdapter.getSelectedPerksForSkill(skillId)
  }

  // Get available perks for skill
  getAvailablePerksForSkill(skillId: string): UIPerk[] {
    return this.perkAdapter.getAvailablePerksForSkill(skillId)
  }

  // Get perk statistics for skill
  getPerkStatsForSkill(skillId: string): {
    totalPerks: number
    selectedPerks: number
    totalRanks: number
  } {
    return this.perkAdapter.getPerkStatsForSkill(skillId)
  }

  // Validate skill assignment
  validateSkillAssignment(skillId: string, type: 'major' | 'minor'): UISkillAssignment {
    return this.skillAdapter.validateAssignment(skillId, type)
  }

  // Validate perk selection
  validatePerkSelection(perkId: string, skillId: string): UIPerkSelection {
    return this.perkAdapter.validatePerkSelection(perkId, skillId)
  }

  // Get skill summary
  getSkillSummary(): UISkillSummary {
    return this.skillAdapter.getSkillSummary()
  }

  // Export complete state
  exportState(): { skillState: SkillState; perkState: PerkState } {
    return {
      skillState: this.skillAdapter.exportState().skillState,
      perkState: this.perkAdapter.exportState()
    }
  }

  // Import complete state
  importState(state: { skillState: SkillState; perkState: PerkState }): void {
    this.skillAdapter.importState(state)
    this.perkAdapter.importState(state.perkState)
  }

  // Reset all state
  reset(): void {
    this.skillAdapter = new SkillAdapter()
    this.perkAdapter = new PerkAdapter()
  }

  // Private method to enrich skill with perk information
  private enrichSkillWithPerks(skill: UISkill): UnifiedSkill {
    const perkTree = this.perkAdapter.getPerkTreeBySkillId(skill.id)
    const perks = this.perkAdapter.getPerksForSkill(skill.id)
    const selectedPerks = this.perkAdapter.getSelectedPerksForSkill(skill.id)
    const availablePerks = this.perkAdapter.getAvailablePerksForSkill(skill.id)

    return {
      // Basic skill properties
      id: skill.id,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      scaling: skill.scaling,
      keyAbilities: skill.keyAbilities,
      metaTags: skill.metaTags,
      assignmentType: skill.assignmentType,
      canAssignMajor: skill.canAssignMajor,
      canAssignMinor: skill.canAssignMinor,
      level: skill.level,
      totalPerks: skill.totalPerks,
      selectedPerksCount: skill.selectedPerks,
      isSelected: skill.isSelected,
      
      // Perk information
      perkTree,
      perks,
      selectedPerks,
      availablePerks
    }
  }
} 