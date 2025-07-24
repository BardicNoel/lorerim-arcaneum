import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { ChevronRight } from 'lucide-react'
import { DestinyNodePill } from './DestinyNodePill'
import type { DestinyNode } from '../../types'

interface DestinyBreadcrumbTrailProps {
  path: DestinyNode[]
  allNodes: DestinyNode[]
  onBreadcrumbClick?: (index: number) => void
  variant?: 'default' | 'compact'
  className?: string
}

export function DestinyBreadcrumbTrail({
  path,
  allNodes,
  onBreadcrumbClick,
  variant = 'default',
  className = '',
}: DestinyBreadcrumbTrailProps) {
  if (path.length === 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground">
          No destiny path selected
        </span>
      </div>
    )
  }

  const size = variant === 'compact' ? 'sm' : 'md'

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {path.map((node, index) => (
        <React.Fragment key={node.id}>
          <DestinyNodePill
            node={node}
            allNodes={allNodes}
            variant={index === path.length - 1 ? 'default' : 'outline'}
            size={size}
            showHoverCard={true}
            onClick={
              onBreadcrumbClick ? () => onBreadcrumbClick(index) : undefined
            }
          />
          {index < path.length - 1 && (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
