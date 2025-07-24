import { describe, it, expect } from 'vitest'
import {
  createSkillState,
  createSkillAssignment,
  createSkillSelection,
  canAssignMajorSkill,
  canAssignMinorSkill,
  isSkillAssigned,
  getSkillAssignmentCount,
  SKILL_LIMITS,
} from '../skillState'

describe('Skill State Management', () => {
  describe('SKILL_LIMITS constants', () => {
    it('should have correct limits', () => {
      expect(SKILL_LIMITS.MAJOR).toBe(3)
      expect(SKILL_LIMITS.MINOR).toBe(6)
    })
  })

  describe('createSkillState', () => {
    it('should create empty skill state', () => {
      const state = createSkillState()
      expect(state.majorSkills).toEqual([])
      expect(state.minorSkills).toEqual([])
      expect(state.selectedSkill).toBeNull()
    })
  })

  describe('createSkillAssignment', () => {
    it('should create skill assignment', () => {
      const assignment = createSkillAssignment('archery', 'major')
      expect(assignment.skillId).toBe('archery')
      expect(assignment.type).toBe('major')
    })
  })

  describe('createSkillSelection', () => {
    it('should create skill selection', () => {
      const selection = createSkillSelection('archery', true)
      expect(selection.skillId).toBe('archery')
      expect(selection.isSelected).toBe(true)
    })

    it('should create unselected skill selection by default', () => {
      const selection = createSkillSelection('archery')
      expect(selection.skillId).toBe('archery')
      expect(selection.isSelected).toBe(false)
    })
  })

  describe('canAssignMajorSkill', () => {
    it('should allow assignment when under limit', () => {
      const state = createSkillState()
      expect(canAssignMajorSkill(state)).toBe(true)
    })

    it('should allow assignment when at limit - 1', () => {
      const state = {
        ...createSkillState(),
        majorSkills: ['archery', 'oneHanded'],
      }
      expect(canAssignMajorSkill(state)).toBe(true)
    })

    it('should prevent assignment when at limit', () => {
      const state = {
        ...createSkillState(),
        majorSkills: ['archery', 'oneHanded', 'twoHanded', 'block', 'heavyArmor'],
      }
      expect(canAssignMajorSkill(state)).toBe(false)
    })

    it('should prevent assignment when over limit', () => {
      const state = {
        ...createSkillState(),
        majorSkills: ['archery', 'oneHanded', 'twoHanded', 'block', 'heavyArmor', 'lightArmor'],
      }
      expect(canAssignMajorSkill(state)).toBe(false)
    })
  })

  describe('canAssignMinorSkill', () => {
    it('should allow assignment when under limit', () => {
      const state = createSkillState()
      expect(canAssignMinorSkill(state)).toBe(true)
    })

    it('should allow assignment when at limit - 1', () => {
      const state = {
        ...createSkillState(),
        minorSkills: ['archery', 'oneHanded', 'twoHanded', 'block', 'heavyArmor'],
      }
      expect(canAssignMinorSkill(state)).toBe(true)
    })

    it('should prevent assignment when at limit', () => {
      const state = {
        ...createSkillState(),
        minorSkills: ['archery', 'oneHanded', 'twoHanded', 'block', 'heavyArmor', 'lightArmor'],
      }
      expect(canAssignMinorSkill(state)).toBe(false)
    })
  })

  describe('isSkillAssigned', () => {
    it('should return "none" for unassigned skill', () => {
      const state = createSkillState()
      expect(isSkillAssigned('archery', state)).toBe('none')
    })

    it('should return "major" for major skill', () => {
      const state = {
        ...createSkillState(),
        majorSkills: ['archery'],
      }
      expect(isSkillAssigned('archery', state)).toBe('major')
    })

    it('should return "minor" for minor skill', () => {
      const state = {
        ...createSkillState(),
        minorSkills: ['archery'],
      }
      expect(isSkillAssigned('archery', state)).toBe('minor')
    })

    it('should prioritize major over minor', () => {
      const state = {
        ...createSkillState(),
        majorSkills: ['archery'],
        minorSkills: ['archery'], // This shouldn't happen in practice
      }
      expect(isSkillAssigned('archery', state)).toBe('major')
    })
  })

  describe('getSkillAssignmentCount', () => {
    it('should return correct counts for empty state', () => {
      const state = createSkillState()
      const counts = getSkillAssignmentCount(state)
      expect(counts.majorCount).toBe(0)
      expect(counts.minorCount).toBe(0)
      expect(counts.totalCount).toBe(0)
      expect(counts.majorLimit).toBe(SKILL_LIMITS.MAJOR)
      expect(counts.minorLimit).toBe(SKILL_LIMITS.MINOR)
    })

    it('should return correct counts for populated state', () => {
      const state = {
        ...createSkillState(),
        majorSkills: ['archery', 'oneHanded'],
        minorSkills: ['twoHanded', 'block', 'heavyArmor'],
      }
      const counts = getSkillAssignmentCount(state)
      expect(counts.majorCount).toBe(2)
      expect(counts.minorCount).toBe(3)
      expect(counts.totalCount).toBe(5)
      expect(counts.majorLimit).toBe(SKILL_LIMITS.MAJOR)
      expect(counts.minorLimit).toBe(SKILL_LIMITS.MINOR)
    })
  })
}) 