import { cn } from '@/lib/utils'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Clock, Coins, FlaskConical, Star, Weight, Zap } from 'lucide-react'
import type {
  AlchemyIngredientWithComputed,
  EffectComparison,
} from '../../types'

// Feature flag to disable effect comparison until ready for production
const DISABLE_EFFECT_COMPARISON = true

interface IngredientCardProps {
  ingredient: AlchemyIngredientWithComputed
  variant?: 'default' | 'compact' | 'detailed'
  onClick?: () => void
  isSelected?: boolean
  showEffects?: boolean
  showProperties?: boolean
  effectComparisons?: EffectComparison[]
}

export function IngredientCard({
  ingredient,
  variant = 'default',
  onClick,
  isSelected = false,
  showEffects = true,
  showProperties = true,
  effectComparisons = [],
}: IngredientCardProps) {
  const handleClick = () => {
    onClick?.()
  }

  // Helper function to get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'text-gray-500'
      case 'Uncommon':
        return 'text-green-500'
      case 'Rare':
        return 'text-blue-500'
      case 'Epic':
        return 'text-purple-500'
      case 'Legendary':
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  // Helper function to get effect icon based on effect type
  const getEffectIcon = (effect: any) => {
    // Use different icons based on effect type
    if (effect.effectType.toLowerCase().includes('damage')) {
      return <Zap className="h-4 w-4 text-red-500" />
    } else if (
      effect.effectType.toLowerCase().includes('heal') ||
      effect.effectType.toLowerCase().includes('restore')
    ) {
      return <FlaskConical className="h-4 w-4 text-green-500" />
    } else if (effect.effectType.toLowerCase().includes('resist')) {
      return <Star className="h-4 w-4 text-blue-500" />
    } else {
      return <FlaskConical className="h-4 w-4 text-purple-500" />
    }
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
      return effect.mgefDescription || ''
    }

    const comparison = getEffectComparison(effect.mgefName)
    if (!comparison) return effect.mgefDescription || ''

    const magnitudeText =
      comparison.magnitude.difference > 0
        ? `${comparison.magnitude.difference.toFixed(1)} more than mean`
        : `${Math.abs(comparison.magnitude.difference).toFixed(1)} less than mean`

    const durationText =
      comparison.duration.difference > 0
        ? `${comparison.duration.difference.toFixed(1)}s longer than mean`
        : `${Math.abs(comparison.duration.difference).toFixed(1)}s shorter than mean`

    const baseDescription = effect.mgefDescription || ''
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
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Base Cost:</span>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'font-medium',
                  comparison.baseCost.difference > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                )}
              >
                {comparison.baseCost.difference > 0 ? '+' : ''}
                {comparison.baseCost.difference.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({comparison.baseCost.percentage > 0 ? '+' : ''}
                {comparison.baseCost.percentage.toFixed(0)}%)
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
          <h3 className="text-sm font-medium truncate">{ingredient.name}</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground">
          {ingredient.value}g • {Math.round(ingredient.weight * 10) / 10}w
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
            <h3 className="font-medium truncate">{ingredient.name}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {showProperties && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                <span>{ingredient.value}g</span>
              </div>
              <div className="flex items-center gap-1">
                <Weight className="h-3 w-3" />
                <span>{Math.round(ingredient.weight * 10) / 10}w</span>
              </div>
            </div>
          )}

          {showEffects && ingredient.effects.length > 0 && (
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">
                Effects
              </div>
              <div className="space-y-2">
                {ingredient.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="p-2 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-2">
                      {getEffectIcon(effect)}
                      <div className="flex-1">
                        <div className="font-bold text-xs mb-1">
                          {effect.mgefName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <FormattedText
                            text={formatEffectDescription(effect)}
                            className="text-xs text-muted-foreground"
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span>Magnitude: {effect.magnitude}</span>
                          <span>Duration: {effect.duration}s</span>
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
            <h3 className="font-medium">{ingredient.name}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {showProperties && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <div>
                  <div className="text-sm font-medium">Value</div>
                  <div className="text-xs text-muted-foreground">
                    {ingredient.value} gold
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">Weight</div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round(ingredient.weight * 10) / 10} units
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-purple-500" />
                <div>
                  <div className="text-sm font-medium">Effects</div>
                  <div className="text-xs text-muted-foreground">Available</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="text-sm font-medium">Total Magnitude</div>
                  <div className="text-xs text-muted-foreground">
                    {ingredient.totalMagnitude}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showEffects && ingredient.effects.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-3">Effects</div>
              <div className="space-y-3">
                {ingredient.effects.map((effect, index) => (
                  <div
                    key={index}
                    className="p-3 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3">
                      {getEffectIcon(effect)}
                      <div className="flex-1">
                        <div className="font-bold text-sm mb-1">
                          {effect.mgefName}
                        </div>
                        <div className="text-base text-muted-foreground mb-2">
                          <FormattedText
                            text={formatEffectDescription(effect)}
                            className="text-base text-muted-foreground"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            <span>Magnitude: {effect.magnitude}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Duration: {effect.duration}s</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <div>Type: {effect.effectType}</div>
                          {effect.skill !== 'None' && (
                            <div>Skill: {effect.skill}</div>
                          )}
                          <div>Form ID: {effect.mgefFormId}</div>
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Base Cost:
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'font-medium',
                              comparison.baseCost.difference > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            )}
                          >
                            {comparison.baseCost.difference > 0 ? '+' : ''}
                            {comparison.baseCost.difference.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground">
                            ({comparison.baseCost.percentage > 0 ? '+' : ''}
                            {comparison.baseCost.percentage.toFixed(0)}%)
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
            <span>Total Magnitude: {ingredient.totalMagnitude}</span>
            <span>Max Duration: {ingredient.maxDuration}s</span>
            <span>Total Base Cost: {ingredient.totalBaseCost.toFixed(2)}</span>
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
