import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import type { RecipeWithComputed } from '../../types'

interface RecipeCardProps {
  recipe: RecipeWithComputed
  variant?: 'default' | 'compact' | 'detailed'
  onClick?: () => void
  isSelected?: boolean
  showEffects?: boolean
  showIngredients?: boolean
}

export function RecipeCard({
  recipe,
  variant = 'default',
  onClick,
  isSelected = false,
  showEffects = true,
  showIngredients = true,
}: RecipeCardProps) {
  const handleClick = () => {
    onClick?.()
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
      // If it's an object, try to extract a meaningful string
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

  const renderCompact = () => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
                     <h3 className="text-sm font-medium truncate">{renderText(recipe.name)}</h3>
           <div className="flex gap-1">
             {recipe.category && (
               <Badge variant="secondary" className="text-xs">
                 {renderText(recipe.category)}
               </Badge>
             )}
             <Badge 
               variant={recipe.difficulty === 'Simple' ? 'default' : recipe.difficulty === 'Moderate' ? 'secondary' : 'destructive'}
               className="text-xs"
             >
               {renderText(recipe.difficulty)}
             </Badge>
           </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground">
          {recipe.ingredientCount} ingredients • {recipe.effectCount} effects
        </div>
      </CardContent>
    </Card>
  )

  const renderDefault = () => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
                     <div className="flex-1 min-w-0">
             <h3 className="font-medium truncate">{renderText(recipe.name)}</h3>
             {recipe.description && (
               <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                 {renderText(recipe.description)}
               </p>
             )}
           </div>
           <div className="flex flex-col gap-1 ml-2">
             {recipe.category && (
               <Badge variant="secondary" className="text-xs">
                 {renderText(recipe.category)}
               </Badge>
             )}
             <Badge 
               variant={recipe.difficulty === 'Simple' ? 'default' : recipe.difficulty === 'Moderate' ? 'secondary' : 'destructive'}
               className="text-xs"
             >
               {renderText(recipe.difficulty)}
             </Badge>
           </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {showIngredients && recipe.ingredients.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Ingredients ({recipe.ingredientCount})
              </div>
              <div className="flex flex-wrap gap-1">
                                 {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                   <Badge key={index} variant="outline" className="text-xs">
                     {renderText(ingredient)}
                   </Badge>
                 ))}
                {recipe.ingredients.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{recipe.ingredients.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {showEffects && recipe.effects.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Effects ({recipe.effectCount})
              </div>
              <div className="flex flex-wrap gap-1">
                                 {recipe.effects.slice(0, 2).map((effect, index) => (
                   <Badge key={index} variant="outline" className="text-xs">
                     {renderText(effect.name)} ({renderText(effect.magnitude)})
                   </Badge>
                 ))}
                {recipe.effects.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{recipe.effects.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderDetailed = () => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
                     <div className="flex-1 min-w-0">
             <h3 className="font-medium">{renderText(recipe.name)}</h3>
             {recipe.description && (
               <p className="text-sm text-muted-foreground mt-1">
                 {renderText(recipe.description)}
               </p>
             )}
           </div>
           <div className="flex flex-col gap-1 ml-2">
             {recipe.category && (
               <Badge variant="secondary" className="text-xs">
                 {renderText(recipe.category)}
               </Badge>
             )}
             <Badge 
               variant={recipe.difficulty === 'Simple' ? 'default' : recipe.difficulty === 'Moderate' ? 'secondary' : 'destructive'}
               className="text-xs"
             >
               {renderText(recipe.difficulty)}
             </Badge>
             {recipe.type && (
               <Badge variant="outline" className="text-xs">
                 {renderText(recipe.type)}
               </Badge>
             )}
           </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {showIngredients && recipe.ingredients.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Ingredients</div>
              <div className="flex flex-wrap gap-1">
                                 {recipe.ingredients.map((ingredient, index) => (
                   <Badge key={index} variant="outline" className="text-xs">
                     {renderText(ingredient)}
                   </Badge>
                 ))}
              </div>
            </div>
          )}
          
          {showEffects && recipe.effects.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Effects</div>
              <div className="space-y-1">
                                 {recipe.effects.map((effect, index) => (
                   <div key={index} className="flex items-center justify-between text-sm">
                     <span className="font-medium">{renderText(effect.name)}</span>
                     <div className="flex items-center gap-2 text-muted-foreground">
                       <span>{renderText(effect.magnitude)}</span>
                       {effect.duration > 0 && <span>{renderText(effect.duration)}s</span>}
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
        </div>
      </CardContent>
    </Card>
  )

  switch (variant) {
    case 'compact':
      return renderCompact()
    case 'detailed':
      return renderDetailed()
    default:
      return renderDefault()
  }
} 