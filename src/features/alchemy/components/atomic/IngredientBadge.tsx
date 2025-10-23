import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { FlaskConical } from 'lucide-react'
import type { AlchemyIngredientWithComputed } from '../../types'

interface IngredientBadgeProps {
  ingredient: AlchemyIngredientWithComputed
  variant?: 'default' | 'compact' | 'minimal'
  showIcon?: boolean
  showRarity?: boolean
  showEffectCount?: boolean
  className?: string
}

export function IngredientBadge({
  ingredient,
  variant = 'default',
  showIcon = true,
  showRarity = true,
  showEffectCount = true,
  className,
}: IngredientBadgeProps) {
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

  // Helper function to get rarity background color
  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'Common':
        return 'bg-gray-100 text-gray-800'
      case 'Uncommon':
        return 'bg-green-100 text-green-800'
      case 'Rare':
        return 'bg-blue-100 text-blue-800'
      case 'Epic':
        return 'bg-purple-100 text-purple-800'
      case 'Legendary':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderMinimal = () => (
    <Badge
      variant="outline"
      className={cn('text-xs', getRarityColor(ingredient.rarity), className)}
    >
      {showIcon && <FlaskConical className="h-3 w-3 mr-1" />}
      {ingredient.name}
    </Badge>
  )

  const renderCompact = () => (
    <Badge
      variant="secondary"
      className={cn('text-xs', getRarityBgColor(ingredient.rarity), className)}
    >
      {showIcon && <FlaskConical className="h-3 w-3 mr-1" />}
      <span className="truncate max-w-24">{ingredient.name}</span>
      {showEffectCount && ingredient.effectCount > 0 && (
        <span className="ml-1 text-xs opacity-75">
          ({ingredient.effectCount})
        </span>
      )}
    </Badge>
  )

  const renderDefault = () => (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge
        variant="secondary"
        className={cn('text-xs', getRarityBgColor(ingredient.rarity))}
      >
        {showIcon && <FlaskConical className="h-3 w-3 mr-1" />}
        {ingredient.name}
      </Badge>

      {showRarity && (
        <Badge
          variant="outline"
          className={cn('text-xs', getRarityColor(ingredient.rarity))}
        >
          {ingredient.rarity}
        </Badge>
      )}

      {showEffectCount && ingredient.effectCount > 0 && (
        <Badge variant="outline" className="text-xs">
          {ingredient.effectCount} effects
        </Badge>
      )}
    </div>
  )

  switch (variant) {
    case 'minimal':
      return renderMinimal()
    case 'compact':
      return renderCompact()
    default:
      return renderDefault()
  }
}
