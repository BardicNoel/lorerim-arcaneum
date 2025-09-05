import { describe, it, expect } from 'vitest'
import type { V2BuildState, LegacyBuildState, CompactBuildState } from '../buildV2'
import { 
  isV2BuildState, 
  isLegacyBuildState, 
  isCompactBuildState,
  getBuildStateVariant,
  V2_DEFAULT_BUILD 
} from '../buildV2'

describe('V2 Build Types', () => {
  describe('Type Guards', () => {
    it('should identify V2 build state correctly', () => {
      const v2Build: V2BuildState = {
        v: 2,
        n: 'Test Character',
        o: 'Test notes',
        r: 'TestRace',
        s: 'TestStone',
        g: 'TestReligion',
        f: 'TestBlessing',
        t: { r: [], b: [] },
        k: { ma: [0, 1], mi: [2, 3] },
        sl: { 0: 25, 1: 30 },
        e: [],
        d: [],
        a: { h: 100, st: 50, m: 75, l: 10, as: {} },
        p: { 0: [0, 1], 1: [2, 3] }
      }

      expect(isV2BuildState(v2Build)).toBe(true)
      expect(isLegacyBuildState(v2Build)).toBe(false)
      expect(isCompactBuildState(v2Build)).toBe(false)
    })

    it('should identify legacy build state correctly', () => {
      const legacyBuild: LegacyBuildState = {
        v: 2,
        name: 'Test Character',
        notes: 'Test notes',
        race: 'TestRace',
        stone: 'TestStone',
        religion: 'TestReligion',
        favoriteBlessing: 'TestBlessing',
        traits: { regular: [], bonus: [] },
        traitLimits: { regular: 2, bonus: 1 },
        skills: { major: ['AVSmithing'], minor: ['AVDestruction'] },
        perks: { selected: {}, ranks: {} },
        skillLevels: { 'AVSmithing': 25 },
        equipment: [],
        userProgress: { unlocks: [] },
        destinyPath: [],
        attributeAssignments: { health: 100, stamina: 50, magicka: 75, level: 10, assignments: {} }
      }

      expect(isV2BuildState(legacyBuild)).toBe(false)
      expect(isLegacyBuildState(legacyBuild)).toBe(true)
      expect(isCompactBuildState(legacyBuild)).toBe(false)
    })

    it('should identify compact build state correctly', () => {
      const compactBuild: CompactBuildState = {
        v: 2,
        name: 'Test Character',
        notes: 'Test notes',
        race: 'TestRace',
        stone: 'TestStone',
        religion: 'TestReligion',
        favoriteBlessing: 'TestBlessing',
        traits: { regular: [], bonus: [] },
        traitLimits: { regular: 2, bonus: 1 },
        skills: { major: ['AVSmithing'], minor: ['AVDestruction'] },
        skillLevels: { 'AVSmithing': 25 },
        equipment: [],
        userProgress: { unlocks: [] },
        destinyPath: [],
        attributeAssignments: { health: 100, stamina: 50, magicka: 75, level: 10, assignments: {} },
        p: { 'SMG': [0, 1] }
      }

      expect(isV2BuildState(compactBuild)).toBe(false)
      expect(isLegacyBuildState(compactBuild)).toBe(false)
      expect(isCompactBuildState(compactBuild)).toBe(true)
    })
  })

  describe('getBuildStateVariant', () => {
    it('should return correct variant for V2 build', () => {
      const v2Build: V2BuildState = {
        v: 2,
        n: 'Test',
        o: '',
        r: null,
        s: null,
        g: null,
        f: null,
        t: { r: [], b: [] },
        k: { ma: [], mi: [] },
        sl: {},
        e: [],
        d: [],
        a: { h: 0, st: 0, m: 0, l: 1, as: {} },
        p: {}
      }

      expect(getBuildStateVariant(v2Build)).toBe('v2')
    })

    it('should return correct variant for legacy build', () => {
      const legacyBuild: LegacyBuildState = {
        v: 2,
        name: 'Test',
        notes: '',
        race: null,
        stone: null,
        religion: null,
        favoriteBlessing: null,
        traits: { regular: [], bonus: [] },
        traitLimits: { regular: 2, bonus: 1 },
        skills: { major: [], minor: [] },
        perks: { selected: {}, ranks: {} },
        skillLevels: {},
        equipment: [],
        userProgress: { unlocks: [] },
        destinyPath: [],
        attributeAssignments: { health: 0, stamina: 0, magicka: 0, level: 1, assignments: {} }
      }

      expect(getBuildStateVariant(legacyBuild)).toBe('legacy')
    })

    it('should return correct variant for compact build', () => {
      const compactBuild: CompactBuildState = {
        v: 2,
        name: 'Test',
        notes: '',
        race: null,
        stone: null,
        religion: null,
        favoriteBlessing: null,
        traits: { regular: [], bonus: [] },
        traitLimits: { regular: 2, bonus: 1 },
        skills: { major: [], minor: [] },
        skillLevels: {},
        equipment: [],
        userProgress: { unlocks: [] },
        destinyPath: [],
        attributeAssignments: { health: 0, stamina: 0, magicka: 0, level: 1, assignments: {} },
        p: {}
      }

      expect(getBuildStateVariant(compactBuild)).toBe('compact')
    })

    it('should throw error for unknown build format', () => {
      const unknownBuild = { v: 1, someField: 'value' }
      
      expect(() => getBuildStateVariant(unknownBuild)).toThrow('Unknown build state format')
    })
  })

  describe('V2_DEFAULT_BUILD', () => {
    it('should have correct structure', () => {
      expect(V2_DEFAULT_BUILD.v).toBe(2)
      expect(V2_DEFAULT_BUILD.n).toBe('')
      expect(V2_DEFAULT_BUILD.o).toBe('')
      expect(V2_DEFAULT_BUILD.r).toBe(null)
      expect(V2_DEFAULT_BUILD.s).toBe(null)
      expect(V2_DEFAULT_BUILD.g).toBe(null)
      expect(V2_DEFAULT_BUILD.f).toBe(null)
      expect(V2_DEFAULT_BUILD.t).toEqual({ r: [], b: [] })
      expect(V2_DEFAULT_BUILD.k).toEqual({ ma: [], mi: [] })
      expect(V2_DEFAULT_BUILD.sl).toEqual({})
      expect(V2_DEFAULT_BUILD.e).toEqual([])
      expect(V2_DEFAULT_BUILD.d).toEqual([])
      expect(V2_DEFAULT_BUILD.a).toEqual({ h: 0, st: 0, m: 0, l: 1, as: {} })
      expect(V2_DEFAULT_BUILD.p).toEqual({})
    })

    it('should not include trait limits (default values)', () => {
      expect('l' in V2_DEFAULT_BUILD).toBe(false)
    })

    it('should be identified as V2 build state', () => {
      expect(isV2BuildState(V2_DEFAULT_BUILD)).toBe(true)
    })
  })

  describe('V2 Build Structure', () => {
    it('should support conditional trait limits', () => {
      const buildWithCustomLimits: V2BuildState = {
        v: 2,
        n: 'Test',
        o: '',
        r: null,
        s: null,
        g: null,
        f: null,
        t: { r: [], b: [] },
        l: [3, 2], // Custom limits
        k: { ma: [], mi: [] },
        sl: {},
        e: [],
        d: [],
        a: { h: 0, st: 0, m: 0, l: 1, as: {} },
        p: {}
      }

      expect(buildWithCustomLimits.l).toEqual([3, 2])
    })

    it('should support skill indexes in skills and skill levels', () => {
      const buildWithSkills: V2BuildState = {
        v: 2,
        n: 'Test',
        o: '',
        r: null,
        s: null,
        g: null,
        f: null,
        t: { r: [], b: [] },
        k: { 
          ma: [0, 1], // AVSmithing, AVDestruction
          mi: [2, 3]  // AVEnchanting, AVRestoration
        },
        sl: { 
          0: 25, // AVSmithing level 25
          1: 30  // AVDestruction level 30
        },
        e: [],
        d: [],
        a: { h: 0, st: 0, m: 0, l: 1, as: {} },
        p: {
          0: [0, 1], // AVSmithing perks
          1: [2, 3]  // AVDestruction perks
        }
      }

      expect(buildWithSkills.k.ma).toEqual([0, 1])
      expect(buildWithSkills.k.mi).toEqual([2, 3])
      expect(buildWithSkills.sl[0]).toBe(25)
      expect(buildWithSkills.sl[1]).toBe(30)
      expect(buildWithSkills.p[0]).toEqual([0, 1])
      expect(buildWithSkills.p[1]).toEqual([2, 3])
    })

    it('should support compressed attribute assignments', () => {
      const buildWithAttributes: V2BuildState = {
        v: 2,
        n: 'Test',
        o: '',
        r: null,
        s: null,
        g: null,
        f: null,
        t: { r: [], b: [] },
        k: { ma: [], mi: [] },
        sl: {},
        e: [],
        d: [],
        a: {
          h: 100,   // health
          st: 50,   // stamina
          m: 75,    // magicka
          l: 10,    // level
          as: {     // assignments
            2: 'health',
            3: 'stamina',
            4: 'magicka'
          }
        },
        p: {}
      }

      expect(buildWithAttributes.a.h).toBe(100)
      expect(buildWithAttributes.a.st).toBe(50)
      expect(buildWithAttributes.a.m).toBe(75)
      expect(buildWithAttributes.a.l).toBe(10)
      expect(buildWithAttributes.a.as[2]).toBe('health')
      expect(buildWithAttributes.a.as[3]).toBe('stamina')
      expect(buildWithAttributes.a.as[4]).toBe('magicka')
    })
  })
})
