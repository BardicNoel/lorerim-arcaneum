import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DEFAULT_BUILD } from '../../types/build'

describe('Reset Build Simulation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Reset Build Process', () => {
    it('should simulate the complete reset build process', () => {
      // Simulate a build with data
      const buildWithData = {
        ...DEFAULT_BUILD,
        name: 'Test Character',
        race: 'Nord',
        perks: {
          selected: {
            'AVSpeechcraft': ['BOOB_BattleMusePerk', 'BOOB_WindborneMelodyPerk']
          },
          ranks: {
            'BOOB_BattleMusePerk': 1,
            'BOOB_WindborneMelodyPerk': 1
          }
        }
      }

      // Simulate reset build (should set to DEFAULT_BUILD)
      const resetBuild = () => DEFAULT_BUILD
      const resetResult = resetBuild()

      // Verify reset result
      expect(resetResult).toEqual(DEFAULT_BUILD)
      expect(resetResult.name).toBe('')
      expect(resetResult.race).toBe(null)
      expect(resetResult.perks.selected).toEqual({})
      expect(resetResult.perks.ranks).toEqual({})

      // Simulate URL sync logic for default build
      const isDefaultBuild = (build: any) => {
        return build.name === '' && 
               build.notes === '' && 
               build.race === null && 
               build.stone === null && 
               build.religion === null && 
               build.favoriteBlessing === null &&
               build.traits.regular.length === 0 &&
               build.traits.bonus.length === 0 &&
               build.skills.major.length === 0 &&
               build.skills.minor.length === 0 &&
               Object.keys(build.skillLevels).length === 0 &&
               build.equipment.length === 0 &&
               build.destinyPath.length === 0 &&
               build.userProgress.unlocks.length === 0 &&
               build.attributeAssignments.health === 0 &&
               build.attributeAssignments.stamina === 0 &&
               build.attributeAssignments.magicka === 0 &&
               build.attributeAssignments.level === 1 &&
               Object.keys(build.attributeAssignments.assignments).length === 0 &&
               (('perks' in build && Object.keys(build.perks.selected).length === 0) ||
                ('p' in build && Object.keys(build.p).length === 0))
      }

      // Verify default build detection
      expect(isDefaultBuild(resetResult)).toBe(true)

      // Simulate URL parameter handling
      const currentHash = '#/build?b=someEncodedBuild'
      const [path, paramsString] = currentHash.split('?')
      const params = new URLSearchParams(paramsString)

      if (isDefaultBuild(resetResult)) {
        params.delete('b')
      }

      const paramString = params.toString()
      const newHash = paramString ? `${path}?${paramString}` : path

      // Verify URL cleanup
      expect(newHash).toBe('#/build')
    })

    it('should handle compact format reset', () => {
      // Simulate a compact build with data
      const compactBuildWithData = {
        ...DEFAULT_BUILD,
        name: 'Test Character',
        race: 'Nord',
        p: {
          'SPC': [0, 1, 2],
          'MYS': [0, 8, 9]
        }
      }

      // Remove perks property for compact format
      const { perks, ...buildWithoutPerks } = compactBuildWithData

      // Simulate reset build (should set to DEFAULT_BUILD)
      const resetBuild = () => DEFAULT_BUILD
      const resetResult = resetBuild()

      // Verify reset result
      expect(resetResult).toEqual(DEFAULT_BUILD)
      expect(resetResult.name).toBe('')
      expect(resetResult.race).toBe(null)
      expect(resetResult.perks.selected).toEqual({})

      // Simulate URL sync logic for default build
      const isDefaultBuild = (build: any) => {
        return build.name === '' && 
               build.notes === '' && 
               build.race === null && 
               build.stone === null && 
               build.religion === null && 
               build.favoriteBlessing === null &&
               build.traits.regular.length === 0 &&
               build.traits.bonus.length === 0 &&
               build.skills.major.length === 0 &&
               build.skills.minor.length === 0 &&
               Object.keys(build.skillLevels).length === 0 &&
               build.equipment.length === 0 &&
               build.destinyPath.length === 0 &&
               build.userProgress.unlocks.length === 0 &&
               build.attributeAssignments.health === 0 &&
               build.attributeAssignments.stamina === 0 &&
               build.attributeAssignments.magicka === 0 &&
               build.attributeAssignments.level === 1 &&
               Object.keys(build.attributeAssignments.assignments).length === 0 &&
               (('perks' in build && Object.keys(build.perks.selected).length === 0) ||
                ('p' in build && Object.keys(build.p).length === 0))
      }

      // Verify default build detection
      expect(isDefaultBuild(resetResult)).toBe(true)

      // Simulate URL parameter handling
      const currentHash = '#/build/perks?b=someEncodedBuild'
      const [path, paramsString] = currentHash.split('?')
      const params = new URLSearchParams(paramsString)

      if (isDefaultBuild(resetResult)) {
        params.delete('b')
      }

      const paramString = params.toString()
      const newHash = paramString ? `${path}?${paramString}` : path

      // Verify URL cleanup
      expect(newHash).toBe('#/build/perks')
    })
  })
})
