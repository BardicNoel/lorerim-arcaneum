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

  // Calculate item width based on current columns
  const getItemWidth = useCallback(() => {
    const currentColumns = getResponsiveColumns()
    return `calc(${100 / currentColumns}% - ${gap}px)`
  }, [getResponsiveColumns, gap])

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

  // Render grid items
  const renderGridItems = useCallback(() => {
    return items.map((item, index) => {
      const key = keyExtractor(item)
      const itemWidth = getItemWidth()

      return (
        <div
          key={key}
          style={{
            width: itemWidth,
            marginBottom: `${gap}px`,
          }}
        >
          {renderItem(item)}
        </div>
      )
    })
  }, [items, keyExtractor, renderItem, getItemWidth, gap])

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
          display: 'grid',
          gridTemplateColumns: `repeat(${getResponsiveColumns()}, 1fr)`,
          gap: `${gap}px`,
          width: '100%',
        }}
      >
        {renderGridItems()}
      </div>
    </div>
  )
}
