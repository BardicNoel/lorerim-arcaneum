import React from 'react'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'

interface BlessingCardProps {
  item: PlayerCreationItem
  isSelected: boolean
}

export function BlessingCard({ item, isSelected }: BlessingCardProps) {
  const getPantheonIcon = (pantheon: string) => {
    switch (pantheon.toLowerCase()) {
      case 'divine':
        return '🕊️'
      case 'daedric':
        return '🔥'
      case 'yokudan':
        return '⚔️'
      case 'custom':
        return '✨'
      default:
        return '🏛️'
    }
  }

  const getPantheonColor = (pantheon: string) => {
    switch (pantheon.toLowerCase()) {
      case 'divine':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'daedric':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'yokudan':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'custom':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' 
          : 'hover:bg-muted/50'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {getPantheonIcon(item.category || 'Unknown')}
            </span>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
              <Badge 
                variant="outline" 
                className={`text-xs ${getPantheonColor(item.category || 'Unknown')}`}
              >
                {item.category || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <Badge variant="secondary" className="text-xs mb-2">
            ✨ Shrine Blessing
          </Badge>
          {item.effects && item.effects.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {item.effects[0]?.name || 'Blessing'}
              </p>
              {item.effects[0]?.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.effects[0].description}
                </p>
              )}
              {item.effects[0]?.value && (
                <p className="text-xs text-primary font-medium">
                  {item.effects[0].value} {item.effects[0].target || 'points'}
                </p>
              )}
            </div>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{item.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 