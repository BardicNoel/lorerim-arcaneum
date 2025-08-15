import React, { useRef, useEffect } from 'react'
import type { ItemPosition } from '../types/virtualization'

interface VirtualItemProps<T> {
  item: T
  position: ItemPosition
  columns: number
  gap: number
  renderItem: (item: T) => React.ReactNode
  onHeightChange: (element: HTMLElement, item: T) => void
}

export function VirtualItem<T>({
  item,
  position,
  columns,
  gap,
  renderItem,
  onHeightChange,
}: VirtualItemProps<T>) {
  const elementRef = useRef<HTMLDivElement>(null)
  const lastHeightRef = useRef<number>(0)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Immediate height measurement on mount and when content changes
  useEffect(() => {
    if (!elementRef.current) return

    const measureHeight = () => {
      // Check if element still exists before measuring
      if (!elementRef.current) return
      
      const height = elementRef.current.offsetHeight
      if (height > 0 && height !== lastHeightRef.current) {
        lastHeightRef.current = height
        onHeightChange(elementRef.current, item)
      }
    }

    // For initial load, be more conservative with measurements to prevent layout thrashing
    // Start with a longer delay to allow DOM to settle
    const timeoutId1 = setTimeout(measureHeight, 50)  // First measurement after 50ms
    const timeoutId2 = setTimeout(measureHeight, 150) // Second measurement after 150ms
    const timeoutId3 = setTimeout(measureHeight, 300) // Final measurement after 300ms

    // Set up ResizeObserver for dynamic changes with throttling
    const observer = new ResizeObserver(() => {
      // Check if element still exists before measuring
      if (!elementRef.current) return
      
      // Throttle resize measurements to prevent too many updates during scrolling
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        measureHeight()
        resizeTimeoutRef.current = null
      }, 32) // ~30fps for better performance
    })

    observer.observe(elementRef.current)

    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      observer.disconnect()
    }
  }, [item, onHeightChange])

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        top: position.top,
        left: `${(position.column * 100) / columns}%`,
        width: `calc(${100 / columns}% - ${gap}px)`,
        marginRight: `${gap}px`,
        marginBottom: `${gap}px`,
      }}
    >
      {renderItem(item)}
    </div>
  )
}

