import React from 'react'
import { RecipeCard } from '../atomic'
import type { RecipeWithComputed } from '../../types'

interface RecipeListProps {
  recipes: RecipeWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  onRecipeClick?: (recipe: RecipeWithComputed) => void
  selectedRecipes?: string[]
  showEffects?: boolean
  showIngredients?: boolean
  className?: string
}

export function RecipeList({
  recipes,
  variant = 'default',
  onRecipeClick,
  selectedRecipes = [],
  showEffects = true,
  showIngredients = true,
  className,
}: RecipeListProps) {
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
    <div className={`space-y-3 ${className || ''}`}>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.name}
          recipe={recipe}
          variant={variant}
          onClick={() => handleRecipeClick(recipe)}
          isSelected={selectedRecipes.includes(recipe.name)}
          showEffects={showEffects}
          showIngredients={showIngredients}
        />
      ))}
    </div>
  )
}

// Specialized list components for different use cases
export function CompactRecipeList(props: Omit<RecipeListProps, 'variant'>) {
  return <RecipeList variant="compact" {...props} />
}

export function DetailedRecipeList(props: Omit<RecipeListProps, 'variant'>) {
  return <RecipeList variant="detailed" {...props} />
} 