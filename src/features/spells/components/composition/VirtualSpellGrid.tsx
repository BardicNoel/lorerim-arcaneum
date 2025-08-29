import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SpellCard } from './SpellCard'
import type { SpellWithComputed } from '../../types'

export interface VirtualSpellGridProps {
  spells: SpellWithComputed[]
  loadMore?: () => void
  hasMore?: boolean
  columns?: number
  gap?: number
  maxColumnWidth?: number
  className?: string
  variant?: 'default' | 'compact'
  onSpellClick?: (spell: SpellWithComputed) => void
}

export function VirtualSpellGrid({
  spells,
  loadMore,
  hasMore = true,
  columns = 3,
  gap = 12,
  maxColumnWidth,
  className = '',
  variant = 'default',
  onSpellClick,
}: VirtualSpellGridProps) {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null)

  // Calculate responsive columns for uniform grid
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
    if (!loadMore || !hasMore || !loadMoreTriggerRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && loadMore) {
            loadMore()
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px 4000px 0px'
      }
    )

    observer.observe(loadMoreTriggerRef.current)

    return () => observer.disconnect()
  }, [loadMore, hasMore])

    // Simple CSS Grid layout
  const renderGrid = useCallback(() => {
    const currentColumns = getResponsiveColumns()
    
    return (
      <div 
        className="w-full"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${currentColumns}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {spells.map((spell) => (
          <SpellCard
            key={spell.name}
            spell={spell}
            compact={variant === 'compact'}
            onClick={() => onSpellClick?.(spell)}
            className="w-full h-full"
          />
        ))}
      </div>
    )
  }, [spells, getResponsiveColumns, gap, variant, onSpellClick])

  if (spells.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No spells to display</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className}>
      {renderGrid()}
      
      {/* Load More Trigger */}
      {hasMore && loadMore && (
        <div 
          ref={loadMoreTriggerRef}
          className="w-full h-16 mt-16"
          style={{ minHeight: '64px' }}
        />
      )}
    </div>
  )
}
