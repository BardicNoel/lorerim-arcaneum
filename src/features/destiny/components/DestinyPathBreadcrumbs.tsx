import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { ChevronRight } from 'lucide-react'
import { DestinyNodeHoverCard } from './DestinyNodeHoverCard'
import type { DestinyNode } from '../types'

interface DestinyPathBreadcrumbsProps {
  path: DestinyNode[]
  selectedPathLength: number
  isPlanned: (nodeId: string) => boolean
  onBreadcrumbClick: (index: number) => void
  showChevrons?: boolean
  badgeClassName?: string
}

export function DestinyPathBreadcrumbs({
  path,
  selectedPathLength,
  isPlanned,
  onBreadcrumbClick,
  showChevrons = true,
  badgeClassName = '',
}: DestinyPathBreadcrumbsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {path.map((node, index) => (
        <React.Fragment key={node.id}>
          <div className="flex items-center gap-2">
            <DestinyNodeHoverCard node={node} isPlanned={isPlanned(node.id)}>
              <Badge
                variant={
                  index === selectedPathLength - 1 ? 'default' : 'secondary'
                }
                className={`cursor-pointer hover:bg-primary/80 ${badgeClassName}`}
                onClick={() => onBreadcrumbClick(index)}
              >
                {node.name}
              </Badge>
            </DestinyNodeHoverCard>
            {showChevrons && index < path.length - 1 && (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
