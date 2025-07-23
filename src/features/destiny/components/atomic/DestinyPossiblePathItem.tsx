import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { ChevronRight } from 'lucide-react'
import { DestinyNodePill } from './DestinyNodePill'
import type { DestinyNode } from '../../types'

interface DestinyPossiblePathItemProps {
  path: DestinyNode[]
  allNodes: DestinyNode[]
  selectedPathLength: number
  isComplete: boolean
  endNode: DestinyNode
  onPathClick: (path: DestinyNode[], clickedIndex: number) => void
  variant?: 'default' | 'compact'
  className?: string
}

export function DestinyPossiblePathItem({
  path,
  allNodes,
  selectedPathLength,
  isComplete,
  endNode,
  onPathClick,
  variant = 'default',
  className = '',
}: DestinyPossiblePathItemProps) {
  const size = variant === 'compact' ? 'sm' : 'md'

  return (
    <div
      className={`p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${className}`}
      onClick={() => onPathClick(path, selectedPathLength)}
    >
      {/* Path Breadcrumb */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-1">
          {path.map((node, nodeIndex) => (
            <React.Fragment key={node.id}>
                                            <DestinyNodePill
                 node={node}
                 allNodes={allNodes}
                 variant="outline"
                 size={size}
                 showHoverCard={true}
                 onClick={(e?: React.MouseEvent) => {
                   e?.stopPropagation()
                   onPathClick(path, nodeIndex)
                 }}
                 className={`
                   ${nodeIndex === 0 && selectedPathLength === 0 ? 'cursor-pointer' : ''}
                   ${isComplete && nodeIndex === path.length - 1 ? 'bg-yellow-600 text-yellow-50 border-yellow-700' : ''}
                 `}
               />
              {nodeIndex < path.length - 1 && (
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Path Summary */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Length: {path.length} steps</span>
        {isComplete && (
          <span>• Ends at: {endNode.name}</span>
        )}
        {path.length > selectedPathLength && (
          <span>
            • {path.length - selectedPathLength} more choices
          </span>
        )}
      </div>
    </div>
  )
} 