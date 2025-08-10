import { cn } from '@/lib/utils'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { ExternalLink, Info } from 'lucide-react'
import React from 'react'

export interface EntityDetail {
  id: string
  name: string
  description?: string
  category?: string
  tags?: string[]
  stats?: Array<{
    label: string
    value: string | number
    unit?: string
  }>
  effects?: Array<{
    name: string
    description: string
    type?: 'positive' | 'negative' | 'neutral'
  }>
  abilities?: Array<{
    name: string
    description: string
    cost?: string
  }>
  [key: string]: any // Allow additional properties
}

export interface EntityDisplayCardProps {
  title: string
  entity: EntityDetail | null
  onNavigateToPage?: () => void
  className?: string
  renderAvatar?: (entity: EntityDetail) => React.ReactNode
  renderStats?: (entity: EntityDetail) => React.ReactNode
  renderEffects?: (entity: EntityDetail) => React.ReactNode
  renderAbilities?: (entity: EntityDetail) => React.ReactNode
  placeholder?: string
}

export function EntityDisplayCard({
  title,
  entity,
  onNavigateToPage,
  className,
  renderAvatar,
  renderStats,
  renderEffects,
  renderAbilities,
  placeholder = 'No selection',
}: EntityDisplayCardProps) {
  if (!entity) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            {onNavigateToPage && (
              <Button
                variant="outline"
                size="sm"
                onClick={onNavigateToPage}
                className="text-xs"
              >
                Browse
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{placeholder}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const defaultRenderStats = (entity: EntityDetail) => {
    if (!entity.stats || entity.stats.length === 0) return null

    return (
      <div className="grid grid-cols-2 gap-4">
        {entity.stats.map((stat, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="text-sm font-medium">
              {stat.value}
              {stat.unit && (
                <span className="text-muted-foreground ml-1">{stat.unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const defaultRenderEffects = (entity: EntityDetail) => {
    if (!entity.effects || entity.effects.length === 0) return null

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Effects</h4>
        <div className="space-y-2">
          {entity.effects.map((effect, index) => (
            <div
              key={index}
              className={cn(
                'p-2 rounded text-sm',
                effect.type === 'positive' &&
                  'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800',
                effect.type === 'negative' &&
                  'bg-red-50 border border-red-200 dark:bg-red-950 dark:border-red-800',
                effect.type === 'neutral' &&
                  'bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800',
                !effect.type && 'bg-muted border'
              )}
            >
              <div className="font-medium">{effect.name}</div>
              <div className="text-muted-foreground">{effect.description}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const defaultRenderAbilities = (entity: EntityDetail) => {
    if (!entity.abilities || entity.abilities.length === 0) return null

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Abilities</h4>
        <div className="space-y-2">
          {entity.abilities.map((ability, index) => (
            <div key={index} className="p-2 rounded bg-muted border text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{ability.name}</span>
                {ability.cost && (
                  <Badge variant="secondary" className="text-xs">
                    {ability.cost}
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground mt-1">
                {ability.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {onNavigateToPage && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToPage}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Details
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Entity Header */}
        <div className="flex items-start gap-3">
          {renderAvatar && renderAvatar(entity)}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{entity.name}</h3>
            {entity.category && (
              <Badge variant="secondary" className="mt-1">
                {entity.category}
              </Badge>
            )}
            {entity.description && (
              <FormattedText
                text={entity.description}
                className="text-sm text-muted-foreground mt-2"
                as="p"
              />
            )}
          </div>
        </div>

        {/* Tags */}
        {entity.tags && entity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {entity.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Stats */}
        {renderStats ? renderStats(entity) : defaultRenderStats(entity)}

        {/* Effects */}
        {renderEffects ? renderEffects(entity) : defaultRenderEffects(entity)}

        {/* Abilities */}
        {renderAbilities
          ? renderAbilities(entity)
          : defaultRenderAbilities(entity)}
      </CardContent>
    </Card>
  )
}
