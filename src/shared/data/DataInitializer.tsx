import { useEffect, useState, useRef, useCallback } from 'react'
import { useDataStore } from './DataProvider'

interface DataInitializerProps {
  children: React.ReactNode
  showLoadingIndicator?: boolean
}

export function DataInitializer({ 
  children, 
  showLoadingIndicator = false 
}: DataInitializerProps) {
  const loadAllData = useDataStore((state) => state.loadAllData)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasInitialized = useRef(false)

  const initializeData = useCallback(async () => {
    if (hasInitialized.current) return

    try {
      setIsInitializing(true)
      setError(null)
      await loadAllData()
      hasInitialized.current = true
      setIsInitializing(false)
    } catch (err) {
      console.error('Failed to initialize data:', err)
      setError(err instanceof Error ? err.message : 'Failed to initialize data')
      setIsInitializing(false)
    }
  }, [loadAllData])

  useEffect(() => {
    initializeData()
  }, []) // Remove loadAllData dependency to prevent infinite loops

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={initializeData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 