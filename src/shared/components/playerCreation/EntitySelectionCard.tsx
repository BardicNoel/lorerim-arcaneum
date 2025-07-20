import { cn } from '@/lib/utils'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { ChevronDown, Plus, X } from 'lucide-react'
import React from 'react'

export interface EntityOption {
  id: string
  name: string
  description?: string
  category?: string
  tags?: string[]
}

export interface EntitySelectionCardProps {
  title: string
  description?: string
  selectedEntities: EntityOption[]
  availableEntities: EntityOption[]
  onEntitySelect: (entityId: string) => void
  onEntityRemove: (entityId: string) => void
  onNavigateToPage?: () => void
  selectionType: 'single' | 'multi'
  maxSelections?: number
  placeholder?: string
  className?: string
  renderEntityDisplay?: (entity: EntityOption) => React.ReactNode
}

export function EntitySelectionCard({
  title,
  description,
  selectedEntities,
  availableEntities,
  onEntitySelect,
  onEntityRemove,
  onNavigateToPage,
  selectionType,
  maxSelections,
  placeholder = 'Select...',
  className,
  renderEntityDisplay,
}: EntitySelectionCardProps) {
  const canAddMore = !maxSelections || selectedEntities.length < maxSelections
  const availableOptions = availableEntities.filter(
    entity => !selectedEntities.find(selected => selected.id === entity.id)
  )

  const handleEntitySelect = (entityId: string) => {
    if (selectionType === 'single') {
      // For single selection, replace current selection
      if (selectedEntities.length > 0) {
        onEntityRemove(selectedEntities[0].id)
      }
    }
    onEntitySelect(entityId)
  }

  const defaultRenderEntity = (entity: EntityOption) => (
    <div className="flex items-center gap-2">
      <span className="font-medium">{entity.name}</span>
      {entity.category && (
        <Badge variant="secondary" className="text-xs">
          {entity.category}
        </Badge>
      )}
    </div>
  )

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          {onNavigateToPage && (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToPage}
              className="text-xs"
            >
              View All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Selected Entities Display */}
        {selectedEntities.length > 0 ? (
          <div className="space-y-2">
            {selectedEntities.map(entity => (
              <div
                key={entity.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
              >
                <div className="flex-1">
                  {renderEntityDisplay
                    ? renderEntityDisplay(entity)
                    : defaultRenderEntity(entity)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEntityRemove(entity.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">{placeholder}</p>
          </div>
        )}

        {/* Selection Dropdown */}
        {canAddMore && availableOptions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between"
                disabled={!canAddMore}
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {selectionType === 'single' ? 'Select' : 'Add'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
              {availableOptions.map(entity => (
                <DropdownMenuItem
                  key={entity.id}
                  onClick={() => handleEntitySelect(entity.id)}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{entity.name}</span>
                    {entity.description && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {entity.description}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Selection Limits Info */}
        {maxSelections && (
          <div className="text-xs text-muted-foreground text-center">
            {selectedEntities.length} / {maxSelections} selected
          </div>
        )}
      </CardContent>
    </Card>
  )
}
