import { useEffect, useRef } from 'react'
import { useCharacterStore } from '../stores/characterStore'
import { decode, encode } from '../utils/urlEncoding'

export const useURLSync = () => {
  const build = useCharacterStore(state => state.build)
  const setBuild = useCharacterStore(state => state.setBuild)
  const hasHydrated = useRef(false)

  // Hydrate on load (only once)
  useEffect(() => {
    if (hasHydrated.current) return
    
    const hash = window.location.hash
    const [path, paramsString] = hash.split('?')
    const params = new URLSearchParams(paramsString || '')
    const encodedBuild = params.get('b')
    
    console.log('URL Sync - Hydrating from URL:', { hash, encodedBuild })
    
    if (encodedBuild) {
      const decoded = decode(encodedBuild)
      console.log('URL Sync - Decoded build:', decoded)
      
      if (decoded?.v === 1) {
        console.log('URL Sync - Setting build from URL')
        setBuild(decoded)
      } else {
        console.warn('Invalid or outdated build schema in URL')
      }
    } else {
      console.log('URL Sync - No build parameter found in URL')
    }
    
    hasHydrated.current = true
  }, [setBuild])

  // Test URL encoding/decoding
  useEffect(() => {
    const testBuild = {
      v: 1,
      name: 'Test',
      perks: {
        selected: { 'archery': ['archery_01'] },
        ranks: { 'archery_01': 1 }
      }
    }
    const encoded = encode(testBuild)
    const decoded = decode(encoded)
    console.log('URL Sync - Test encoding/decoding:', { testBuild, encoded, decoded, matches: JSON.stringify(testBuild) === JSON.stringify(decoded) })
  }, [])

  // Update URL on state change (but not during initial hydration)
  useEffect(() => {
    if (!hasHydrated.current) return
    
    console.log('URL Sync - Build state changed:', build)
    
    const encodedBuild = encode(build)
    const currentHash = window.location.hash
    const [path, existingParams] = currentHash.split('?')
    const params = new URLSearchParams(existingParams || '')

    // Update or add the build parameter
    params.set('b', encodedBuild)

    // Preserve the current path, just update the parameters
    const newHash = `${path}?${params.toString()}`
    console.log('URL Sync - Updating URL:', newHash)
    window.history.replaceState(null, '', newHash)
  }, [
    build.v, 
    build.name, 
    build.notes,
    build.race, 
    build.stone, 
    build.religion, 
    build.traits, 
    build.traitLimits,
    build.skills, 
    build.perks, 
    build.skillLevels,
    build.equipment, 
    build.destinyPath,
    build.userProgress,
    build.attributeAssignments
  ])
}
