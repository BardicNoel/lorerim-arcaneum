import React from 'react'
import type { SearchResult } from '../../model/SearchModel'
import { RecipeCard } from '@/features/cookbook/components/atomic/RecipeCard'
import { RecipeModel } from '@/features/cookbook/model/RecipeModel'
import { FallbackCard } from './index'

// Wrapper component to convert SearchResult to Recipe format
export const RecipeSearchWrapper: React.FC<{
  result: SearchResult
  isSelected?: boolean
  onClick?: () => void
  compact?: boolean
}> = ({ result, isSelected, onClick, compact }) => {
  const recipeData = result.item.originalData
  
  // Check if recipeData has the required properties
  if (!recipeData || !recipeData.name) {
    return <FallbackCard result={result} isSelected={isSelected} onClick={onClick} />
  }
  
  // Transform raw recipe data to RecipeWithComputed
  const recipeWithComputed = RecipeModel.addComputedProperties(recipeData)
  return (
    <RecipeCard
      recipe={recipeWithComputed}
      variant={compact ? 'compact' : 'default'}
      isSelected={isSelected}
      onClick={onClick}
      showEffects={true}
      showIngredients={true}
    />
  )
} 