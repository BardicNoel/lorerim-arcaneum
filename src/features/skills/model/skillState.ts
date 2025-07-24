// Pure skills state management - no UI dependencies

// Global skill constants
export const SKILL_LIMITS = {
  MAJOR: 3,
  MINOR: 6,
} as const

export interface SkillState {
  majorSkills: string[]
  minorSkills: string[]
  selectedSkill: string | null
}

export interface SkillAssignment {
  skillId: string
  type: 'major' | 'minor' | 'none'
}

export interface SkillSelection {
  skillId: string | null
  isSelected: boolean
}

export const createSkillState = (): SkillState => ({
  majorSkills: [],
  minorSkills: [],
  selectedSkill: null,
})

export const createSkillAssignment = (
  skillId: string,
  type: 'major' | 'minor' | 'none'
): SkillAssignment => ({
  skillId,
  type,
})

export const createSkillSelection = (
  skillId: string | null,
  isSelected: boolean = false
): SkillSelection => ({
  skillId,
  isSelected,
})

// Pure state validation functions
export const canAssignMajorSkill = (currentState: SkillState): boolean => {
  return currentState.majorSkills.length < SKILL_LIMITS.MAJOR
}

export const canAssignMinorSkill = (currentState: SkillState): boolean => {
  return currentState.minorSkills.length < SKILL_LIMITS.MINOR
}

export const isSkillAssigned = (
  skillId: string,
  currentState: SkillState
): 'major' | 'minor' | 'none' => {
  if (currentState.majorSkills.includes(skillId)) {
    return 'major'
  }
  if (currentState.minorSkills.includes(skillId)) {
    return 'minor'
  }
  return 'none'
}

export const getSkillAssignmentCount = (currentState: SkillState) => {
  return {
    majorCount: currentState.majorSkills.length,
    minorCount: currentState.minorSkills.length,
    totalCount: currentState.majorSkills.length + currentState.minorSkills.length,
    majorLimit: SKILL_LIMITS.MAJOR,
    minorLimit: SKILL_LIMITS.MINOR,
  }
} 