import React, { useCallback, useEffect, useRef, useState } from 'react'

export interface VirtualMasonryGridProps<T> {
  items: T[]
  keyExtractor: (item: T) => string
  renderItem: (item: T) => React.ReactNode
  loadMore?: () => void
  hasMore?: boolean
  columns?: number // Default 3
  gap?: number // Default 12px
  maxColumnWidth?: number // Optional, for responsive constraints
  className?: string
}

export function VirtualMasonryGrid<T>({
  items,
  keyExtractor,
  renderItem,
  loadMore,
  hasMore = true,
  columns = 3,
  gap = 12,
  maxColumnWidth,
  className = '',
}: VirtualMasonryGridProps<T>) {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate responsive columns based on container width
  const getResponsiveColumns = useCallback(() => {
    if (maxColumnWidth && containerWidth > 0) {
      return Math.max(1, Math.floor(containerWidth / maxColumnWidth))
    }
    return columns
  }, [columns, maxColumnWidth, containerWidth])

  // Handle resize to recalculate layout
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    handleResize() // Initial calculation
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle infinite scroll with intersection observer
  useEffect(() => {
    if (!loadMore || !hasMore) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && loadMore) {
            loadMore()
          }
        })
      },
      { threshold: 0.1 }
    )

    // Observe the last item for infinite scroll
    const lastItem = containerRef.current?.lastElementChild
    if (lastItem) {
      observer.observe(lastItem)
    }

    return () => observer.disconnect()
  }, [loadMore, hasMore, items.length])

  // Create masonry columns
  const renderMasonryColumns = useCallback(() => {
    const currentColumns = getResponsiveColumns()
    const columns: React.ReactNode[][] = Array.from(
      { length: currentColumns },
      () => []
    )

    // Distribute items across columns
    items.forEach((item, index) => {
      const columnIndex = index % currentColumns
      const key = keyExtractor(item)

      columns[columnIndex].push(
        <div
          key={key}
          style={{
            width: '100%',
            marginBottom: `${gap}px`,
          }}
        >
          {renderItem(item)}
        </div>
      )
    })

    return columns.map((columnItems, columnIndex) => (
      <div
        key={columnIndex}
        style={{
          width: `calc(${100 / currentColumns}% - ${gap / 2}px)`,
          marginRight: columnIndex < currentColumns - 1 ? `${gap}px` : 0,
        }}
      >
        {columnItems}
      </div>
    ))
  }, [items, keyExtractor, renderItem, getResponsiveColumns, gap])

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No items to display</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className}>
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        {renderMasonryColumns()}
      </div>
    </div>
  )
}
