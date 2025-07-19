import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCharacterStore } from '../stores/characterStore'
import { decode, encode } from '../utils/urlEncoding'

export const useURLSync = () => {
  const { build, setBuild } = useCharacterStore()
  const location = useLocation()
  const navigate = useNavigate()

  // Hydrate on load
  useEffect(() => {
    const hash = window.location.hash
    const [path, paramsString] = hash.split('?')
    const params = new URLSearchParams(paramsString || '')
    const encodedBuild = params.get('b')
    if (encodedBuild) {
      const decoded = decode(encodedBuild)
      if (decoded?.v === 1) {
        setBuild(decoded)
      } else {
        console.warn('Invalid or outdated build schema in URL')
      }
    }
  }, [setBuild])

  // Update URL on state change
  useEffect(() => {
    const encodedBuild = encode(build)
    const currentHash = window.location.hash
    const [path, existingParams] = currentHash.split('?')
    const params = new URLSearchParams(existingParams || '')

    // Update or add the build parameter
    params.set('b', encodedBuild)

    // Preserve the current path, just update the parameters
    const newHash = `${path}?${params.toString()}`
    window.history.replaceState(null, '', newHash)
  }, [build])
}
