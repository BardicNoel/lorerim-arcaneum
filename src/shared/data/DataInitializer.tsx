import { useEffect, useState, useRef } from 'react'
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

  useEffect(() => {
    if (hasInitialized.current) return

    const initializeData = async () => {
      try {
        setIsInitializing(true)
        setError(null)
        await loadAllData()
        hasInitialized.current = true
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize data')
        console.error('Data initialization error:', err)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeData()
  }, []) // Remove loadAllData dependency to prevent infinite loop

  if (showLoadingIndicator && isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading game data...</p>
        </div>
      </div>
    )
  }

  if (error && showLoadingIndicator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 