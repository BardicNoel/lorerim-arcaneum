import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'

interface PreMeasurementConfig {
  maxItemsToMeasure: number
  columnWidth: number
  renderItem: (item: any) => React.ReactNode
  keyExtractor: (item: any) => string
}

interface PreMeasurementResult {
  isMeasuring: boolean
  measuredHeights: Map<string, number>
  progress: number
  error: string | null
}

export function usePreMeasurement<T>(
  items: T[],
  config: PreMeasurementConfig
): PreMeasurementResult {
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [measuredHeights, setMeasuredHeights] = useState<Map<string, number>>(new Map())
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [hasMeasured, setHasMeasured] = useState(false)
  
  const measurementRef = useRef<{
    container: HTMLDivElement | null
    observers: Map<string, ResizeObserver>
    timeouts: Map<string, NodeJS.Timeout>
  }>({
    container: null,
    observers: new Map(),
    timeouts: new Map()
  })

  // Memoize config to prevent unnecessary re-renders
  const memoizedConfig = useMemo(() => config, [
    config.maxItemsToMeasure,
    config.columnWidth,
    config.renderItem,
    config.keyExtractor
  ])

  const measureItems = useCallback(async () => {
    if (items.length === 0 || hasMeasured) {
      console.log('🔍 [PreMeasurement] measureItems called but skipping', { 
        itemsLength: items.length, 
        hasMeasured 
      })
      return
    }
    
    console.log('🔍 [PreMeasurement] Starting measurement process', {
      totalItems: items.length,
      maxItemsToMeasure: memoizedConfig.maxItemsToMeasure,
      columnWidth: memoizedConfig.columnWidth
    })
    
    setIsMeasuring(true)
    setProgress(0)
    setError(null)
    
    const itemsToMeasure = items.slice(0, memoizedConfig.maxItemsToMeasure)
    console.log('🔍 [PreMeasurement] Items to measure:', itemsToMeasure.length)
    
    try {
      // Create offscreen measuring container
      const container = document.createElement('div')
      container.style.cssText = `
        position: fixed;
        top: -10000px;
        left: 0;
        visibility: hidden;
        width: ${memoizedConfig.columnWidth}px;
        pointer-events: none;
        contain: layout style;
      `
      document.body.appendChild(container)
      measurementRef.current.container = container
      
      console.log('🔍 [PreMeasurement] Created offscreen container')
      
      // Measure items with ResizeObserver
      const measurementPromises = itemsToMeasure.map((item, index) => {
        const itemKey = memoizedConfig.keyExtractor(item)
        console.log(`🔍 [PreMeasurement] Measuring item ${index + 1}/${itemsToMeasure.length}`, { itemKey })
        
        return new Promise<{key: string, height: number}>((resolve) => {
          const itemEl = document.createElement('div')
          itemEl.style.width = '100%'
          itemEl.dataset.itemKey = itemKey
          
          // Render item content
          const itemContent = memoizedConfig.renderItem(item)
          if (React.isValidElement(itemContent)) {
            // For React elements, we need to render them properly
            const root = createRoot(itemEl)
            root.render(itemContent)
            console.log(`🔍 [PreMeasurement] Rendered React element for ${itemKey}`)
          } else {
            itemEl.innerHTML = String(itemContent)
            console.log(`🔍 [PreMeasurement] Rendered HTML content for ${itemKey}`)
          }
          
          container.appendChild(itemEl)
          
          // Wait a bit for React to render, then measure
          setTimeout(() => {
            // Set up ResizeObserver
            const observer = new ResizeObserver((entries) => {
              const height = Math.ceil(entries[0].contentRect.height)
              console.log(`🔍 [PreMeasurement] ResizeObserver fired for ${itemKey}`, { height })
              
              // Only resolve if we have a meaningful height
              if (height > 0) {
                resolve({ key: itemKey, height })
                observer.disconnect()
                measurementRef.current.observers.delete(itemKey)
                
                // Clear timeout
                const timeout = measurementRef.current.timeouts.get(itemKey)
                if (timeout) {
                  clearTimeout(timeout)
                  measurementRef.current.timeouts.delete(itemKey)
                }
              }
            })
            
            observer.observe(itemEl)
            measurementRef.current.observers.set(itemKey, observer)
            
            // Fallback timeout - use a longer timeout to allow React to render
            const timeout = setTimeout(() => {
              const height = itemEl.offsetHeight || 200
              console.log(`🔍 [PreMeasurement] Timeout fallback for ${itemKey}`, { height })
              resolve({ key: itemKey, height })
              observer.disconnect()
              measurementRef.current.observers.delete(itemKey)
              measurementRef.current.timeouts.delete(itemKey)
            }, 5000) // Increased timeout to 5 seconds
            
            measurementRef.current.timeouts.set(itemKey, timeout)
          }, 100) // Wait 100ms for React to render
          
          // Update progress
          setProgress(index + 1)
        })
      })
      
      console.log('🔍 [PreMeasurement] Waiting for all measurements to complete...')
      
      // Wait for all measurements
      const results = await Promise.all(measurementPromises)
      const heightMap = new Map(results.map(r => [r.key, r.height]))
      
      console.log('🔍 [PreMeasurement] All measurements completed', { 
        resultsCount: results.length, 
        heights: Object.fromEntries(heightMap),
        averageHeight: results.reduce((sum, r) => sum + r.height, 0) / results.length
      })
      
      setMeasuredHeights(heightMap)
      setIsMeasuring(false)
      setHasMeasured(true)
      
      console.log('🔍 [PreMeasurement] Measurement process completed successfully')
      
    } catch (err) {
      console.error('🔍 [PreMeasurement] Measurement failed:', err)
      setError(err instanceof Error ? err.message : 'Measurement failed')
      setIsMeasuring(false)
    } finally {
      // Cleanup
      if (measurementRef.current.container) {
        document.body.removeChild(measurementRef.current.container)
        measurementRef.current.container = null
        console.log('🔍 [PreMeasurement] Cleaned up offscreen container')
      }
      
      // Disconnect observers
      measurementRef.current.observers.forEach(observer => observer.disconnect())
      measurementRef.current.observers.clear()
      
      // Clear timeouts
      measurementRef.current.timeouts.forEach(timeout => clearTimeout(timeout))
      measurementRef.current.timeouts.clear()
      
      console.log('🔍 [PreMeasurement] Cleanup completed')
    }
  }, [items, hasMeasured, memoizedConfig])

  // Reset measurement state when items change significantly
  useEffect(() => {
    if (items.length > 0 && hasMeasured) {
      // Check if the first few items have changed
      const currentFirstItems = items.slice(0, memoizedConfig.maxItemsToMeasure)
      const currentKeys = currentFirstItems.map(memoizedConfig.keyExtractor)
      const measuredKeys = Array.from(measuredHeights.keys())
      
      // If the keys don't match, reset and re-measure
      if (currentKeys.length !== measuredKeys.length || 
          !currentKeys.every((key, index) => key === measuredKeys[index])) {
        console.log('🔍 [PreMeasurement] Items changed, resetting measurement state', {
          currentKeys: currentKeys.slice(0, 5), // Log first 5 for debugging
          measuredKeys: measuredKeys.slice(0, 5)
        })
        setHasMeasured(false)
        setMeasuredHeights(new Map())
        setProgress(0)
        setError(null)
      }
    }
  }, [items, hasMeasured, measuredHeights, memoizedConfig])

  // Start measurement when items change
  useEffect(() => {
    if (items.length > 0 && !isMeasuring && !hasMeasured) {
      console.log('🔍 [PreMeasurement] Starting measurement from useEffect', {
        itemsLength: items.length,
        isMeasuring,
        hasMeasured
      })
      measureItems()
    }
  }, [items, measureItems, isMeasuring, hasMeasured])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (measurementRef.current.container) {
        document.body.removeChild(measurementRef.current.container)
      }
      measurementRef.current.observers.forEach(observer => observer.disconnect())
      measurementRef.current.timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  return {
    isMeasuring,
    measuredHeights,
    progress,
    error
  }
}
