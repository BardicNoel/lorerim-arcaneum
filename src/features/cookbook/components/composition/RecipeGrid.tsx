import React from 'react'
import { RecipeCard } from '../atomic'
import type { RecipeWithComputed, EffectComparison } from '../../types'

interface RecipeGridProps {
  recipes: RecipeWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  columns?: 1 | 2 | 3 | 4
  onRecipeClick?: (recipe: RecipeWithComputed) => void
  selectedRecipes?: string[]
  showEffects?: boolean
  showIngredients?: boolean
  className?: string
  getEffectComparisons?: (recipe: RecipeWithComputed) => EffectComparison[]
}

export function RecipeGrid({
  recipes,
  variant = 'default',
  columns = 3,
  onRecipeClick,
  selectedRecipes = [],
  showEffects = true,
  showIngredients = true,
  className,
  getEffectComparisons,
}: RecipeGridProps) {
  const getGridClasses = () => {
    const baseClasses = 'grid gap-4'
    
    switch (columns) {
      case 1:
        return `${baseClasses} grid-cols-1`
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
      case 4:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
    }
  }

  const handleRecipeClick = (recipe: RecipeWithComputed) => {
    onRecipeClick?.(recipe)
  }

  if (recipes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-muted-foreground">No recipes found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={getGridClasses()}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.name}
          recipe={recipe}
          variant={variant}
          onClick={() => handleRecipeClick(recipe)}
          isSelected={selectedRecipes.includes(recipe.name)}
          showEffects={showEffects}
          showIngredients={showIngredients}
          effectComparisons={getEffectComparisons?.(recipe) || []}
        />
      ))}
    </div>
  )
}

// Specialized grid components for different use cases
export function CompactRecipeGrid(props: Omit<RecipeGridProps, 'variant'>) {
  return <RecipeGrid variant="compact" {...props} />
}

export function DetailedRecipeGrid(props: Omit<RecipeGridProps, 'variant'>) {
  return <RecipeGrid variant="detailed" {...props} />
}

export function SingleColumnRecipeGrid(props: Omit<RecipeGridProps, 'columns'>) {
  return <RecipeGrid columns={1} {...props} />
}

export function TwoColumnRecipeGrid(props: Omit<RecipeGridProps, 'columns'>) {
  return <RecipeGrid columns={2} {...props} />
}

export function ThreeColumnRecipeGrid(props: Omit<RecipeGridProps, 'columns'>) {
  return <RecipeGrid columns={3} {...props} />
}

export function FourColumnRecipeGrid(props: Omit<RecipeGridProps, 'columns'>) {
  return <RecipeGrid columns={4} {...props} />
} 