import { useEffect, useRef } from 'react'
import { useCharacterStore } from '../stores/characterStore'
import { decode, encode } from '../utils/urlEncoding'

export const useURLSync = () => {
  const build = useCharacterStore(state => state.build)
  const setBuild = useCharacterStore(state => state.setBuild)
  const hasHydrated = useRef(false)

  // Hydrate on load (only once)
  useEffect(() => {
    if (hasHydrated.current) {
      console.log('🔄 [URL Sync] Hydration already completed, skipping...')
      return
    }
    
    console.log('🔄 [URL Sync] Starting hydration...')
    const hash = window.location.hash
    const [path, paramsString] = hash.split('?')
    const params = new URLSearchParams(paramsString || '')
    const encodedBuild = params.get('b')
    
    if (encodedBuild) {
      console.log('🔄 [URL Sync] Found encoded build in URL:', encodedBuild)
      const decoded = decode(encodedBuild)
      console.log('🔄 [URL Sync] Decoded build:', decoded)
      
      if (decoded?.v === 1) {
        console.log('🔄 [URL Sync] Setting build from URL...')
        setBuild(decoded)
        console.log('✅ [URL Sync] Build set from URL')
      }
    } else {
      console.log('🔄 [URL Sync] No encoded build found in URL')
    }
    
    hasHydrated.current = true
    console.log('✅ [URL Sync] Hydration completed')
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
    // Test encoding/decoding silently
  }, [])

  // Update URL on state change (but not during initial hydration)
  useEffect(() => {
    if (!hasHydrated.current) return
    
    console.log('🔄 [URL Sync] Updating URL with build state:', build)
    console.log('🔄 [URL Sync] Build state details:', {
      race: build.race,
      stone: build.stone,
      destinyPath: build.destinyPath,
      level: build.attributeAssignments?.level
    })
    const encodedBuild = encode(build)
    console.log('🔄 [URL Sync] Encoded build:', encodedBuild)
    const currentHash = window.location.hash
    const [path, existingParams] = currentHash.split('?')
    const params = new URLSearchParams(existingParams || '')

    // Update or add the build parameter
    params.set('b', encodedBuild)

    // Preserve the current path, just update the parameters
    const newHash = `${path}?${params.toString()}`
    window.history.replaceState(null, '', newHash)
    console.log('✅ [URL Sync] URL updated successfully')
  }, [
    build.v, 
    build.name, 
    build.notes,
    build.race, 
    build.stone, 
    build.religion, 
    build.favoriteBlessing,
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
