import { Badge } from '@/shared/ui/ui/badge'
import type { DestinyNode } from '../../types'

interface DestinyNodeProps {
  node: DestinyNode
  variant?: 'default' | 'compact' | 'detailed'
  showTags?: boolean
  showPrerequisites?: boolean
  showNextNodes?: boolean
  allNodes?: DestinyNode[] // Only needed if showNextNodes is true
  className?: string
}

export function DestinyNode({
  node,
  variant = 'default',
  showTags = true,
  showPrerequisites = false,
  showNextNodes = false,
  allNodes = [],
  className = '',
}: DestinyNodeProps) {
  // Helper to get next nodes (only if needed)
  const getNextNodes = (nodeEdid: string) => {
    if (!showNextNodes) return []
    return allNodes
      .filter(n => n.prerequisites.includes(nodeEdid))
      .map(n => n.name)
  }

  // Helper to get prerequisite node names
  const getPrerequisiteNames = (prereqEdids: string[]) => {
    return prereqEdids.map(edid => {
      const found = allNodes.find(n => n.edid === edid)
      return found ? found.name : edid
    })
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="font-medium text-sm">{node.name}</span>
        {showTags && node.tags.length > 0 && (
          <div className="flex gap-1">
            {node.tags.slice(0, 1).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {node.tags.length > 1 && (
              <Badge variant="outline" className="text-xs">
                +{node.tags.length - 1}
              </Badge>
            )}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {node.description}
        </p>

        {/* Prerequisites */}
        {showPrerequisites && node.prerequisites.length > 0 && (
          <div>
            <p className="text-xs font-medium text-foreground mb-1">
              Prerequisites:
            </p>
            <div className="flex flex-wrap gap-1">
              {getPrerequisiteNames(node.prerequisites).map((prereq, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-orange-50 text-orange-700 border-orange-200"
                >
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Next Nodes */}
        {showNextNodes && (
          <div>
            <p className="text-xs font-medium text-foreground mb-1">
              Leads to:
            </p>
            <div className="flex flex-wrap gap-1">
              {getNextNodes(node.edid).map((nextNode, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {nextNode}
                </Badge>
              ))}
              {getNextNodes(node.edid).length === 0 && (
                <span className="text-xs text-muted-foreground">
                  No further progression
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {showTags && node.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {node.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {node.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{node.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={`space-y-1 ${className}`}>
      <h3 className="font-medium text-foreground text-base">{node.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {node.description}
      </p>
      {showTags && node.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {node.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {node.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{node.tags.length - 2}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
