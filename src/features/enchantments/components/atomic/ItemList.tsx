import React from 'react'
import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'
import { EnchantmentBadge } from './EnchantmentBadge'
import type { FoundItem } from '../../types'

interface ItemListProps {
  items: FoundItem[]
  title?: string
  className?: string
  maxItems?: number
  showType?: boolean
  compact?: boolean
}

const itemTypeIcons = {
  weapon: '🗡️',
  armor: '🛡️'
}

export const ItemList = React.memo<ItemListProps>(({
  items,
  title = 'Found Items',
  className,
  maxItems = 5,
  showType = true,
  compact = false
}) => {
  if (items.length === 0) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        No items found
      </div>
    )
  }
  
  const displayItems = items.slice(0, maxItems)
  const hasMore = items.length > maxItems
  
  return (
    <div className={cn('space-y-2', className)}>
      {title && (
        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Package className="h-4 w-4" />
          {title}
          <span className="text-xs text-muted-foreground/70">
            ({items.length})
          </span>
        </h4>
      )}
      
      <div className={cn('space-y-1')}>
        {displayItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={cn(
              'flex items-center gap-2 p-2 rounded bg-muted border',
              compact ? 'text-xs' : 'text-sm'
            )}
          >
            <span className="text-muted-foreground">
              {itemTypeIcons[item.type]}
            </span>
            <span className="font-medium text-foreground flex-1">
              {item.name}
            </span>
            {showType && (
              <EnchantmentBadge
                type="itemType"
                value={item.type}
                size="sm"
                variant="outline"
              />
            )}
          </div>
        ))}
        
        {hasMore && (
          <div className="text-sm text-muted-foreground italic">
            +{items.length - maxItems} more items
          </div>
        )}
      </div>
    </div>
  )
})
