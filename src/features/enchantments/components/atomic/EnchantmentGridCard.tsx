import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter } from '@/shared/ui/ui/card'
import { EnchantmentBadge } from './EnchantmentBadge'
import { EffectsList } from './EffectDisplay'
import { ItemList } from './ItemList'
import type { EnchantmentWithComputed } from '../../types'

interface EnchantmentGridCardProps {
  enchantment: EnchantmentWithComputed
  onClick?: () => void
  className?: string
  selected?: boolean
}

export const EnchantmentGridCard = React.memo<EnchantmentGridCardProps>(({
  enchantment,
  onClick,
  className,
  selected = false
}) => {
  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50',
        selected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {enchantment.name}
          </h3>
          <div className="flex gap-1 flex-shrink-0">
            <EnchantmentBadge
              type="targetType"
              value={enchantment.targetType}
              size="sm"
            />
          </div>
        </div>
        
        {/* Category */}
        <div className="mb-3">
          <EnchantmentBadge
            type="category"
            value={enchantment.category}
            size="sm"
            variant="outline"
          />
        </div>
        
        {/* Effects Preview */}
        {enchantment.hasEffects && (
          <div className="mb-3">
            <EffectsList
              effects={enchantment.effects}
              title={`Effects (${enchantment.effectCount})`}
              compact={true}
              showDescriptions={false}
              maxDisplay={2}
            />
          </div>
        )}
        
        {/* Items Preview */}
        <div className="mb-3">
          <ItemList
            items={enchantment.foundOnItems}
            title={`Found on ${enchantment.itemCount} items`}
            maxItems={3}
            compact={true}
            showType={false}
          />
        </div>
      </CardContent>
      
      {/* Footer */}
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
          <span className="truncate">{enchantment.plugin}</span>
          <span className="flex-shrink-0">{enchantment.itemCount} items</span>
        </div>
      </CardFooter>
    </Card>
  )
})
