import { useEffect, useRef } from 'react'
import { useCharacterStore } from '../stores/characterStore'
import { decode, encode } from '../utils/urlEncoding'
import { validateBuild } from '../utils/validateBuild'
import { getPerkData } from '../utils/compactPerkEncoding'
import { cleanupUrl, hasMainUrlQueryParams } from '../utils/urlCleanup'

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
    const search = window.location.search
    console.log('🔄 [URL Sync] Current hash:', hash)
    console.log('🔄 [URL Sync] Current search:', search)
    
    // Check both hash and main URL for build parameters
    let encodedBuild = null
    
    // First, check hash parameters
    if (hash) {
      const hashParts = hash.split('?')
      const path = hashParts[0]
      const paramsString = hashParts[1] || ''
      const params = new URLSearchParams(paramsString)
      encodedBuild = params.get('b')
      console.log('🔄 [URL Sync] Hash parts - path:', path, 'params:', paramsString)
    }
    
    // If not found in hash, check main URL query parameters
    if (!encodedBuild && search) {
      const params = new URLSearchParams(search)
      encodedBuild = params.get('b')
      console.log('🔄 [URL Sync] Found build in main URL query params')
    }

    if (encodedBuild) {
      console.log('🔄 [URL Sync] Found encoded build in URL:', encodedBuild)
      const decoded = decode(encodedBuild)
      console.log('🔄 [URL Sync] Decoded build:', decoded)

      if (decoded?.v === 1 || decoded?.v === 2) {
        // Use the validateBuild utility to ensure all properties are properly structured
        const validatedBuild = validateBuild(decoded)

        console.log('🔄 [URL Sync] Setting validated build from URL...')
        setBuild(validatedBuild)
        console.log('✅ [URL Sync] Build set from URL')
        
        // If we loaded from main URL query params, clean them up and move to hash
        if (hasMainUrlQueryParams()) {
          console.log('🔄 [URL Sync] Cleaning up main URL query params...')
          cleanupUrl()
          console.log('✅ [URL Sync] Main URL query params cleaned up')
        }
      }
    } else {
      console.log('🔄 [URL Sync] No encoded build found in URL')
    }

    hasHydrated.current = true
    console.log('✅ [URL Sync] Hydration completed')
  }, [setBuild])

  // Update URL on state change (but not during initial hydration)
  useEffect(() => {
    if (!hasHydrated.current || !build) return

    console.log('🔄 [URL Sync] Updating URL with build state:', build)
    console.log('🔄 [URL Sync] Build state details:', {
      race: build.race,
      stone: build.stone,
      destinyPath: build.destinyPath,
      level: build.attributeAssignments?.level,
    })
    const encodedBuild = encode(build)
    console.log('🔄 [URL Sync] Encoded build:', encodedBuild)
    const currentHash = window.location.hash
    console.log('🔄 [URL Sync] Current hash for update:', currentHash)
    
    // Handle hash parsing more robustly
    const hashParts = currentHash.split('?')
    const path = hashParts[0]
    const existingParams = hashParts[1] || ''
    const params = new URLSearchParams(existingParams)

    // Check if this is a default/empty build
    const isDefaultBuild = build.name === '' && 
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


    if (isDefaultBuild) {
      // For default builds, remove the build parameter entirely
      params.delete('b')
      console.log('🔄 [URL Sync] Default build detected, removing build parameter')
    } else {
      // Update or add the build parameter
      params.set('b', encodedBuild)
    }

    // Build the new hash
    const paramString = params.toString()
    const newHash = paramString ? `${path}?${paramString}` : path
    console.log('🔄 [URL Sync] New hash:', newHash)
    
    // Ensure we're using hash-based routing (clean up any main URL query params)
    const cleanUrl = window.location.origin + window.location.pathname + newHash
    window.history.replaceState(null, '', cleanUrl)
    console.log('✅ [URL Sync] URL updated successfully')
    console.log('🔄 [URL Sync] Final URL:', window.location.href)
    
    // Double-check that we don't have any main URL query params
    if (hasMainUrlQueryParams()) {
      console.log('🔄 [URL Sync] Detected remaining main URL query params, cleaning up...')
      cleanupUrl()
    }
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
    // Handle both legacy and compact perk formats
    'perks' in build ? build.perks : build.p,
    build.skillLevels,
    build.equipment,
    build.destinyPath,
    build.userProgress,
    build.attributeAssignments,
  ])
}
