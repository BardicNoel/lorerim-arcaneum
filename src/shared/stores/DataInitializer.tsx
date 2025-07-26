import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useBirthsignsStore,
  useDestinyNodesStore,
  usePerkTreesStore,
  useRacesStore,
  useReligionsStore,
  useSkillsStore,
  useTraitsStore,
} from './index'

interface DataInitializerProps {
  children: React.ReactNode
  showLoadingIndicator?: boolean
}

export function DataInitializer({
  children,
  showLoadingIndicator = false,
}: DataInitializerProps) {
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasInitialized = useRef(false)

  // Use selectors to get only the load functions
  const birthsignsLoad = useBirthsignsStore(state => state.load)
  const destinyNodesLoad = useDestinyNodesStore(state => state.load)
  const perkTreesLoad = usePerkTreesStore(state => state.load)
  const racesLoad = useRacesStore(state => state.load)
  const religionsLoad = useReligionsStore(state => state.load)
  const skillsLoad = useSkillsStore(state => state.load)
  const traitsLoad = useTraitsStore(state => state.load)

  const initializeData = useCallback(async () => {
    if (hasInitialized.current) return

    try {
      setIsInitializing(true)
      setError(null)

      // Load all data in parallel
      await Promise.all([
        birthsignsLoad(),
        destinyNodesLoad(),
        perkTreesLoad(),
        racesLoad(),
        religionsLoad(),
        skillsLoad(),
        traitsLoad(),
      ])

      hasInitialized.current = true
      setIsInitializing(false)
    } catch (err) {
      console.error('Failed to initialize data:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize data')
      setIsInitializing(false)
    }
  }, [
    birthsignsLoad,
    destinyNodesLoad,
    perkTreesLoad,
    racesLoad,
    religionsLoad,
    skillsLoad,
    traitsLoad,
  ])

  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Show loading indicator if requested and still initializing
  if (isInitializing && showLoadingIndicator) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    )
  }

  // Show error if initialization failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <h2 className="text-xl font-semibold">Failed to Load Data</h2>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={initializeData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
