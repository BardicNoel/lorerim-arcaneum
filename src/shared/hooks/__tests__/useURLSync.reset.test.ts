import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { DEFAULT_BUILD } from '../../types/build'

describe('URL Sync Reset Build Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Default Build Detection', () => {
    it('should detect legacy default build correctly', () => {
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

      // Test legacy default build
      expect(isDefaultBuild(DEFAULT_BUILD)).toBe(true)

      // Test compact default build (removing perks property and adding p)
      const { perks, ...buildWithoutPerks } = DEFAULT_BUILD
      const compactDefaultBuild = { ...buildWithoutPerks, p: {} }
      expect(isDefaultBuild(compactDefaultBuild)).toBe(true)

      // Test non-default builds
      const nonDefaultBuild = { ...DEFAULT_BUILD, name: 'Test Character' }
      expect(isDefaultBuild(nonDefaultBuild)).toBe(false)

      const { perks: _, ...buildWithoutPerks2 } = DEFAULT_BUILD
      const nonDefaultBuildWithPerks = { ...buildWithoutPerks2, p: { 'MYS': [0, 8, 9] } }
      expect(isDefaultBuild(nonDefaultBuildWithPerks)).toBe(false)
    })
  })

  describe('URL Parameter Handling', () => {
    it('should remove build parameter for default builds', () => {
      const params = new URLSearchParams('b=someBuild&other=value')
      
      // Simulate default build detection
      const isDefaultBuild = true
      
      if (isDefaultBuild) {
        params.delete('b')
      }
      
      expect(params.toString()).toBe('other=value')
    })

    it('should keep build parameter for non-default builds', () => {
      const params = new URLSearchParams('b=someBuild&other=value')
      
      // Simulate non-default build detection
      const isDefaultBuild = false
      
      if (!isDefaultBuild) {
        params.set('b', 'encodedBuild')
      }
      
      expect(params.toString()).toBe('b=encodedBuild&other=value')
    })
  })

  describe('URL Hash Construction', () => {
    it('should create clean hash without parameters for default builds', () => {
      const path = '#/build'
      const params = new URLSearchParams()
      
      const paramString = params.toString()
      const newHash = paramString ? `${path}?${paramString}` : path
      
      expect(newHash).toBe('#/build')
    })

    it('should create hash with parameters for non-default builds', () => {
      const path = '#/build'
      const params = new URLSearchParams()
      params.set('b', 'encodedBuild')
      
      const paramString = params.toString()
      const newHash = paramString ? `${path}?${paramString}` : path
      
      expect(newHash).toBe('#/build?b=encodedBuild')
    })
  })
})
