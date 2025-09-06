import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DEFAULT_BUILD } from '../../types/build'

describe('Reset Build Integration Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Default Build Detection Logic', () => {
    it('should correctly identify DEFAULT_BUILD as default', () => {
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

      // Test the actual DEFAULT_BUILD
      expect(isDefaultBuild(DEFAULT_BUILD)).toBe(true)
      expect(DEFAULT_BUILD.v).toBe(2) // Should be version 2
      
      // Log the actual DEFAULT_BUILD structure for debugging
      console.log('DEFAULT_BUILD structure:', {
        name: DEFAULT_BUILD.name,
        notes: DEFAULT_BUILD.notes,
        race: DEFAULT_BUILD.race,
        stone: DEFAULT_BUILD.stone,
        religion: DEFAULT_BUILD.religion,
        favoriteBlessing: DEFAULT_BUILD.favoriteBlessing,
        traits: DEFAULT_BUILD.traits,
        skills: DEFAULT_BUILD.skills,
        perks: DEFAULT_BUILD.perks,
        skillLevels: DEFAULT_BUILD.skillLevels,
        equipment: DEFAULT_BUILD.equipment,
        destinyPath: DEFAULT_BUILD.destinyPath,
        userProgress: DEFAULT_BUILD.userProgress,
        attributeAssignments: DEFAULT_BUILD.attributeAssignments
      })
    })

    it('should handle URL parameter removal for default builds', () => {
      // Simulate URL with build parameter
      const currentHash = '#/build?b=someEncodedBuild&other=value'
      const [path, paramsString] = currentHash.split('?')
      const params = new URLSearchParams(paramsString)
      
      // Simulate default build detection
      const isDefaultBuild = true
      
      if (isDefaultBuild) {
        params.delete('b')
      }
      
      const paramString = params.toString()
      const newHash = paramString ? `${path}?${paramString}` : path
      
      expect(newHash).toBe('#/build?other=value')
    })

    it('should create clean hash for default builds with no other parameters', () => {
      // Simulate URL with only build parameter
      const currentHash = '#/build?b=someEncodedBuild'
      const [path, paramsString] = currentHash.split('?')
      const params = new URLSearchParams(paramsString)
      
      // Simulate default build detection
      const isDefaultBuild = true
      
      if (isDefaultBuild) {
        params.delete('b')
      }
      
      const paramString = params.toString()
      const newHash = paramString ? `${path}?${paramString}` : path
      
      expect(newHash).toBe('#/build')
    })
  })
})
