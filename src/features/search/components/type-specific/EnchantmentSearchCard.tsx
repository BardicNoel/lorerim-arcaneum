import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { EnchantmentBadge } from '@/features/enchantments/components/atomic/EnchantmentBadge'
import { EffectsList } from '@/features/enchantments/components/atomic/EffectDisplay'
import { ItemList } from '@/features/enchantments/components/atomic/ItemList'
import { highlightText } from '../../utils/searchUtils'
import type { SearchableItem } from '../../model/SearchModel'
import type { EnchantmentWithComputed } from '@/features/enchantments/types'
import { cn } from '@/lib/utils'

interface EnchantmentSearchCardProps {
  item: SearchableItem
  searchTerm?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'list' | 'grid'
  className?: string
}

export function EnchantmentSearchCard({
  item,
  searchTerm = '',
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
  className,
}: EnchantmentSearchCardProps) {
  const enchantment = item.originalData as EnchantmentWithComputed
  
  const highlightedName = searchTerm 
    ? highlightText(enchantment.name, searchTerm)
    : enchantment.name
    
  const highlightedDescription = enchantment.effects.length > 0 
    ? (searchTerm 
        ? highlightText(enchantment.effects.map(e => e.name).join(', '), searchTerm)
        : enchantment.effects.map(e => e.name).join(', '))
    : undefined

  const handleClick = () => {
    // Navigate to enchantments page and open detail sheet
    window.location.href = `/enchantments?selected=${enchantment.baseEnchantmentId}`
  }

  if (viewMode === 'list') {
    return (
      <Card 
        className={cn(
          'cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500',
          className
        )}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-lg">🔮</div>
                <h4 
                  className="font-medium text-sm truncate"
                  dangerouslySetInnerHTML={{ __html: highlightedName }}
                />
                <EnchantmentBadge type="targetType" value={enchantment.targetType} size="sm" />
                <Badge variant="outline" className="text-xs">
                  {enchantment.effectCount} effects
                </Badge>
              </div>
              
              {highlightedDescription && (
                <p 
                  className="text-xs text-muted-foreground mb-2"
                  dangerouslySetInnerHTML={{ __html: highlightedDescription }}
                />
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{enchantment.category}</span>
                <span>•</span>
                <span>{enchantment.plugin}</span>
                <span>•</span>
                <span>{enchantment.itemCount} items</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation()
                onToggle?.()
              }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {isExpanded && (
            <div className="mt-4 space-y-3 pt-4 border-t">
              {/* Effects Preview */}
              {enchantment.effects.length > 0 && (
                <EffectsList
                  effects={enchantment.effects}
                  title="Effects"
                  compact={true}
                  showDescriptions={false}
                  maxDisplay={3}
                />
              )}
              
              {/* Items Preview */}
              <ItemList
                items={enchantment.foundOnItems}
                title="Found on"
                compact={true}
                showType={true}
                maxItems={3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Grid view (default)
  return (
    <Card 
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle 
              className="text-lg"
              dangerouslySetInnerHTML={{ __html: highlightedName }}
            />
            {highlightedDescription && (
              <p 
                className="text-sm text-muted-foreground mt-1"
                dangerouslySetInnerHTML={{ __html: highlightedDescription }}
              />
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <EnchantmentBadge type="targetType" value={enchantment.targetType} />
            <Badge variant="outline" className="text-xs">
              {enchantment.effectCount} effects
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Effects Preview */}
          {enchantment.effects.length > 0 && (
            <EffectsList
              effects={enchantment.effects}
              title="Effects"
              compact={true}
              showDescriptions={false}
              maxDisplay={2}
            />
          )}
          
          {/* Items Preview */}
          <ItemList
            items={enchantment.foundOnItems}
            title="Found on"
            compact={true}
            showType={true}
            maxItems={3}
          />
          
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{enchantment.category}</span>
            <span>•</span>
            <span>{enchantment.plugin}</span>
            <span>•</span>
            <span>{enchantment.itemCount} items</span>
          </div>
          
          {/* Expand/Collapse Button */}
          {onToggle && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show More
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

