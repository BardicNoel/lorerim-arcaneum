import React from 'react'
import { Card, CardContent, CardHeader } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { H3, H4, P, Small } from '@/shared/ui/ui/typography'
import { MarkdownText } from '@/shared/components/MarkdownText'
import { X, Plus, Minus, Circle } from 'lucide-react'
import type { PlayerCreationItem } from './types'

interface DetailPanelProps {
  item: PlayerCreationItem
  onClose?: () => void
  className?: string
}

export function DetailPanel({ item, onClose, className }: DetailPanelProps) {
  const getEffectIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'negative':
        return <Minus className="h-4 w-4 text-red-500" />
      case 'neutral':
        return <Circle className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <H3 className="text-primary font-semibold mb-2">{item.name}</H3>
            {item.category && (
              <Badge variant="secondary" className="mb-3">
                {item.category}
              </Badge>
            )}
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <H4 className="mb-2">Description</H4>
          <MarkdownText className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </MarkdownText>
        </div>

        {/* Effects */}
        {item.effects && item.effects.length > 0 && (
          <div>
            <H4 className="mb-3">Effects</H4>
            <div className="space-y-2">
              {item.effects.map((effect, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  {getEffectIcon(effect.type)}
                  <div className="flex-1">
                    <P className="font-medium text-sm">{effect.name}</P>
                    <P className="text-xs text-muted-foreground mt-1">
                      {effect.description}
                    </P>
                    {effect.value && (
                      <Small className="text-xs text-muted-foreground">
                        Value: {effect.value}
                      </Small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Associated Items */}
        {item.associatedItems && item.associatedItems.length > 0 && (
          <div>
            <H4 className="mb-3">Associated Items</H4>
            <div className="grid grid-cols-2 gap-2">
              {item.associatedItems.map((associatedItem) => (
                <div
                  key={associatedItem.id}
                  className="p-2 bg-muted/30 rounded border border-border hover:bg-muted/50 transition-colors"
                  title={associatedItem.description}
                >
                  <div className="flex items-center gap-2">
                    {associatedItem.icon && (
                      <span className="text-lg">{associatedItem.icon}</span>
                    )}
                    <div>
                      <P className="text-sm font-medium">{associatedItem.name}</P>
                      <Small className="text-xs text-muted-foreground">
                        {associatedItem.type}
                      </Small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div>
            <H4 className="mb-2">Tags</H4>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 