import React, { useCallback, useEffect, useRef, useState } from 'react'

interface BuildCard {
  id: string
  component: React.ReactNode
  size?: 'half' | 'full' // half = 2 per row, full = full width
}

interface BuildMasonryGridProps {
  cards: BuildCard[]
  className?: string
  gap?: number
}

export function BuildMasonryGrid({
  cards,
  className = '',
  gap = 16,
}: BuildMasonryGridProps) {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate responsive columns based on container width
  const getResponsiveColumns = useCallback(() => {
    if (containerWidth < 768) return 1 // Mobile
    if (containerWidth < 1024) return 2 // Tablet
    if (containerWidth < 1280) return 3 // Small desktop
    return 4 // Large desktop
  }, [containerWidth])

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

  // Create masonry layout with proper vertical stacking
  const renderMasonryLayout = useCallback(() => {
    const currentColumns = containerWidth < 768 ? 1 : 2

    // For the build page, we'll use a hybrid approach:
    // - All half-width cards go into a masonry layout
    // - Full-width cards break the masonry and appear in their natural position

    const result: React.ReactNode[] = []
    let currentGroup: typeof cards = []

    // Group consecutive half-width cards
    cards.forEach((card, index) => {
      if (card.size === 'full') {
        // If we have accumulated half-width cards, render them as masonry
        if (currentGroup.length > 0) {
          result.push(renderMasonryGroup(currentGroup, currentColumns))
          currentGroup = []
        }

        // Add the full-width card
        result.push(
          <div
            key={card.id}
            id={card.id}
            style={{
              width: '100%',
              marginBottom: `${gap}px`,
            }}
          >
            {card.component}
          </div>
        )
      } else {
        // Accumulate half-width cards
        currentGroup.push(card)
      }
    })

    // Render any remaining half-width cards
    if (currentGroup.length > 0) {
      result.push(renderMasonryGroup(currentGroup, currentColumns))
    }

    return <>{result}</>
  }, [cards, containerWidth, gap])

  // Helper function to render a group of half-width cards as masonry
  const renderMasonryGroup = useCallback(
    (groupCards: typeof cards, columns: number) => {
      // Create columns for proper masonry distribution
      const masonryColumns: React.ReactNode[][] = Array.from(
        { length: columns },
        () => []
      )

      // Track column heights for proper distribution
      const columnHeights = new Array(columns).fill(0)

      // Distribute cards to columns
      groupCards.forEach(card => {
        // Find shortest column
        let shortestColumn = 0
        let minHeight = Infinity

        for (let i = 0; i < columns; i++) {
          if (columnHeights[i] < minHeight) {
            minHeight = columnHeights[i]
            shortestColumn = i
          }
        }

        masonryColumns[shortestColumn].push(
          <div
            key={card.id}
            id={card.id}
            style={{
              width: '100%',
              marginBottom: `${gap}px`,
            }}
          >
            {card.component}
          </div>
        )
        columnHeights[shortestColumn] += 1
      })

      return (
        <div
          key={`group-${groupCards[0]?.id}`}
          style={{
            display: 'flex',
            width: '100%',
            marginBottom: `${gap}px`,
          }}
        >
          {masonryColumns.map((columnItems, columnIndex) => (
            <div
              key={columnIndex}
              style={{
                width: `calc(${100 / columns}% - ${gap / 2}px)`,
                marginRight: columnIndex < columns - 1 ? `${gap}px` : 0,
              }}
            >
              {columnItems}
            </div>
          ))}
        </div>
      )
    },
    [gap]
  )

  if (cards.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No build cards to display</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className}>
      <div
        style={{
          width: '100%',
        }}
      >
        {renderMasonryLayout()}
      </div>
    </div>
  )
}
