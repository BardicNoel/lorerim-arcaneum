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
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
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
        
        {/* Effects Preview */}
        {enchantment.hasEffects && (
          <div className="mb-3">
            <EffectsList
              effects={enchantment.effects}
              title="Effects"
              compact={true}
              showDescriptions={true}
              maxDisplay={2}
            />
          </div>
        )}
        

      </CardContent>
      

    </Card>
  )
})
