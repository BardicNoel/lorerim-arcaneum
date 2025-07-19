import React from 'react'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { MarkdownText } from '@/shared/components/MarkdownText'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'

interface TraitCardProps {
  item: PlayerCreationItem
  isSelected: boolean
}

export function TraitCard({ item, isSelected }: TraitCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'magic':
        return '✨'
      case 'combat':
        return '⚔️'
      case 'stealth':
        return '👤'
      case 'crafting':
        return '🔨'
      case 'survival':
        return '🌿'
      default:
        return '🎯'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'magic':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'combat':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'stealth':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'crafting':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'survival':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? 'ring-2 ring-primary ring-offset-2 bg-primary/5'
          : 'hover:bg-muted/50'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {getCategoryIcon(item.category || '')}
            </span>
            <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
          </div>
          {item.category && (
            <Badge
              variant="secondary"
              className={`text-xs ${getCategoryColor(item.category)}`}
            >
              {item.category}
            </Badge>
          )}
        </div>

        <div className="mb-3 line-clamp-3">
          <MarkdownText className="text-sm text-muted-foreground">
            {item.description}
          </MarkdownText>
        </div>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
