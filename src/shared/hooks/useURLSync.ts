import { useCallback, useEffect, useRef } from 'react'
import { useCharacterStore } from '../stores/characterStore'
import { toLegacy } from '../utils/buildCompression'
import { cleanupUrl, hasMainUrlQueryParams } from '../utils/urlCleanup'
import { decode, encode } from '../utils/urlEncoding'
import { validateBuild } from '../utils/validateBuild'

export const useURLSync = () => {
  const build = useCharacterStore(state => state.build)
  const setBuild = useCharacterStore(state => state.setBuild)
  const hasHydrated = useRef(false)
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced URL update function
  const debouncedUpdateURL = useCallback((buildData: typeof build) => {
    // Clear any existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    // Set a new timeout for the URL update
    updateTimeoutRef.current = setTimeout(() => {
      // Use requestIdleCallback for non-blocking URL updates
      const updateURL = () => {
        // Convert to legacy format for consistent property access
        const legacyBuild = toLegacy(buildData)

        console.log('🔄 [URL Sync] Updating URL with build state:', legacyBuild)
        console.log('🔄 [URL Sync] Build state details:', {
          race: legacyBuild.race,
          stone: legacyBuild.stone,
          destinyPath: legacyBuild.destinyPath,
          level: legacyBuild.attributeAssignments?.level,
        })

        try {
          const encodedBuild = encode(buildData)
          console.log('🔄 [URL Sync] Encoded build:', encodedBuild)
          const currentHash = window.location.hash
          console.log('🔄 [URL Sync] Current hash for update:', currentHash)

          // Handle hash parsing more robustly
          const hashParts = currentHash.split('?')
          const path = hashParts[0]
          const existingParams = hashParts[1] || ''
          const params = new URLSearchParams(existingParams)

          // Check if this is a default/empty build
          const isDefaultBuild =
            legacyBuild.name === '' &&
            legacyBuild.notes === '' &&
            legacyBuild.race === null &&
            legacyBuild.stone === null &&
            legacyBuild.religion === null &&
            legacyBuild.favoriteBlessing === null &&
            legacyBuild.traits.regular.length === 0 &&
            legacyBuild.traits.bonus.length === 0 &&
            legacyBuild.skills.major.length === 0 &&
            legacyBuild.skills.minor.length === 0 &&
            Object.keys(legacyBuild.skillLevels).length === 0 &&
            legacyBuild.equipment.length === 0 &&
            legacyBuild.destinyPath.length === 0 &&
            legacyBuild.userProgress.unlocks.length === 0 &&
            legacyBuild.attributeAssignments.health === 0 &&
            legacyBuild.attributeAssignments.stamina === 0 &&
            legacyBuild.attributeAssignments.magicka === 0 &&
            legacyBuild.attributeAssignments.level === 1 &&
            Object.keys(legacyBuild.attributeAssignments.assignments).length ===
              0 &&
            Object.keys(legacyBuild.perks.selected).length === 0

          if (isDefaultBuild) {
            // For default builds, remove the build parameter entirely
            params.delete('b')
            console.log(
              '🔄 [URL Sync] Default build detected, removing build parameter'
            )
          } else {
            // Update or add the build parameter
            params.set('b', encodedBuild)
          }

          // Build the new hash
          const paramString = params.toString()
          const newHash = paramString ? `${path}?${paramString}` : path
          console.log('🔄 [URL Sync] New hash:', newHash)

          // Ensure we're using hash-based routing (clean up any main URL query params)
          const cleanUrl =
            window.location.origin + window.location.pathname + newHash
          window.history.replaceState(null, '', cleanUrl)
          console.log('✅ [URL Sync] URL updated successfully')
          console.log('🔄 [URL Sync] Final URL:', window.location.href)

          // Double-check that we don't have any main URL query params
          if (hasMainUrlQueryParams()) {
            console.log(
              '🔄 [URL Sync] Detected remaining main URL query params, cleaning up...'
            )
            cleanupUrl()
          }
        } catch (error) {
          console.error('❌ [URL Sync] Error updating URL:', error)
        }
      }

      // Use requestIdleCallback if available, otherwise fall back to setTimeout
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(updateURL, { timeout: 100 })
      } else {
        setTimeout(updateURL, 0)
      }
    }, 300) // 300ms debounce delay
  }, [])

  // Hydrate on load (only once)
  useEffect(() => {
    if (hasHydrated.current) {
      console.log('🔄 [URL Sync] Hydration already completed, skipping...')
      return
    }

    // Use requestIdleCallback for non-blocking hydration
    const hydrate = () => {
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
        console.log(
          '🔄 [URL Sync] Hash parts - path:',
          path,
          'params:',
          paramsString
        )
      }

      // If not found in hash, check main URL query parameters
      if (!encodedBuild && search) {
        const params = new URLSearchParams(search)
        encodedBuild = params.get('b')
        console.log('🔄 [URL Sync] Found build in main URL query params')
      }

      if (encodedBuild) {
        console.log('🔄 [URL Sync] Found encoded build in URL:', encodedBuild)

        try {
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
        } catch (error) {
          console.error('❌ [URL Sync] Error decoding build from URL:', error)
        }
      } else {
        console.log('🔄 [URL Sync] No encoded build found in URL')
      }

      hasHydrated.current = true
      console.log('✅ [URL Sync] Hydration completed')
    }

    // Use requestIdleCallback if available, otherwise fall back to setTimeout
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(hydrate, { timeout: 200 })
    } else {
      setTimeout(hydrate, 0)
    }
  }, [setBuild])

  // Update URL on state change (but not during initial hydration)
  useEffect(() => {
    if (!hasHydrated.current || !build) return

    // Use debounced URL update to prevent excessive updates
    debouncedUpdateURL(build)
  }, [
    build.v,
    // Convert to legacy format for dependency tracking
    JSON.stringify(toLegacy(build)),
  ])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [])
}
