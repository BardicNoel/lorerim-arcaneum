import { cn } from '@/lib/utils'
import type {
  AlchemyIngredientWithComputed,
  EffectComparison,
} from '../../types'
import { IngredientCard } from '../atomic/IngredientCard'

interface IngredientGridProps {
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
  className?: string
}

export function IngredientGrid({
  ingredients,
  variant = 'default',
  columns = 3,
  onIngredientClick,
  selectedIngredients = [],
  showEffects = true,
  showProperties = true,
  getEffectComparisons,
  className,
}: IngredientGridProps) {
  console.log(
    'IngredientGrid: Received ingredients:',
    ingredients?.length || 0,
    'items'
  )
  const handleIngredientClick = (ingredient: AlchemyIngredientWithComputed) => {
    onIngredientClick?.(ingredient)
  }

  const getGridCols = (cols: number) => {
    switch (cols) {
      case 1:
        return 'grid-cols-1'
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 5:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
      case 6:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">No ingredients found</div>
          <div className="text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4', getGridCols(columns), className)}>
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
