import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getBaseUrl, getDataUrl } from './baseUrl'

describe('baseUrl utilities', () => {
  const originalEnv = import.meta.env

  beforeEach(() => {
    // Reset environment
    vi.resetModules()
  })

  afterEach(() => {
    // Restore original environment
    import.meta.env = originalEnv
  })

  describe('getBaseUrl', () => {
    it('should return empty string in development', () => {
      // Mock development environment
      import.meta.env.DEV = true
      import.meta.env.BASE_URL = '/lorerim-arcaneum/'
      
      expect(getBaseUrl()).toBe('')
    })

    it('should return BASE_URL in production', () => {
      // Mock production environment
      import.meta.env.DEV = false
      import.meta.env.BASE_URL = '/lorerim-arcaneum/'
      
      expect(getBaseUrl()).toBe('/lorerim-arcaneum/')
    })

    it('should handle empty BASE_URL', () => {
      // Mock production environment with empty base URL
      import.meta.env.DEV = false
      import.meta.env.BASE_URL = ''
      
      expect(getBaseUrl()).toBe('')
    })
  })

  describe('getDataUrl', () => {
    it('should construct correct URL in development', () => {
      // Mock development environment
      import.meta.env.DEV = true
      import.meta.env.BASE_URL = '/lorerim-arcaneum/'
      
      expect(getDataUrl('data/skills.json')).toBe('data/skills.json')
      expect(getDataUrl('assets/race-avatar/nord.png')).toBe('assets/race-avatar/nord.png')
    })

    it('should construct correct URL in production', () => {
      // Mock production environment
      import.meta.env.DEV = false
      import.meta.env.BASE_URL = '/lorerim-arcaneum/'
      
      expect(getDataUrl('data/skills.json')).toBe('/lorerim-arcaneum/data/skills.json')
      expect(getDataUrl('assets/race-avatar/nord.png')).toBe('/lorerim-arcaneum/assets/race-avatar/nord.png')
    })
  })
}) 