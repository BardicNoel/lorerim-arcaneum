import { describe, it, expect } from 'vitest'
import {
  createPerkState,
  createPerkSelection,
  createPerkRankUpdate,
  isPerkSelected,
  getPerkRank,
  getSelectedPerksForSkill,
  getPerkCountForSkill,
  getTotalPerkRanksForSkill,
  canSelectPerk,
} from '../perkState'
import type { PerkNode } from '../types'

describe('Perk State Management', () => {
  describe('createPerkState', () => {
    it('should create empty perk state', () => {
      const state = createPerkState()
      expect(state.selectedPerks).toEqual({})
      expect(state.perkRanks).toEqual({})
    })
  })

  describe('createPerkSelection', () => {
    it('should create perk selection with defaults', () => {
      const selection = createPerkSelection('archery_01', 'archery')
      expect(selection.perkId).toBe('archery_01')
      expect(selection.skillId).toBe('archery')
      expect(selection.isSelected).toBe(false)
      expect(selection.currentRank).toBe(0)
    })

    it('should create perk selection with custom values', () => {
      const selection = createPerkSelection('archery_01', 'archery', true, 2)
      expect(selection.perkId).toBe('archery_01')
      expect(selection.skillId).toBe('archery')
      expect(selection.isSelected).toBe(true)
      expect(selection.currentRank).toBe(2)
    })
  })

  describe('createPerkRankUpdate', () => {
    it('should create perk rank update', () => {
      const update = createPerkRankUpdate('archery_01', 3, 'archery')
      expect(update.perkId).toBe('archery_01')
      expect(update.newRank).toBe(3)
      expect(update.skillId).toBe('archery')
    })
  })

  describe('isPerkSelected', () => {
    it('should return false for unselected perk', () => {
      const state = createPerkState()
      expect(isPerkSelected('archery_01', 'archery', state)).toBe(false)
    })

    it('should return true for selected perk', () => {
      const state = {
        ...createPerkState(),
        selectedPerks: {
          archery: ['archery_01', 'archery_02'],
        },
      }
      expect(isPerkSelected('archery_01', 'archery', state)).toBe(true)
      expect(isPerkSelected('archery_02', 'archery', state)).toBe(true)
    })

    it('should return false for perk in different skill', () => {
      const state = {
        ...createPerkState(),
        selectedPerks: {
          archery: ['archery_01'],
        },
      }
      expect(isPerkSelected('archery_01', 'oneHanded', state)).toBe(false)
    })
  })

  describe('getPerkRank', () => {
    it('should return 0 for perk without rank', () => {
      const state = createPerkState()
      expect(getPerkRank('archery_01', state)).toBe(0)
    })

    it('should return correct rank for perk', () => {
      const state = {
        ...createPerkState(),
        perkRanks: {
          archery_01: 3,
          archery_02: 1,
        },
      }
      expect(getPerkRank('archery_01', state)).toBe(3)
      expect(getPerkRank('archery_02', state)).toBe(1)
    })
  })

  describe('getSelectedPerksForSkill', () => {
    it('should return empty array for skill without perks', () => {
      const state = createPerkState()
      expect(getSelectedPerksForSkill('archery', state)).toEqual([])
    })

    it('should return selected perks for skill', () => {
      const state = {
        ...createPerkState(),
        selectedPerks: {
          archery: ['archery_01', 'archery_02'],
          oneHanded: ['oneHanded_01'],
        },
      }
      expect(getSelectedPerksForSkill('archery', state)).toEqual(['archery_01', 'archery_02'])
      expect(getSelectedPerksForSkill('oneHanded', state)).toEqual(['oneHanded_01'])
    })
  })

  describe('getPerkCountForSkill', () => {
    it('should return 0 for skill without perks', () => {
      const state = createPerkState()
      expect(getPerkCountForSkill('archery', state)).toBe(0)
    })

    it('should return correct count for skill', () => {
      const state = {
        ...createPerkState(),
        selectedPerks: {
          archery: ['archery_01', 'archery_02', 'archery_03'],
          oneHanded: ['oneHanded_01'],
        },
      }
      expect(getPerkCountForSkill('archery', state)).toBe(3)
      expect(getPerkCountForSkill('oneHanded', state)).toBe(1)
    })
  })

  describe('getTotalPerkRanksForSkill', () => {
    it('should return 0 for skill without perks', () => {
      const state = createPerkState()
      expect(getTotalPerkRanksForSkill('archery', state)).toBe(0)
    })

    it('should return correct total ranks for skill', () => {
      const state = {
        ...createPerkState(),
        selectedPerks: {
          archery: ['archery_01', 'archery_02'],
        },
        perkRanks: {
          archery_01: 3,
          archery_02: 1,
        },
      }
      expect(getTotalPerkRanksForSkill('archery', state)).toBe(4)
    })

    it('should handle perks with rank 0', () => {
      const state = {
        ...createPerkState(),
        selectedPerks: {
          archery: ['archery_01', 'archery_02'],
        },
        perkRanks: {
          archery_01: 0,
          archery_02: 2,
        },
      }
      expect(getTotalPerkRanksForSkill('archery', state)).toBe(2)
    })
  })

  describe('canSelectPerk', () => {
    const mockPerkNode: PerkNode = {
      edid: 'archery_01',
      name: 'Archery Master',
      ranks: [],
      totalRanks: 1,
      connections: {
        parents: [],
        children: [],
      },
      isRoot: false,
      position: {
        x: 0,
        y: 0,
        horizontal: 0,
        vertical: 0,
      },
    }

    const mockRootPerkNode: PerkNode = {
      ...mockPerkNode,
      edid: 'archery_root',
      isRoot: true,
    }

    it('should allow selection of already selected perk', () => {
      const state = {
        ...createPerkState(),
        selectedPerks: {
          archery: ['archery_01'],
        },
      }
      expect(canSelectPerk('archery_01', 'archery', state, mockPerkNode)).toBe(true)
    })

    it('should allow selection of root perk', () => {
      const state = createPerkState()
      expect(canSelectPerk('archery_root', 'archery', state, mockRootPerkNode)).toBe(true)
    })

    it('should prevent selection of non-root perk without prerequisites', () => {
      const state = createPerkState()
      expect(canSelectPerk('archery_01', 'archery', state, mockPerkNode)).toBe(false)
    })

    it('should allow selection of perk with selected parent', () => {
      const perkWithParent: PerkNode = {
        ...mockPerkNode,
        connections: {
          parents: ['archery_root'],
          children: [],
        },
      }
      const state = {
        ...createPerkState(),
        selectedPerks: {
          archery: ['archery_root'],
        },
      }
      expect(canSelectPerk('archery_01', 'archery', state, perkWithParent)).toBe(true)
    })
  })
}) 