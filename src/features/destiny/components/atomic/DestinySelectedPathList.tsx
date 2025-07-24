import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import type { DestinyNode } from '../../types'

interface DestinySelectedPathListProps {
  path: DestinyNode[]
  className?: string
}

export function DestinySelectedPathList({
  path,
  className = '',
}: DestinySelectedPathListProps) {
  if (path.length === 0) {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="text-sm font-medium text-muted-foreground">
          Selected Path
        </h4>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <span className="text-sm text-muted-foreground">
            No destiny path selected
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-muted-foreground">
        Selected Path ({path.length} nodes)
      </h4>
      <div className="space-y-2">
        {path.map((node, index) => (
          <div
            key={node.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium">
                {index + 1}
              </div>
              <div>
                <span className="font-medium text-sm">{node.name}</span>
                {node.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {node.description}
                  </p>
                )}
              </div>
            </div>
            <Badge
              variant="secondary"
              className={
                index === path.length - 1
                  ? 'bg-yellow-600 text-yellow-50'
                  : 'bg-blue-500'
              }
            >
              {index === path.length - 1 ? 'Current' : 'Selected'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
