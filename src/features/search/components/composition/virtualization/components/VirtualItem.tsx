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

    // Measure immediately and then with a small delay to ensure DOM is fully rendered
    measureHeight()
    const timeoutId = setTimeout(measureHeight, 10)

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
      }, 16) // ~60fps
    })

    observer.observe(elementRef.current)

    return () => {
      clearTimeout(timeoutId)
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

