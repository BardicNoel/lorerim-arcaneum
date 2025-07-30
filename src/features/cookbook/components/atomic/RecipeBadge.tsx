import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'

interface RecipeBadgeProps {
  children: React.ReactNode
  variant?: 'category' | 'difficulty' | 'effect' | 'ingredient' | 'type'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  isSelected?: boolean
  className?: string
}

export function RecipeBadge({
  children,
  variant = 'category',
  size = 'md',
  onClick,
  isSelected = false,
  className,
}: RecipeBadgeProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'category':
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        }
      case 'difficulty':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
        }
      case 'effect':
        return {
          variant: 'outline' as const,
          className: 'border-purple-200 text-purple-700 hover:bg-purple-50',
        }
      case 'ingredient':
        return {
          variant: 'outline' as const,
          className: 'border-orange-200 text-orange-700 hover:bg-orange-50',
        }
      case 'type':
        return {
          variant: 'outline' as const,
          className: 'border-gray-200 text-gray-700 hover:bg-gray-50',
        }
      default:
        return {
          variant: 'secondary' as const,
          className: '',
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5'
      case 'lg':
        return 'text-sm px-3 py-1'
      default:
        return 'text-xs px-2 py-1'
    }
  }

  const variantProps = getVariantProps()
  const sizeClasses = getSizeClasses()

  return (
    <Badge
      variant={variantProps.variant}
      className={cn(
        variantProps.className,
        sizeClasses,
        onClick && 'cursor-pointer transition-colors',
        isSelected && 'ring-2 ring-primary ring-offset-1',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Badge>
  )
}

// Specialized badge components for common use cases
export function CategoryBadge({ children, ...props }: Omit<RecipeBadgeProps, 'variant'>) {
  return <RecipeBadge variant="category" {...props}>{children}</RecipeBadge>
}

export function DifficultyBadge({ 
  difficulty, 
  ...props 
}: Omit<RecipeBadgeProps, 'variant' | 'children'> & { difficulty: string }) {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'simple':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      case 'complex':
        return 'bg-red-100 text-red-800 hover:bg-red-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  return (
    <Badge
      variant="default"
      className={cn(
        getDifficultyColor(difficulty),
        'text-xs px-2 py-1',
        props.onClick && 'cursor-pointer transition-colors',
        props.isSelected && 'ring-2 ring-primary ring-offset-1',
        props.className
      )}
      onClick={props.onClick}
    >
      {difficulty}
    </Badge>
  )
}

export function EffectBadge({ 
  effect, 
  magnitude, 
  ...props 
}: Omit<RecipeBadgeProps, 'variant' | 'children'> & { 
  effect: string
  magnitude?: number 
}) {
  return (
    <RecipeBadge variant="effect" {...props}>
      {effect}
      {magnitude !== undefined && ` (${magnitude})`}
    </RecipeBadge>
  )
}

export function IngredientBadge({ ingredient, ...props }: Omit<RecipeBadgeProps, 'variant' | 'children'> & { ingredient: string }) {
  return <RecipeBadge variant="ingredient" {...props}>{ingredient}</RecipeBadge>
}

export function TypeBadge({ type, ...props }: Omit<RecipeBadgeProps, 'variant' | 'children'> & { type: string }) {
  return <RecipeBadge variant="type" {...props}>{type}</RecipeBadge>
} 