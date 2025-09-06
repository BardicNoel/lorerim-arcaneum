import { describe, it, expect } from 'vitest'
import {
  legacyToV2BuildState,
  compactToV2BuildState,
  v2ToLegacyBuildState,
  v2ToCompactBuildState,
  convertToV2BuildState,
  convertToLegacyBuildState,
  convertToCompactBuildState,
} from '../buildFormatConversion'
import type { LegacyBuildState, CompactBuildState, V2BuildState } from '../../types/buildV2'

describe('Build Format Conversion', () => {
  const sampleLegacyBuild: LegacyBuildState = {
    v: 2,
    name: 'Test Character',
    notes: 'Test notes',
    race: 'TestRace',
    stone: 'TestStone',
    religion: 'TestReligion',
    favoriteBlessing: 'TestBlessing',
    traits: {
      regular: ['Trait1', 'Trait2'],
      bonus: ['BonusTrait1'],
    },
    traitLimits: {
      regular: 2,
      bonus: 1,
    },
    skills: {
      major: ['AVSmithing', 'AVDestruction'],
      minor: ['AVEnchanting', 'AVRestoration'],
    },
    perks: {
      selected: {
        'AVSmithing': ['perk1', 'perk2'],
        'AVDestruction': ['perk3'],
      },
      ranks: {
        'perk1': 2,
        'perk2': 1,
        'perk3': 3,
      },
    },
    skillLevels: {
      'AVSmithing': 25,
      'AVDestruction': 30,
    },
    equipment: ['equipment1', 'equipment2'],
    userProgress: {
      unlocks: ['unlock1', 'unlock2'],
    },
    destinyPath: ['destiny1', 'destiny2'],
    attributeAssignments: {
      health: 100,
      stamina: 50,
      magicka: 75,
      level: 10,
      assignments: {
        2: 'health',
        3: 'stamina',
        4: 'magicka',
      },
    },
  }

  const sampleCompactBuild: CompactBuildState = {
    v: 2,
    name: 'Test Character',
    notes: 'Test notes',
    race: 'TestRace',
    stone: 'TestStone',
    religion: 'TestReligion',
    favoriteBlessing: 'TestBlessing',
    traits: {
      regular: ['Trait1', 'Trait2'],
      bonus: ['BonusTrait1'],
    },
    traitLimits: {
      regular: 2,
      bonus: 1,
    },
    skills: {
      major: ['AVSmithing', 'AVDestruction'],
      minor: ['AVEnchanting', 'AVRestoration'],
    },
    skillLevels: {
      'AVSmithing': 25,
      'AVDestruction': 30,
    },
    equipment: ['equipment1', 'equipment2'],
    userProgress: {
      unlocks: ['unlock1', 'unlock2'],
    },
    destinyPath: ['destiny1', 'destiny2'],
    attributeAssignments: {
      health: 100,
      stamina: 50,
      magicka: 75,
      level: 10,
      assignments: {
        2: 'health',
        3: 'stamina',
        4: 'magicka',
      },
    },
    p: {
      'SMG': [0, 1],
      'DST': [2, 3],
    },
  }

  describe('legacyToV2BuildState', () => {
    it('should convert legacy build to V2 build correctly', () => {
      const v2Build = legacyToV2BuildState(sampleLegacyBuild)

      // Check basic properties
      expect(v2Build.v).toBe(2)
      expect(v2Build.n).toBe('Test Character')
      expect(v2Build.o).toBe('Test notes')
      expect(v2Build.r).toBe('TestRace')
      expect(v2Build.s).toBe('TestStone')
      expect(v2Build.g).toBe('TestReligion')
      expect(v2Build.f).toBe('TestBlessing')

      // Check traits
      expect(v2Build.t.r).toEqual(['Trait1', 'Trait2'])
      expect(v2Build.t.b).toEqual(['BonusTrait1'])

      // Check trait limits (should be omitted for default values)
      expect('l' in v2Build).toBe(false)

      // Check skills (should be converted to indexes)
      expect(v2Build.k.ma).toEqual([0, 1]) // AVSmithing=0, AVDestruction=1
      expect(v2Build.k.mi).toEqual([2, 3]) // AVEnchanting=2, AVRestoration=3

      // Check skill levels (should be converted to indexes)
      expect(v2Build.sl[0]).toBe(25) // AVSmithing
      expect(v2Build.sl[1]).toBe(30) // AVDestruction

      // Check equipment and destiny path
      expect(v2Build.e).toEqual(['equipment1', 'equipment2'])
      expect(v2Build.d).toEqual(['destiny1', 'destiny2'])

      // Check attribute assignments
      expect(v2Build.a.h).toBe(100)
      expect(v2Build.a.st).toBe(50)
      expect(v2Build.a.m).toBe(75)
      expect(v2Build.a.l).toBe(10)
      expect(v2Build.a.as).toEqual({
        2: 'health',
        3: 'stamina',
        4: 'magicka',
      })

      // Check perks (should be converted to skill indexes with placeholder values)
      expect(v2Build.p[0]).toEqual([0, 0]) // AVSmithing perks (placeholder)
      expect(v2Build.p[1]).toEqual([0]) // AVDestruction perks (placeholder)
    })

    it('should include trait limits when different from default', () => {
      const legacyWithCustomLimits: LegacyBuildState = {
        ...sampleLegacyBuild,
        traitLimits: {
          regular: 3,
          bonus: 2,
        },
      }

      const v2Build = legacyToV2BuildState(legacyWithCustomLimits)
      expect(v2Build.l).toEqual([3, 2])
    })
  })

  describe('compactToV2BuildState', () => {
    it('should convert compact build to V2 build correctly', () => {
      const v2Build = compactToV2BuildState(sampleCompactBuild)

      // Check basic properties
      expect(v2Build.v).toBe(2)
      expect(v2Build.n).toBe('Test Character')
      expect(v2Build.o).toBe('Test notes')
      expect(v2Build.r).toBe('TestRace')
      expect(v2Build.s).toBe('TestStone')
      expect(v2Build.g).toBe('TestReligion')
      expect(v2Build.f).toBe('TestBlessing')

      // Check traits
      expect(v2Build.t.r).toEqual(['Trait1', 'Trait2'])
      expect(v2Build.t.b).toEqual(['BonusTrait1'])

      // Check trait limits (should be omitted for default values)
      expect('l' in v2Build).toBe(false)

      // Check skills (should be converted to indexes)
      expect(v2Build.k.ma).toEqual([0, 1]) // AVSmithing=0, AVDestruction=1
      expect(v2Build.k.mi).toEqual([2, 3]) // AVEnchanting=2, AVRestoration=3

      // Check skill levels (should be converted to indexes)
      expect(v2Build.sl[0]).toBe(25) // AVSmithing
      expect(v2Build.sl[1]).toBe(30) // AVDestruction

      // Check equipment and destiny path
      expect(v2Build.e).toEqual(['equipment1', 'equipment2'])
      expect(v2Build.d).toEqual(['destiny1', 'destiny2'])

      // Check attribute assignments
      expect(v2Build.a.h).toBe(100)
      expect(v2Build.a.st).toBe(50)
      expect(v2Build.a.m).toBe(75)
      expect(v2Build.a.l).toBe(10)
      expect(v2Build.a.as).toEqual({
        2: 'health',
        3: 'stamina',
        4: 'magicka',
      })

      // Check perks (should be converted to skill indexes with placeholder values)
      expect(v2Build.p[0]).toEqual([0, 1]) // AVSmithing perks (from compact format)
      expect(v2Build.p[1]).toEqual([2, 3]) // AVDestruction perks (from compact format)
    })
  })

  describe('v2ToLegacyBuildState', () => {
    it('should convert V2 build to legacy build correctly', () => {
      const v2Build: V2BuildState = {
        v: 2,
        n: 'Test Character',
        o: 'Test notes',
        r: 'TestRace',
        s: 'TestStone',
        g: 'TestReligion',
        f: 'TestBlessing',
        t: {
          r: ['Trait1', 'Trait2'],
          b: ['BonusTrait1'],
        },
        k: {
          ma: [0, 1], // AVSmithing, AVDestruction
          mi: [2, 3], // AVEnchanting, AVRestoration
        },
        sl: {
          0: 25, // AVSmithing
          1: 30, // AVDestruction
        },
        e: ['equipment1', 'equipment2'],
        d: ['destiny1', 'destiny2'],
        a: {
          h: 100,
          st: 50,
          m: 75,
          l: 10,
          as: {
            2: 'health',
            3: 'stamina',
            4: 'magicka',
          },
        },
        p: {
          0: [0, 1], // AVSmithing perks
          1: [2, 3], // AVDestruction perks
        },
      }

      const legacyBuild = v2ToLegacyBuildState(v2Build)

      // Check basic properties
      expect(legacyBuild.v).toBe(2)
      expect(legacyBuild.name).toBe('Test Character')
      expect(legacyBuild.notes).toBe('Test notes')
      expect(legacyBuild.race).toBe('TestRace')
      expect(legacyBuild.stone).toBe('TestStone')
      expect(legacyBuild.religion).toBe('TestReligion')
      expect(legacyBuild.favoriteBlessing).toBe('TestBlessing')

      // Check traits
      expect(legacyBuild.traits.regular).toEqual(['Trait1', 'Trait2'])
      expect(legacyBuild.traits.bonus).toEqual(['BonusTrait1'])

      // Check trait limits (should use default values when not specified)
      expect(legacyBuild.traitLimits.regular).toBe(2)
      expect(legacyBuild.traitLimits.bonus).toBe(1)

      // Check skills (should be converted back to EDIDs)
      expect(legacyBuild.skills.major).toEqual(['AVSmithing', 'AVDestruction'])
      expect(legacyBuild.skills.minor).toEqual(['AVEnchanting', 'AVRestoration'])

      // Check skill levels (should be converted back to EDIDs)
      expect(legacyBuild.skillLevels['AVSmithing']).toBe(25)
      expect(legacyBuild.skillLevels['AVDestruction']).toBe(30)

      // Check equipment and destiny path
      expect(legacyBuild.equipment).toEqual(['equipment1', 'equipment2'])
      expect(legacyBuild.destinyPath).toEqual(['destiny1', 'destiny2'])

      // Check attribute assignments
      expect(legacyBuild.attributeAssignments.health).toBe(100)
      expect(legacyBuild.attributeAssignments.stamina).toBe(50)
      expect(legacyBuild.attributeAssignments.magicka).toBe(75)
      expect(legacyBuild.attributeAssignments.level).toBe(10)
      expect(legacyBuild.attributeAssignments.assignments).toEqual({
        2: 'health',
        3: 'stamina',
        4: 'magicka',
      })

      // Check perks (should be converted back to skill EDIDs with placeholder values)
      expect(legacyBuild.perks.selected['AVSmithing']).toEqual(['placeholder-perk', 'placeholder-perk'])
      expect(legacyBuild.perks.selected['AVDestruction']).toEqual(['placeholder-perk', 'placeholder-perk'])
      expect(legacyBuild.perks.ranks).toEqual({})

      // Check userProgress (should be empty as it's removed in v2)
      expect(legacyBuild.userProgress.unlocks).toEqual([])
    })

    it('should use custom trait limits when specified', () => {
      const v2Build: V2BuildState = {
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
        p: {},
      }

      const legacyBuild = v2ToLegacyBuildState(v2Build)
      expect(legacyBuild.traitLimits.regular).toBe(3)
      expect(legacyBuild.traitLimits.bonus).toBe(2)
    })
  })

  describe('v2ToCompactBuildState', () => {
    it('should convert V2 build to compact build correctly', () => {
      const v2Build: V2BuildState = {
        v: 2,
        n: 'Test Character',
        o: 'Test notes',
        r: 'TestRace',
        s: 'TestStone',
        g: 'TestReligion',
        f: 'TestBlessing',
        t: {
          r: ['Trait1', 'Trait2'],
          b: ['BonusTrait1'],
        },
        k: {
          ma: [0, 1], // AVSmithing, AVDestruction
          mi: [2, 3], // AVEnchanting, AVRestoration
        },
        sl: {
          0: 25, // AVSmithing
          1: 30, // AVDestruction
        },
        e: ['equipment1', 'equipment2'],
        d: ['destiny1', 'destiny2'],
        a: {
          h: 100,
          st: 50,
          m: 75,
          l: 10,
          as: {
            2: 'health',
            3: 'stamina',
            4: 'magicka',
          },
        },
        p: {
          0: [0, 1], // AVSmithing perks
          1: [2, 3], // AVDestruction perks
        },
      }

      const compactBuild = v2ToCompactBuildState(v2Build)

      // Check basic properties
      expect(compactBuild.v).toBe(2)
      expect(compactBuild.name).toBe('Test Character')
      expect(compactBuild.notes).toBe('Test notes')
      expect(compactBuild.race).toBe('TestRace')
      expect(compactBuild.stone).toBe('TestStone')
      expect(compactBuild.religion).toBe('TestReligion')
      expect(compactBuild.favoriteBlessing).toBe('TestBlessing')

      // Check traits
      expect(compactBuild.traits.regular).toEqual(['Trait1', 'Trait2'])
      expect(compactBuild.traits.bonus).toEqual(['BonusTrait1'])

      // Check trait limits (should use default values when not specified)
      expect(compactBuild.traitLimits.regular).toBe(2)
      expect(compactBuild.traitLimits.bonus).toBe(1)

      // Check skills (should be converted back to EDIDs)
      expect(compactBuild.skills.major).toEqual(['AVSmithing', 'AVDestruction'])
      expect(compactBuild.skills.minor).toEqual(['AVEnchanting', 'AVRestoration'])

      // Check skill levels (should be converted back to EDIDs)
      expect(compactBuild.skillLevels['AVSmithing']).toBe(25)
      expect(compactBuild.skillLevels['AVDestruction']).toBe(30)

      // Check equipment and destiny path
      expect(compactBuild.equipment).toEqual(['equipment1', 'equipment2'])
      expect(compactBuild.destinyPath).toEqual(['destiny1', 'destiny2'])

      // Check attribute assignments
      expect(compactBuild.attributeAssignments.health).toBe(100)
      expect(compactBuild.attributeAssignments.stamina).toBe(50)
      expect(compactBuild.attributeAssignments.magicka).toBe(75)
      expect(compactBuild.attributeAssignments.level).toBe(10)
      expect(compactBuild.attributeAssignments.assignments).toEqual({
        2: 'health',
        3: 'stamina',
        4: 'magicka',
      })

      // Check perks (should be converted back to skill codes)
      expect(compactBuild.p['SMG']).toEqual([0, 1]) // AVSmithing -> SMG
      expect(compactBuild.p['DST']).toEqual([2, 3]) // AVDestruction -> DST

      // Check userProgress (should be empty as it's removed in v2)
      expect(compactBuild.userProgress.unlocks).toEqual([])
    })
  })

  describe('Universal Converters', () => {
    it('should convert any build format to V2', () => {
      // Test legacy to V2
      const v2FromLegacy = convertToV2BuildState(sampleLegacyBuild)
      expect(v2FromLegacy.n).toBe('Test Character')
      expect(v2FromLegacy.k.ma).toEqual([0, 1])

      // Test compact to V2
      const v2FromCompact = convertToV2BuildState(sampleCompactBuild)
      expect(v2FromCompact.n).toBe('Test Character')
      expect(v2FromCompact.k.ma).toEqual([0, 1])

      // Test V2 to V2 (should return as-is)
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
        p: {},
      }
      const v2FromV2 = convertToV2BuildState(v2Build)
      expect(v2FromV2).toBe(v2Build) // Should be the same object
    })

    it('should convert any build format to legacy', () => {
      // Test V2 to legacy
      const v2Build: V2BuildState = {
        v: 2,
        n: 'Test Character',
        o: 'Test notes',
        r: 'TestRace',
        s: 'TestStone',
        g: 'TestReligion',
        f: 'TestBlessing',
        t: { r: ['Trait1'], b: [] },
        k: { ma: [0], mi: [] },
        sl: { 0: 25 },
        e: [],
        d: [],
        a: { h: 100, st: 0, m: 0, l: 1, as: {} },
        p: { 0: [0, 1] },
      }

      const legacyFromV2 = convertToLegacyBuildState(v2Build)
      expect(legacyFromV2.name).toBe('Test Character')
      expect(legacyFromV2.skills.major).toEqual(['AVSmithing'])

      // Test compact to legacy
      const legacyFromCompact = convertToLegacyBuildState(sampleCompactBuild)
      expect(legacyFromCompact.name).toBe('Test Character')
      expect(legacyFromCompact.skills.major).toEqual(['AVSmithing', 'AVDestruction'])

      // Test legacy to legacy (should return as-is)
      const legacyFromLegacy = convertToLegacyBuildState(sampleLegacyBuild)
      expect(legacyFromLegacy).toBe(sampleLegacyBuild) // Should be the same object
    })

    it('should convert any build format to compact', () => {
      // Test V2 to compact
      const v2Build: V2BuildState = {
        v: 2,
        n: 'Test Character',
        o: 'Test notes',
        r: 'TestRace',
        s: 'TestStone',
        g: 'TestReligion',
        f: 'TestBlessing',
        t: { r: ['Trait1'], b: [] },
        k: { ma: [0], mi: [] },
        sl: { 0: 25 },
        e: [],
        d: [],
        a: { h: 100, st: 0, m: 0, l: 1, as: {} },
        p: { 0: [0, 1] },
      }

      const compactFromV2 = convertToCompactBuildState(v2Build)
      expect(compactFromV2.name).toBe('Test Character')
      expect(compactFromV2.skills.major).toEqual(['AVSmithing'])
      expect(compactFromV2.p['SMG']).toEqual([0, 1])

      // Test legacy to compact
      const compactFromLegacy = convertToCompactBuildState(sampleLegacyBuild)
      expect(compactFromLegacy.name).toBe('Test Character')
      expect(compactFromLegacy.skills.major).toEqual(['AVSmithing', 'AVDestruction'])

      // Test compact to compact (should return as-is)
      const compactFromCompact = convertToCompactBuildState(sampleCompactBuild)
      expect(compactFromCompact).toBe(sampleCompactBuild) // Should be the same object
    })

    it('should throw error for unsupported build versions', () => {
      const v1Build = { v: 1, name: 'Test' }
      
      expect(() => convertToV2BuildState(v1Build)).toThrow('Only v2 builds are supported')
      expect(() => convertToLegacyBuildState(v1Build)).toThrow('Only v2 builds are supported')
      expect(() => convertToCompactBuildState(v1Build)).toThrow('Only v2 builds are supported')
    })

    it('should throw error for unknown build formats', () => {
      const unknownBuild = { v: 2, someField: 'value' }
      
      expect(() => convertToV2BuildState(unknownBuild)).toThrow('Unknown build format')
      expect(() => convertToLegacyBuildState(unknownBuild)).toThrow('Unknown build format')
      expect(() => convertToCompactBuildState(unknownBuild)).toThrow('Unknown build format')
    })
  })

  describe('Round-trip Conversion', () => {
    it('should maintain data integrity through legacy -> V2 -> legacy conversion', () => {
      const v2Build = legacyToV2BuildState(sampleLegacyBuild)
      const backToLegacy = v2ToLegacyBuildState(v2Build)

      // Check that essential data is preserved
      expect(backToLegacy.name).toBe(sampleLegacyBuild.name)
      expect(backToLegacy.notes).toBe(sampleLegacyBuild.notes)
      expect(backToLegacy.race).toBe(sampleLegacyBuild.race)
      expect(backToLegacy.stone).toBe(sampleLegacyBuild.stone)
      expect(backToLegacy.religion).toBe(sampleLegacyBuild.religion)
      expect(backToLegacy.favoriteBlessing).toBe(sampleLegacyBuild.favoriteBlessing)
      expect(backToLegacy.traits).toEqual(sampleLegacyBuild.traits)
      expect(backToLegacy.traitLimits).toEqual(sampleLegacyBuild.traitLimits)
      expect(backToLegacy.skills).toEqual(sampleLegacyBuild.skills)
      expect(backToLegacy.skillLevels).toEqual(sampleLegacyBuild.skillLevels)
      expect(backToLegacy.equipment).toEqual(sampleLegacyBuild.equipment)
      expect(backToLegacy.destinyPath).toEqual(sampleLegacyBuild.destinyPath)
      expect(backToLegacy.attributeAssignments).toEqual(sampleLegacyBuild.attributeAssignments)
      // Perks will be converted to placeholder values due to perk indexing limitations
      expect(Object.keys(backToLegacy.perks.selected)).toEqual(Object.keys(sampleLegacyBuild.perks.selected))
      expect(backToLegacy.perks.selected['AVSmithing']).toHaveLength(2)
      expect(backToLegacy.perks.selected['AVDestruction']).toHaveLength(1)
      // userProgress should be empty (removed in v2)
      expect(backToLegacy.userProgress.unlocks).toEqual([])
    })

    it('should maintain data integrity through compact -> V2 -> compact conversion', () => {
      const v2Build = compactToV2BuildState(sampleCompactBuild)
      const backToCompact = v2ToCompactBuildState(v2Build)

      // Check that essential data is preserved
      expect(backToCompact.name).toBe(sampleCompactBuild.name)
      expect(backToCompact.notes).toBe(sampleCompactBuild.notes)
      expect(backToCompact.race).toBe(sampleCompactBuild.race)
      expect(backToCompact.stone).toBe(sampleCompactBuild.stone)
      expect(backToCompact.religion).toBe(sampleCompactBuild.religion)
      expect(backToCompact.favoriteBlessing).toBe(sampleCompactBuild.favoriteBlessing)
      expect(backToCompact.traits).toEqual(sampleCompactBuild.traits)
      expect(backToCompact.traitLimits).toEqual(sampleCompactBuild.traitLimits)
      expect(backToCompact.skills).toEqual(sampleCompactBuild.skills)
      expect(backToCompact.skillLevels).toEqual(sampleCompactBuild.skillLevels)
      expect(backToCompact.equipment).toEqual(sampleCompactBuild.equipment)
      expect(backToCompact.destinyPath).toEqual(sampleCompactBuild.destinyPath)
      expect(backToCompact.attributeAssignments).toEqual(sampleCompactBuild.attributeAssignments)
      expect(backToCompact.p).toEqual(sampleCompactBuild.p)
      // userProgress should be empty (removed in v2)
      expect(backToCompact.userProgress.unlocks).toEqual([])
    })
  })
})
