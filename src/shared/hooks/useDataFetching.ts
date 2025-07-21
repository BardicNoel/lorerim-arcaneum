import { useState, useCallback, useEffect } from 'react'

interface UseDataFetchingOptions<T> {
  url: string
  retryCount?: number
  retryDelay?: number
  onError?: (error: Error) => void
  transform?: (data: any) => T
}

interface UseDataFetchingState<T> {
  data: T | null
  loading: boolean
  error: Error | null
  retryCount: number
}

export function useDataFetching<T>({
  url,
  retryCount: maxRetries = 3,
  retryDelay = 1000,
  onError,
  transform,
}: UseDataFetchingOptions<T>) {
  const [state, setState] = useState<UseDataFetchingState<T>>({
    data: null,
    loading: true,
    error: null,
    retryCount: 0,
  })

  const fetchData = useCallback(
    async (isRetry = false) => {
      try {
        setState(prev => ({
          ...prev,
          loading: true,
          error: null,
          retryCount: isRetry ? prev.retryCount + 1 : 0,
        }))

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const rawData = await response.json()
        const data = transform ? transform(rawData) : rawData

        setState(prev => ({
          ...prev,
          data,
          loading: false,
          error: null,
        }))
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error('Unknown error')

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorObj,
        }))

        onError?.(errorObj)

        // Auto-retry logic
        if (state.retryCount < maxRetries) {
          setTimeout(
            () => {
              fetchData(true)
            },
            retryDelay * (state.retryCount + 1)
          )
        }
      }
    },
    [url, maxRetries, retryDelay, onError, transform, state.retryCount]
  )

  const retry = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    retry,
    refetch: () => fetchData(false),
  }
}
