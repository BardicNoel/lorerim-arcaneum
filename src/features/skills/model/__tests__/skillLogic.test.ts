import { describe, it, expect } from 'vitest'
import {
  canAssignSkill,
  validateSkillAssignment,
  isSkillAssigned,
  getAllPrerequisites,
  getAllDescendants,
  canSelectPerk,
  validatePerkSelection,
  canIncreasePerkRank,
  validatePerkRankUpdate,
  getSkillWithPerkInfo,
  calculateSkillLevel,
} from '../skillLogic'
import { createSkillState, SKILL_LIMITS } from '../skillState'
import { createPerkState } from '../perkState'
import type { Skill, PerkTree, PerkNode } from '../types'

describe('Skill Logic', () => {
  describe('Skill Assignment Logic', () => {
    describe('canAssignSkill', () => {
      it('should allow major skill assignment when under limit', () => {
        const state = createSkillState()
        expect(canAssignSkill('archery', 'major', state)).toBe(true)
      })

      it('should prevent major skill assignment when at limit', () => {
        const state = {
          ...createSkillState(),
          majorSkills: ['archery', 'oneHanded', 'twoHanded'],
        }
        expect(canAssignSkill('block', 'major', state)).toBe(false)
      })

      it('should allow minor skill assignment when under limit', () => {
        const state = createSkillState()
        expect(canAssignSkill('archery', 'minor', state)).toBe(true)
      })

      it('should prevent minor skill assignment when at limit', () => {
        const state = {
          ...createSkillState(),
          minorSkills: ['archery', 'oneHanded', 'twoHanded', 'block', 'heavyArmor', 'lightArmor'],
        }
        expect(canAssignSkill('sneak', 'minor', state)).toBe(false)
      })
    })

    describe('validateSkillAssignment', () => {
      it('should validate successful assignment', () => {
        const state = createSkillState()
        const result = validateSkillAssignment('archery', 'major', state)
        expect(result.valid).toBe(true)
        expect(result.reason).toBeUndefined()
      })

      it('should reject assignment when already assigned as same type', () => {
        const state = {
          ...createSkillState(),
          majorSkills: ['archery'],
        }
        const result = validateSkillAssignment('archery', 'major', state)
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Skill is already assigned as this type')
      })

      it('should reject assignment when at limit', () => {
        const state = {
          ...createSkillState(),
          majorSkills: ['archery', 'oneHanded', 'twoHanded'],
        }
        const result = validateSkillAssignment('block', 'major', state)
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Cannot assign more major skills (limit reached)')
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
    })
  })

  describe('Perk Selection Logic', () => {
    const mockPerkTree: PerkTree = {
      treeId: 'archery',
      treeName: 'Archery',
      treeDescription: 'Archery skill tree',
      category: 'combat',
      perks: [
        {
          edid: 'archery_root',
          name: 'Archery Master',
          ranks: [],
          totalRanks: 1,
          connections: { parents: [], children: ['archery_01'] },
          isRoot: true,
          position: { x: 0, y: 0, horizontal: 0, vertical: 0 },
        },
        {
          edid: 'archery_01',
          name: 'Precise Shot',
          ranks: [],
          totalRanks: 1,
          connections: { parents: ['archery_root'], children: [] },
          isRoot: false,
          position: { x: 1, y: 1, horizontal: 1, vertical: 1 },
        },
      ],
    }

    describe('getAllPrerequisites', () => {
      it('should return empty array for root perk', () => {
        const result = getAllPrerequisites('archery_root', mockPerkTree)
        expect(result).toEqual([])
      })

      it('should return prerequisites for non-root perk', () => {
        const result = getAllPrerequisites('archery_01', mockPerkTree)
        expect(result).toEqual(['archery_root'])
      })

      it('should handle cycles gracefully', () => {
        const cyclicTree: PerkTree = {
          ...mockPerkTree,
          perks: [
            {
              edid: 'archery_root',
              name: 'Archery Master',
              ranks: [],
              totalRanks: 1,
              connections: { parents: ['archery_01'], children: ['archery_01'] },
              isRoot: true,
              position: { x: 0, y: 0, horizontal: 0, vertical: 0 },
            },
            {
              edid: 'archery_01',
              name: 'Precise Shot',
              ranks: [],
              totalRanks: 1,
              connections: { parents: ['archery_root'], children: ['archery_root'] },
              isRoot: false,
              position: { x: 1, y: 1, horizontal: 1, vertical: 1 },
            },
          ],
        }
        const result = getAllPrerequisites('archery_01', cyclicTree)
        expect(result).toEqual(['archery_root'])
      })
    })

    describe('getAllDescendants', () => {
      it('should return descendants of a perk', () => {
        const result = getAllDescendants('archery_root', mockPerkTree)
        expect(result).toEqual(['archery_01'])
      })

      it('should return empty array for perk with no descendants', () => {
        const result = getAllDescendants('archery_01', mockPerkTree)
        expect(result).toEqual([])
      })
    })

    describe('canSelectPerk', () => {
      it('should allow selection of root perk', () => {
        const perkState = createPerkState()
        const result = canSelectPerk('archery_root', mockPerkTree, perkState, 'archery')
        expect(result).toBe(true)
      })

      it('should allow selection of already selected perk', () => {
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_01'] },
        }
        const result = canSelectPerk('archery_01', mockPerkTree, perkState, 'archery')
        expect(result).toBe(true)
      })

      it('should allow selection when prerequisites are met', () => {
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_root'] },
        }
        const result = canSelectPerk('archery_01', mockPerkTree, perkState, 'archery')
        expect(result).toBe(true)
      })

      it('should prevent selection when prerequisites are not met', () => {
        const perkState = createPerkState()
        const result = canSelectPerk('archery_01', mockPerkTree, perkState, 'archery')
        expect(result).toBe(false)
      })
    })

    describe('validatePerkSelection', () => {
      it('should validate successful selection', () => {
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_root'] },
        }
        const result = validatePerkSelection('archery_01', mockPerkTree, perkState, 'archery')
        expect(result.valid).toBe(true)
        expect(result.reason).toBeUndefined()
      })

      it('should reject selection when prerequisites not met', () => {
        const perkState = createPerkState()
        const result = validatePerkSelection('archery_01', mockPerkTree, perkState, 'archery')
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Prerequisites not met or perk not available')
      })
    })
  })

  describe('Perk Rank Logic', () => {
    const mockPerkTree: PerkTree = {
      treeId: 'archery',
      treeName: 'Archery',
      treeDescription: 'Archery skill tree',
      category: 'combat',
      perks: [
        {
          edid: 'archery_01',
          name: 'Archery Master',
          ranks: [],
          totalRanks: 3,
          connections: { parents: [], children: [] },
          isRoot: true,
          position: { x: 0, y: 0, horizontal: 0, vertical: 0 },
        },
      ],
    }

    describe('canIncreasePerkRank', () => {
      it('should allow rank increase when under max', () => {
        const perkState = {
          ...createPerkState(),
          perkRanks: { archery_01: 1 },
        }
        const result = canIncreasePerkRank('archery_01', mockPerkTree, perkState, 'archery')
        expect(result).toBe(true)
      })

      it('should prevent rank increase when at max', () => {
        const perkState = {
          ...createPerkState(),
          perkRanks: { archery_01: 3 },
        }
        const result = canIncreasePerkRank('archery_01', mockPerkTree, perkState, 'archery')
        expect(result).toBe(false)
      })
    })

    describe('validatePerkRankUpdate', () => {
      it('should validate successful rank update', () => {
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_01'] },
        }
        const result = validatePerkRankUpdate('archery_01', 2, mockPerkTree, perkState, 'archery')
        expect(result.valid).toBe(true)
        expect(result.reason).toBeUndefined()
      })

      it('should reject rank update when perk not selected', () => {
        const perkState = createPerkState()
        const result = validatePerkRankUpdate('archery_01', 2, mockPerkTree, perkState, 'archery')
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Perk must be selected to have rank > 0')
      })

      it('should reject rank update when rank exceeds max', () => {
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_01'] },
        }
        const result = validatePerkRankUpdate('archery_01', 4, mockPerkTree, perkState, 'archery')
        expect(result.valid).toBe(false)
        expect(result.reason).toBe('Rank must be between 0 and 3')
      })
    })
  })

  describe('Skill-Perk Integration Logic', () => {
    const mockSkill: Skill = {
      name: 'Archery',
      edid: 'archery',
      category: 'combat',
      description: 'Archery skill',
      scaling: 'agility',
      keyAbilities: ['agility'],
      metaTags: ['combat', 'ranged'],
    }

    const mockPerkTrees: PerkTree[] = [
      {
        treeId: 'archery',
        treeName: 'Archery',
        treeDescription: 'Archery skill tree',
        category: 'combat',
        perks: [
          {
            edid: 'archery_01',
            name: 'Archery Master',
            ranks: [],
            totalRanks: 1,
            connections: { parents: [], children: [] },
            isRoot: true,
            position: { x: 0, y: 0, horizontal: 0, vertical: 0 },
          },
        ],
      },
    ]

    describe('getSkillWithPerkInfo', () => {
      it('should add perk info to skill', () => {
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_01'] },
        }
        const result = getSkillWithPerkInfo(mockSkill, mockPerkTrees, perkState)
        expect(result.totalPerks).toBe(1)
        expect(result.selectedPerks).toBe(1)
        expect(result.name).toBe('Archery')
      })

      it('should handle skill without perk tree', () => {
        const perkState = createPerkState()
        const skillWithoutTree: Skill = {
          ...mockSkill,
          edid: 'nonexistent',
        }
        const result = getSkillWithPerkInfo(skillWithoutTree, mockPerkTrees, perkState)
        expect(result.totalPerks).toBe(0)
        expect(result.selectedPerks).toBe(0)
      })
    })

    describe('calculateSkillLevel', () => {
      it('should calculate level for major skill', () => {
        const skillState = {
          ...createSkillState(),
          majorSkills: ['archery'],
        }
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_01'] },
          perkRanks: { archery_01: 2 },
        }
        const result = calculateSkillLevel('archery', skillState, perkState)
        expect(result).toBe(35) // 25 (major) + 10 (2 ranks * 5)
      })

      it('should calculate level for minor skill', () => {
        const skillState = {
          ...createSkillState(),
          minorSkills: ['archery'],
        }
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_01'] },
          perkRanks: { archery_01: 1 },
        }
        const result = calculateSkillLevel('archery', skillState, perkState)
        expect(result).toBe(20) // 15 (minor) + 5 (1 rank * 5)
      })

      it('should calculate level for unassigned skill', () => {
        const skillState = createSkillState()
        const perkState = {
          ...createPerkState(),
          selectedPerks: { archery: ['archery_01'] },
          perkRanks: { archery_01: 1 },
        }
        const result = calculateSkillLevel('archery', skillState, perkState)
        expect(result).toBe(5) // 0 (unassigned) + 5 (1 rank * 5)
      })
    })
  })
}) 