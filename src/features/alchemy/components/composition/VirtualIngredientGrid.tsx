import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  AlchemyIngredientWithComputed,
  EffectComparison,
} from '../../types'
import { IngredientCard } from '../atomic/IngredientCard'

interface VirtualIngredientGridProps {
  ingredients: AlchemyIngredientWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  onIngredientClick?: (ingredient: AlchemyIngredientWithComputed) => void
  selectedIngredients?: string[]
  showEffects?: boolean
  showProperties?: boolean
  getEffectComparisons?: (
    ingredient: AlchemyIngredientWithComputed
  ) => EffectComparison[]
  loadMore?: () => void
  hasMore?: boolean
  className?: string
  gap?: number
  maxColumnWidth?: number
}

export function VirtualIngredientGrid({
  ingredients,
  variant = 'default',
  columns = 3,
  onIngredientClick,
  selectedIngredients = [],
  showEffects = true,
  showProperties = true,
  getEffectComparisons,
  loadMore,
  hasMore = true,
  className = '',
  gap = 12,
  maxColumnWidth,
}: VirtualIngredientGridProps) {
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
        rootMargin: '0px 0px 4000px 0px',
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
        {ingredients.map(ingredient => {
          const isSelected = selectedIngredients.includes(ingredient.name)
          const effectComparisons = getEffectComparisons?.(ingredient) || []

          return (
            <IngredientCard
              key={ingredient.name}
              ingredient={ingredient}
              variant={variant}
              onClick={() => onIngredientClick?.(ingredient)}
              isSelected={isSelected}
              showEffects={showEffects}
              showProperties={showProperties}
              effectComparisons={effectComparisons}
              className="w-full h-full"
            />
          )
        })}
      </div>
    )
  }, [
    ingredients,
    getResponsiveColumns,
    gap,
    selectedIngredients,
    getEffectComparisons,
    variant,
    onIngredientClick,
    showEffects,
    showProperties,
  ])

  if (ingredients.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No ingredients to display</p>
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
