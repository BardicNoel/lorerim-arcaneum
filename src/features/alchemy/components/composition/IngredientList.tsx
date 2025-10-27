import { cn } from '@/lib/utils'
import type {
  AlchemyIngredientWithComputed,
  EffectComparison,
} from '../../types'
import { IngredientCard } from '../atomic/IngredientCard'

interface IngredientListProps {
  ingredients: AlchemyIngredientWithComputed[]
  variant?: 'default' | 'compact' | 'detailed'
  onIngredientClick?: (ingredient: AlchemyIngredientWithComputed) => void
  selectedIngredients?: string[]
  showEffects?: boolean
  showProperties?: boolean
  getEffectComparisons?: (
    ingredient: AlchemyIngredientWithComputed
  ) => EffectComparison[]
  className?: string
}

export function IngredientList({
  ingredients,
  variant = 'default',
  onIngredientClick,
  selectedIngredients = [],
  showEffects = true,
  showProperties = true,
  getEffectComparisons,
  className,
}: IngredientListProps) {
  const handleIngredientClick = (ingredient: AlchemyIngredientWithComputed) => {
    onIngredientClick?.(ingredient)
  }

  if (ingredients.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">No ingredients found</div>
          <div className="text-base text-muted-foreground">
            Try adjusting your search or filter criteria
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {ingredients.map(ingredient => {
        const isSelected = selectedIngredients.includes(ingredient.name)
        const effectComparisons = getEffectComparisons?.(ingredient) || []

        return (
          <IngredientCard
            key={ingredient.edid}
            ingredient={ingredient}
            variant={variant}
            onClick={() => handleIngredientClick(ingredient)}
            isSelected={isSelected}
            showEffects={showEffects}
            showProperties={showProperties}
            effectComparisons={effectComparisons}
          />
        )
      })}
    </div>
  )
}
