import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { ChevronRight, MapPin } from 'lucide-react'
import { DestinyNodePill } from './DestinyNodePill'
import type { DestinyNode } from '../../types'

interface DestinyPathListItemProps {
  path: DestinyNode[]
  allNodes: DestinyNode[]
  isSelected?: boolean
  onClick?: () => void
  variant?: 'default' | 'compact'
  showPathLength?: boolean
  className?: string
}

export function DestinyPathListItem({
  path,
  allNodes,
  isSelected = false,
  onClick,
  variant = 'default',
  showPathLength = true,
  className = '',
}: DestinyPathListItemProps) {
  const baseClasses = `cursor-pointer transition-all duration-200 ${
    isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
  }`

  if (path.length === 0) {
    return (
      <div className={`p-4 text-center text-muted-foreground ${className}`}>
        No path selected
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-2 p-3 rounded-lg border ${baseClasses} ${className}`}
        onClick={onClick}
      >
        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-sm">
            {path.map((node, index) => (
              <React.Fragment key={node.id}>
                <DestinyNodePill
                  node={node}
                  allNodes={allNodes}
                  variant="outline"
                  size="sm"
                  showHoverCard={true}
                />
                {index < path.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {showPathLength && (
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {path.length} nodes
          </Badge>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div
      className={`p-4 rounded-lg border ${baseClasses} ${className}`}
      onClick={onClick}
    >
      {/* Path Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">Destiny Path</span>
        </div>
        {showPathLength && (
          <Badge variant="outline" className="text-xs">
            {path.length} nodes
          </Badge>
        )}
      </div>

      {/* Path Breadcrumb */}
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {path.map((node, index) => (
          <React.Fragment key={node.id}>
            <DestinyNodePill
              node={node}
              allNodes={allNodes}
              variant={index === path.length - 1 ? 'default' : 'secondary'}
              size="sm"
              showHoverCard={true}
            />
            {index < path.length - 1 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Path Summary */}
      <div className="text-sm text-muted-foreground">
        <p className="mb-2">
          <span className="font-medium">Start:</span> {path[0]?.name}
        </p>
        <p>
          <span className="font-medium">End:</span> {path[path.length - 1]?.name}
        </p>
      </div>
    </div>
  )
} 