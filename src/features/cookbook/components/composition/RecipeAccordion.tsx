import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { ChevronDown, ChevronRight, Plus, Minus, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RecipeWithComputed } from '../../types'

interface RecipeAccordionProps {
  recipes: RecipeWithComputed[]
  onRecipeClick?: (recipe: RecipeWithComputed) => void
  selectedRecipes?: string[]
  showEffects?: boolean
  showIngredients?: boolean
  className?: string
}

interface RecipeAccordionItemProps {
  recipe: RecipeWithComputed
  isExpanded: boolean
  onToggle: () => void
  onRecipeClick?: (recipe: RecipeWithComputed) => void
  isSelected?: boolean
  showEffects?: boolean
  showIngredients?: boolean
}

function RecipeAccordionItem({
  recipe,
  isExpanded,
  onToggle,
  onRecipeClick,
  isSelected = false,
  showEffects = true,
  showIngredients = true,
}: RecipeAccordionItemProps) {
  const handleClick = () => {
    onRecipeClick?.(recipe)
  }

  // Helper function to extract ingredient name from object or string
  const getIngredientName = (ingredient: any): string => {
    if (typeof ingredient === 'string') return ingredient
    if (ingredient && typeof ingredient === 'object') {
      // Prioritize 'item' property as that's the actual structure
      if (ingredient.item) return ingredient.item
      if (ingredient.name) return ingredient.name
      if (ingredient.label) return ingredient.label
      if (ingredient.id) return ingredient.id
      // If we can't extract a meaningful name, return a fallback
      return 'Unknown Ingredient'
    }
    return String(ingredient || '')
  }

  // Helper function to safely render text content
  const renderText = (value: any): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'number') return value.toString()
    if (value && typeof value === 'object') {
      if (value.name) return value.name
      if (value.label) return value.label
      if (value.id) return value.id
      if (value.item) return value.item
      if (value.category) return value.category
      // For ingredient objects, use the dedicated helper
      return getIngredientName(value)
    }
    return String(value || '')
  }

  // Helper function to get effect icon based on effect type
  const getEffectIcon = (effect: any) => {
    // For recipe effects, we'll use positive icons since they're generally beneficial
    return <Plus className="h-4 w-4 text-green-500" />
  }

  // Helper function to format ingredient with count
  const formatIngredientWithCount = (ingredient: any): { name: string; count: number } => {
    if (typeof ingredient === 'string') {
      return { name: ingredient, count: 1 }
    }
    if (ingredient && typeof ingredient === 'object') {
      const name = getIngredientName(ingredient)
      const count = ingredient.count || ingredient.amount || 1
      return { name, count }
    }
    return { name: String(ingredient || ''), count: 1 }
  }

  return (
    <Card className={`mb-2 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="p-1 h-auto"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{renderText(recipe.name)}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {renderText(recipe.output)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {recipe.category && (
              <Badge variant="secondary" className="text-xs">
                {renderText(recipe.category)}
              </Badge>
            )}
            {recipe.type && (
              <Badge variant="outline" className="text-xs">
                {renderText(recipe.type)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {recipe.description && (
              <div>
                <p className="text-sm text-muted-foreground">
                  {renderText(recipe.description)}
                </p>
              </div>
            )}
            
            {showIngredients && recipe.ingredients.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Ingredients</div>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => {
                    const { name, count } = formatIngredientWithCount(ingredient)
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                        <span className="text-sm">{name}</span>
                        <span className="font-medium text-sm">×{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            {showEffects && recipe.effects.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-3">Effects</div>
                <div className="space-y-3">
                                     {recipe.effects.map((effect, index) => (
                     <div
                       key={index}
                       className="p-3 bg-muted/50 rounded-lg border border-border"
                     >
                       <div className="flex items-start gap-3">
                         {getEffectIcon(effect)}
                         <div className="flex-1">
                           <div className="font-medium text-sm mb-1">
                             {renderText(effect.name)}
                           </div>
                           {effect.description && (
                             <div className="text-sm text-muted-foreground">
                               {renderText(effect.description)}
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
              <span>Total Magnitude: {recipe.totalMagnitude}</span>
              <span>Max Duration: {recipe.maxDuration}s</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              className="w-full"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export function RecipeAccordion({
  recipes,
  onRecipeClick,
  selectedRecipes = [],
  showEffects = true,
  showIngredients = true,
  className,
}: RecipeAccordionProps) {
  const [expandedRecipes, setExpandedRecipes] = useState<Set<string>>(new Set())

  const handleToggle = (recipeName: string) => {
    const newExpanded = new Set(expandedRecipes)
    if (newExpanded.has(recipeName)) {
      newExpanded.delete(recipeName)
    } else {
      newExpanded.add(recipeName)
    }
    setExpandedRecipes(newExpanded)
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
    <div className={`space-y-2 ${className || ''}`}>
      {recipes.map((recipe) => (
        <RecipeAccordionItem
          key={recipe.name}
          recipe={recipe}
          isExpanded={expandedRecipes.has(recipe.name)}
          onToggle={() => handleToggle(recipe.name)}
          onRecipeClick={handleRecipeClick}
          isSelected={selectedRecipes.includes(recipe.name)}
          showEffects={showEffects}
          showIngredients={showIngredients}
        />
      ))}
    </div>
  )
} 