import { cn } from '@/lib/utils'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Plus } from 'lucide-react'
import type { EffectComparison, RecipeWithComputed } from '../../types'

// Feature flag to disable effect comparison until ready for production
const DISABLE_EFFECT_COMPARISON = true

interface RecipeCardProps {
  recipe: RecipeWithComputed
  variant?: 'default' | 'compact' | 'detailed'
  onClick?: () => void
  isSelected?: boolean
  showEffects?: boolean
  showIngredients?: boolean
  effectComparisons?: EffectComparison[]
}

export function RecipeCard({
  recipe,
  variant = 'default',
  onClick,
  isSelected = false,
  showEffects = true,
  showIngredients = true,
  effectComparisons = [],
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

  // Helper function to get effect icon based on effect type
  const getEffectIcon = (effect: any) => {
    // For recipe effects, we'll use positive icons since they're generally beneficial
    return <Plus className="h-4 w-4 text-green-500" />
  }

  // Helper function to format ingredient with count
  const formatIngredientWithCount = (
    ingredient: any
  ): { name: string; count: number } => {
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

  // Helper function to find comparison data for a specific effect
  const getEffectComparison = (
    effectName: string
  ): EffectComparison | undefined => {
    return effectComparisons.find(comparison => comparison.name === effectName)
  }

  // Helper function to format effect description with variance
  const formatEffectDescription = (effect: any): string => {
    if (DISABLE_EFFECT_COMPARISON) {
      return renderText(effect.description || '')
    }

    const comparison = getEffectComparison(effect.name)
    if (!comparison) return renderText(effect.description || '')

    const magnitudeText =
      comparison.magnitude.difference > 0
        ? `${comparison.magnitude.difference.toFixed(1)} more than mean`
        : `${Math.abs(comparison.magnitude.difference).toFixed(1)} less than mean`

    const durationText =
      comparison.duration.difference > 0
        ? `${comparison.duration.difference.toFixed(1)}s longer than mean`
        : `${Math.abs(comparison.duration.difference).toFixed(1)}s shorter than mean`

    const baseDescription = renderText(effect.description || '')
    const varianceText = `(${magnitudeText}, ${durationText})`

    return baseDescription ? `${baseDescription} ${varianceText}` : varianceText
  }

  // Helper function to render effect comparison
  const renderEffectComparison = (comparison: EffectComparison) => {
    return (
      <div
        key={comparison.name}
        className="p-2 bg-muted/30 rounded-lg border border-border"
      >
        <div className="text-xs font-medium mb-2">{comparison.name}</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Magnitude:</span>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'font-medium',
                  comparison.magnitude.difference > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                )}
              >
                {comparison.magnitude.difference > 0 ? '+' : ''}
                {comparison.magnitude.difference.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({comparison.magnitude.percentage > 0 ? '+' : ''}
                {comparison.magnitude.percentage.toFixed(0)}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Duration:</span>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'font-medium',
                  comparison.duration.difference > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                )}
              >
                {comparison.duration.difference > 0 ? '+' : ''}
                {comparison.duration.difference.toFixed(1)}s
              </span>
              <span className="text-muted-foreground">
                ({comparison.duration.percentage > 0 ? '+' : ''}
                {comparison.duration.percentage.toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    )
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
          <h3 className="text-sm font-medium truncate">
            {renderText(recipe.name)}
          </h3>
          <div className="flex gap-1">
            {recipe.category && (
              <Badge variant="secondary" className="text-xs">
                {renderText(recipe.category)}
              </Badge>
            )}
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
              <FormattedText
                text={renderText(recipe.description)}
                className="text-sm text-muted-foreground mt-1 line-clamp-2"
                as="p"
              />
            )}
          </div>
          <div className="flex flex-col gap-1 ml-2">
            {recipe.category && (
              <Badge variant="secondary" className="text-xs">
                {renderText(recipe.category)}
              </Badge>
            )}
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
              <div className="space-y-1">
                {recipe.ingredients.map((ingredient, index) => {
                  const { name, count } = formatIngredientWithCount(ingredient)
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-medium">×{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {showEffects && recipe.effects.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Effects ({recipe.effectCount})
              </div>
              <div className="space-y-2">
                {recipe.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-2">
                      {getEffectIcon(effect)}
                      <div className="flex-1">
                        <div className="font-medium text-xs mb-1">
                          {renderText(effect.name)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <FormattedText
                            text={formatEffectDescription(effect)}
                            className="text-xs text-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!DISABLE_EFFECT_COMPARISON && effectComparisons.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Effect Comparison
              </div>
              <div className="space-y-2">
                {effectComparisons.map(renderEffectComparison)}
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
              <FormattedText
                text={renderText(recipe.description)}
                className="text-sm text-muted-foreground mt-1"
                as="p"
              />
            )}
          </div>
          <div className="flex flex-col gap-1 ml-2">
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
      <CardContent className="pt-0">
        <div className="space-y-3">
          {showIngredients && recipe.ingredients.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Ingredients</div>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => {
                  const { name, count } = formatIngredientWithCount(ingredient)
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                    >
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
                        <div className="text-sm text-muted-foreground">
                          <FormattedText
                            text={formatEffectDescription(effect)}
                            className="text-sm text-muted-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!DISABLE_EFFECT_COMPARISON && effectComparisons.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-3">Effect Comparison</div>
              <div className="space-y-3">
                {effectComparisons.map(comparison => (
                  <div
                    key={comparison.name}
                    className="p-3 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="text-sm font-medium mb-2">
                      {comparison.name}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Magnitude:
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'font-medium',
                              comparison.magnitude.difference > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            )}
                          >
                            {comparison.magnitude.difference > 0 ? '+' : ''}
                            {comparison.magnitude.difference.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">
                            ({comparison.magnitude.percentage > 0 ? '+' : ''}
                            {comparison.magnitude.percentage.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'font-medium',
                              comparison.duration.difference > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            )}
                          >
                            {comparison.duration.difference > 0 ? '+' : ''}
                            {comparison.duration.difference.toFixed(1)}s
                          </span>
                          <span className="text-muted-foreground">
                            ({comparison.duration.percentage > 0 ? '+' : ''}
                            {comparison.duration.percentage.toFixed(0)}%)
                          </span>
                        </div>
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
