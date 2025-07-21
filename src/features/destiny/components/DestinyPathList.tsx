import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import type { DestinyNode } from '../types'

interface DestinyPathListProps {
  path: DestinyNode[]
}

export function DestinyPerkList({
  path,
  renderNode,
  onNodeClick,
}: {
  path: DestinyNode[]
  renderNode?: (node: DestinyNode, index: number) => React.ReactNode
  onNodeClick?: (node: DestinyNode, index: number) => void
}) {
  return (
    <div className="space-y-2">
      {path.map((node, index) =>
        renderNode ? (
          renderNode(node, index)
        ) : (
          <div
            key={node.id}
            className={`flex items-center p-2 border rounded ${onNodeClick ? 'cursor-pointer' : ''}`}
            onClick={onNodeClick ? () => onNodeClick(node, index) : undefined}
          >
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
        )
      )}
    </div>
  )
}

// Backward compatibility
export const DestinyPathList = DestinyPerkList;
