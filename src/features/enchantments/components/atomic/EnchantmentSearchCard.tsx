import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter } from '@/shared/ui/ui/card'
import { EnchantmentBadge } from './EnchantmentBadge'
import { EffectsList } from './EffectDisplay'
import { ItemList } from './ItemList'
import type { EnchantmentWithComputed } from '../../types'

interface EnchantmentSearchCardProps {
  enchantment: EnchantmentWithComputed
  onClick?: () => void
  className?: string
  selected?: boolean
  searchTerm?: string
}

export const EnchantmentSearchCard = React.memo<EnchantmentSearchCardProps>(({
  enchantment,
  onClick,
  className,
  selected = false,
  searchTerm
}) => {
  // Highlight search term in text
  const highlightText = (text: string, term?: string) => {
    if (!term) return text
    
    const regex = new RegExp(`(${term})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }
  
  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/50',
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
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {highlightText(enchantment.name, searchTerm)}
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            <EnchantmentBadge
              type="targetType"
              value={enchantment.targetType}
            />
            <EnchantmentBadge
              type="category"
              value={enchantment.category}
              variant="outline"
            />
          </div>
        </div>
        
        {/* Effects */}
        {enchantment.hasEffects && (
          <div className="mb-4">
            <EffectsList
              effects={enchantment.effects}
              title={`Effects (${enchantment.effectCount})`}
              showDescriptions={true}
              maxDisplay={3}
            />
          </div>
        )}
        

        
        {/* Worn Restrictions */}
        {enchantment.wornRestrictions.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Worn Restrictions
            </div>
            <div className="flex flex-wrap gap-1">
              {enchantment.wornRestrictions.map((restriction, index) => (
                <span
                  key={index}
                  className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                >
                  {restriction}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Footer */}
      <CardFooter className="p-6 pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground w-full">
          <span className="truncate">{enchantment.plugin}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span>{enchantment.itemCount} items</span>
            <span>•</span>
            <span>{enchantment.effectCount} effects</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
})
