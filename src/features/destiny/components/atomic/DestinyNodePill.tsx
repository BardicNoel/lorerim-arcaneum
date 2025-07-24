import React from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { DestinyNodeHoverCard } from './DestinyNodeHoverCard'
import type { DestinyNode } from '../../types'

interface DestinyNodePillProps {
  node: DestinyNode
  allNodes: DestinyNode[]
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  showHoverCard?: boolean
  onClick?: (e?: React.MouseEvent) => void
  className?: string
}

export function DestinyNodePill({
  node,
  allNodes,
  variant = 'default',
  size = 'md',
  showHoverCard = true,
  onClick,
  className = '',
}: DestinyNodePillProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  const pillContent = (
    <Badge
      variant={variant}
      className={`
        ${sizeClasses[size]} 
        ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''} 
        ${className}
        rounded-full
      `}
      onClick={onClick}
    >
      {node.name}
    </Badge>
  )

  if (showHoverCard) {
    return (
      <DestinyNodeHoverCard node={node} allNodes={allNodes}>
        {pillContent}
      </DestinyNodeHoverCard>
    )
  }

  return pillContent
}
