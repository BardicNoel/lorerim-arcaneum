import { useCallback, useEffect, useRef } from 'react'
import type { HeightMeasurementResult } from '../types/virtualization'

/**
 * Hook for measuring element heights with ResizeObserver
 */
export function useHeightMeasurement<T>(
  item: T,
  key: string,
  onHeightChange?: (height: number, item: T) => void
) {
  const elementRef = useRef<HTMLElement>(null)
  const observerRef = useRef<ResizeObserver | null>(null)
  const lastHeightRef = useRef<number>(0)

  // Measure height when element is available
  const measureHeight = useCallback(() => {
    if (!elementRef.current) return

    const height = elementRef.current.offsetHeight
    if (height !== lastHeightRef.current) {
      lastHeightRef.current = height
      onHeightChange?.(height, item)
    }
  }, [item, onHeightChange])

  // Set up ResizeObserver
  useEffect(() => {
    if (!elementRef.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height
        if (height !== lastHeightRef.current) {
          lastHeightRef.current = height
          onHeightChange?.(height, item)
        }
      }
    })

    observer.observe(elementRef.current)
    observerRef.current = observer

    // Initial measurement
    measureHeight()

    return () => {
      observer.disconnect()
      observerRef.current = null
    }
  }, [measureHeight, item, onHeightChange])

  return {
    elementRef,
    height: lastHeightRef.current
  }
}

/**
 * Hook for batch height measurement
 */
export function useBatchHeightMeasurement<T>(
  items: T[],
  keyExtractor: (item: T) => string,
  onHeightChange?: (key: string, height: number, item: T) => void
) {
  const measurementsRef = useRef<Map<string, number>>(new Map())
  const elementRefsRef = useRef<Map<string, HTMLElement>>(new Map())

  // Register element reference
  const registerElement = useCallback((key: string, element: HTMLElement) => {
    elementRefsRef.current.set(key, element)
  }, [])

  // Unregister element reference
  const unregisterElement = useCallback((key: string) => {
    elementRefsRef.current.delete(key)
    measurementsRef.current.delete(key)
  }, [])

  // Get element reference for a specific item
  const getElementRef = useCallback((item: T) => {
    const key = keyExtractor(item)
    return (element: HTMLElement | null) => {
      if (element) {
        registerElement(key, element)
      } else {
        unregisterElement(key)
      }
    }
  }, [keyExtractor, registerElement, unregisterElement])

  // Get measured height for an item
  const getHeight = useCallback((item: T) => {
    const key = keyExtractor(item)
    return measurementsRef.current.get(key) || 0
  }, [keyExtractor])

  // Update height measurement
  const updateHeight = useCallback((key: string, height: number) => {
    const item = items.find(item => keyExtractor(item) === key)
    if (item) {
      measurementsRef.current.set(key, height)
      onHeightChange?.(key, height, item)
    }
  }, [items, keyExtractor, onHeightChange])

  // Get all measurements
  const getAllMeasurements = useCallback(() => {
    return new Map(measurementsRef.current)
  }, [])

  // Clear all measurements
  const clearMeasurements = useCallback(() => {
    measurementsRef.current.clear()
    elementRefsRef.current.clear()
  }, [])

  return {
    getElementRef,
    getHeight,
    updateHeight,
    getAllMeasurements,
    clearMeasurements
  }
}

