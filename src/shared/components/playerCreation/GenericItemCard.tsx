import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P, Small } from '@/shared/ui/ui/typography'
import type { PlayerCreationItem } from './types'

interface GenericItemCardProps {
  item: PlayerCreationItem
  isSelected?: boolean
  className?: string
}

export function GenericItemCard({
  item,
  isSelected = false,
  className,
}: GenericItemCardProps) {
  return (
    <Card
      className={`bg-card border rounded-lg shadow-sm p-4 hover:shadow-md transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${className}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-muted-foreground">
                  {item.name.charAt(0)}
                </span>
              </div>
              <div>
                <H3 className="text-primary font-semibold mb-1">{item.name}</H3>
                {item.category && (
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <P className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {item.summary || item.description}
        </P>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 2 && (
              <Small className="text-muted-foreground">
                +{item.tags.length - 2} more
              </Small>
            )}
          </div>

          {item.effects && item.effects.length > 0 && (
            <div className="flex items-center gap-1">
              {item.effects.slice(0, 2).map((effect, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    effect.type === 'positive'
                      ? 'bg-green-500'
                      : effect.type === 'negative'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                  }`}
                  title={`${effect.type}: ${effect.name}`}
                />
              ))}
              {item.effects.length > 2 && (
                <Small className="text-muted-foreground">
                  +{item.effects.length - 2}
                </Small>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
