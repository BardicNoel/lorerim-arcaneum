import React from 'react'
import type { SearchableItem } from '../../model/SearchModel'
import { RecipeCard } from '@/features/cookbook/components/atomic/RecipeCard'
import { RecipeModel } from '@/features/cookbook/model/RecipeModel'

interface RecipeSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'grid' | 'list'
}

export const RecipeSearchCard: React.FC<RecipeSearchCardProps> = ({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}) => {
  const recipeData = item.originalData

  if (!recipeData || !recipeData.name) {
    console.warn('RecipeSearchCard: Missing or invalid recipe data for item:', item)
    return (
      <div className="p-4 border rounded-lg bg-muted">
        <h3 className="font-semibold">Recipe not found</h3>
        <p className="text-sm text-muted-foreground">{item.name}</p>
      </div>
    )
  }

  // Transform raw recipe data to RecipeWithComputed
  const recipeWithComputed = RecipeModel.addComputedProperties(recipeData)

  const handleClick = React.useCallback(() => {
    if (onToggle) {
      onToggle()
    }
  }, [onToggle])

  return (
    <RecipeCard
      recipe={recipeWithComputed}
      variant={viewMode === 'list' ? 'compact' : 'default'}
      isSelected={false}
      onClick={handleClick}
      showEffects={true}
      showIngredients={true}
      className={className}
    />
  )
} 