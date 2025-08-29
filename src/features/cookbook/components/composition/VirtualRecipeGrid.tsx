import React, { useCallback, useEffect, useRef, useState } from 'react'
import { RecipeCard } from '../atomic/RecipeCard'
import type { RecipeWithComputed } from '../../types'

export interface VirtualRecipeGridProps {
  recipes: RecipeWithComputed[]
  loadMore?: () => void
  hasMore?: boolean
  columns?: number
  gap?: number
  maxColumnWidth?: number
  className?: string
  variant?: 'default' | 'compact'
  onRecipeClick?: (recipe: RecipeWithComputed) => void
  showEffects?: boolean
  showIngredients?: boolean
  getEffectComparisons?: (recipe: RecipeWithComputed) => any[]
}

export function VirtualRecipeGrid({
  recipes,
  loadMore,
  hasMore = true,
  columns = 3,
  gap = 12,
  maxColumnWidth,
  className = '',
  variant = 'default',
  onRecipeClick,
  showEffects = true,
  showIngredients = true,
  getEffectComparisons,
}: VirtualRecipeGridProps) {
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
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.name}
            recipe={recipe}
            variant={variant}
            onClick={() => onRecipeClick?.(recipe)}
            showEffects={showEffects}
            showIngredients={showIngredients}
            effectComparisons={getEffectComparisons?.(recipe) || []}
            className="w-full h-full"
          />
        ))}
      </div>
    )
  }, [recipes, getResponsiveColumns, gap, variant, onRecipeClick, showEffects, showIngredients, getEffectComparisons])

  if (recipes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No recipes to display</p>
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
