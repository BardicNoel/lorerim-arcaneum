import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import type { DestinyNode } from '../types'

interface DestinyPathListProps {
  path: DestinyNode[]
}

export function DestinyPathList({ path }: DestinyPathListProps) {
  return (
    <div className="space-y-2">
      {path.map((node, index) => (
        <div key={node.id} className="flex items-center p-2 border rounded">
          <div className="flex-1 min-w-0">
            <div className="font-medium flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Step {index + 1}
              </Badge>
              {node.name}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {node.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
