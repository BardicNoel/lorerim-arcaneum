// Skill adapter - transforms model data for UI consumption
import type { Skill } from '../model/types'
import type { SkillState } from '../model/skillState'
import type { PerkState } from '../model/perkState'
import { 
  createSkillState, 
  canAssignMajorSkill, 
  canAssignMinorSkill,
  isSkillAssigned,
  getSkillAssignmentCount,
  SKILL_LIMITS
} from '../model/skillState'
import { 
  validateSkillAssignment,
  getSkillWithPerkInfo,
  calculateSkillLevel
} from '../model/skillLogic'
import { fetchSkills, fetchPerkTrees } from '../model/skillData'

// UI-friendly skill interface
export interface UISkill {
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
  selectedPerks: number
  isSelected: boolean
}

// UI-friendly skill assignment interface
export interface UISkillAssignment {
  skillId: string
  type: 'major' | 'minor'
  valid: boolean
  reason?: string
}

// UI-friendly skill summary interface
export interface UISkillSummary {
  majorCount: number
  minorCount: number
  totalCount: number
  majorLimit: number
  minorLimit: number
  canAssignMore: boolean
}

// Skill adapter class
export class SkillAdapter {
  private skillState: SkillState
  private perkState: PerkState
  private skills: Skill[] = []
  private perkTrees: any[] = []

  constructor() {
    this.skillState = createSkillState()
    this.perkState = { selectedPerks: {}, perkRanks: {} }
  }

  // Initialize adapter with data
  async initialize(): Promise<void> {
    try {
      const [skillsData, perkTreesData] = await Promise.all([
        fetchSkills(),
        fetchPerkTrees()
      ])
      this.skills = skillsData
      this.perkTrees = perkTreesData
    } catch (error) {
      console.error('Failed to initialize skill adapter:', error)
      throw error
    }
  }

  // Get all skills with UI-friendly data
  getSkills(): UISkill[] {
    return this.skills.map(skill => this.transformSkillForUI(skill))
  }

  // Get skills by category
  getSkillsByCategory(category: string): UISkill[] {
    return this.skills
      .filter(skill => skill.category === category)
      .map(skill => this.transformSkillForUI(skill))
  }

  // Get skill by ID
  getSkillById(skillId: string): UISkill | null {
    const skill = this.skills.find(s => s.edid === skillId)
    return skill ? this.transformSkillForUI(skill) : null
  }

  // Get skill assignment summary
  getSkillSummary(): UISkillSummary {
    const counts = getSkillAssignmentCount(this.skillState)
    return {
      majorCount: counts.majorCount,
      minorCount: counts.minorCount,
      totalCount: counts.totalCount,
      majorLimit: counts.majorLimit,
      minorLimit: counts.minorLimit,
      canAssignMore: counts.majorCount < counts.majorLimit || counts.minorCount < counts.minorLimit
    }
  }

  // Validate skill assignment
  validateAssignment(skillId: string, type: 'major' | 'minor'): UISkillAssignment {
    const validation = validateSkillAssignment(skillId, type, this.skillState)
    return {
      skillId,
      type,
      valid: validation.valid,
      reason: validation.reason
    }
  }

  // Assign skill
  assignSkill(skillId: string, type: 'major' | 'minor'): UISkillAssignment {
    const validation = this.validateAssignment(skillId, type)
    
    if (validation.valid) {
      // Remove from other assignment types first
      this.skillState.majorSkills = this.skillState.majorSkills.filter(id => id !== skillId)
      this.skillState.minorSkills = this.skillState.minorSkills.filter(id => id !== skillId)
      
      // Add to new assignment type
      if (type === 'major') {
        this.skillState.majorSkills.push(skillId)
      } else {
        this.skillState.minorSkills.push(skillId)
      }
    }

    return validation
  }

  // Unassign skill
  unassignSkill(skillId: string): void {
    this.skillState.majorSkills = this.skillState.majorSkills.filter(id => id !== skillId)
    this.skillState.minorSkills = this.skillState.minorSkills.filter(id => id !== skillId)
  }

  // Set selected skill
  setSelectedSkill(skillId: string | null): void {
    this.skillState.selectedSkill = skillId
  }

  // Get selected skill
  getSelectedSkill(): UISkill | null {
    if (!this.skillState.selectedSkill) return null
    return this.getSkillById(this.skillState.selectedSkill)
  }

  // Get skills that can be assigned as major
  getAvailableMajorSkills(): UISkill[] {
    return this.skills
      .filter((skill: Skill) => canAssignMajorSkill(this.skillState))
      .map(skill => this.transformSkillForUI(skill))
  }

  // Get skills that can be assigned as minor
  getAvailableMinorSkills(): UISkill[] {
    return this.skills
      .filter((skill: Skill) => canAssignMinorSkill(this.skillState))
      .map(skill => this.transformSkillForUI(skill))
  }

  // Search skills by name or tags
  searchSkills(query: string): UISkill[] {
    const lowerQuery = query.toLowerCase()
    return this.skills
      .filter(skill => 
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.metaTags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        skill.category.toLowerCase().includes(lowerQuery)
      )
      .map(skill => this.transformSkillForUI(skill))
  }

  // Get skills by assignment type
  getSkillsByAssignment(type: 'major' | 'minor'): UISkill[] {
    const skillIds = type === 'major' ? this.skillState.majorSkills : this.skillState.minorSkills
    return skillIds
      .map((id: string) => this.getSkillById(id))
      .filter((skill): skill is UISkill => skill !== null)
  }

  // Export current state (for persistence)
  exportState(): { skillState: SkillState; perkState: PerkState } {
    return {
      skillState: { ...this.skillState },
      perkState: { ...this.perkState }
    }
  }

  // Import state (for restoration)
  importState(state: { skillState: SkillState; perkState: PerkState }): void {
    this.skillState = { ...state.skillState }
    this.perkState = { ...state.perkState }
  }

  // Private method to transform skill for UI
  private transformSkillForUI(skill: Skill): UISkill {
    const assignmentType = isSkillAssigned(skill.edid, this.skillState)
    const skillWithPerks = getSkillWithPerkInfo(skill, this.perkTrees, this.perkState)
    const level = calculateSkillLevel(skill.edid, this.skillState, this.perkState)

    return {
      id: skill.edid,
      name: skill.name,
      category: skill.category,
      description: skill.description,
      scaling: skill.scaling,
      keyAbilities: skill.keyAbilities,
      metaTags: skill.metaTags,
      assignmentType,
      canAssignMajor: canAssignMajorSkill(this.skillState),
      canAssignMinor: canAssignMinorSkill(this.skillState),
      level,
      totalPerks: skillWithPerks.totalPerks,
      selectedPerks: skillWithPerks.selectedPerks,
      isSelected: this.skillState.selectedSkill === skill.edid
    }
  }

  // Update perk state (called by perk adapter)
  updatePerkState(perkState: PerkState): void {
    this.perkState = perkState
  }
} 