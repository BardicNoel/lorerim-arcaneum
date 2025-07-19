import React, { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { ChevronRight, GitBranch } from 'lucide-react'
import { DestinyNodeHoverCard } from './DestinyNodeHoverCard'
import { DestinyPathSearch } from './DestinyPathSearch'
import type { DestinyNode } from '../types'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

interface PredictivePath {
  path: DestinyNode[]
  isComplete: boolean
  endNode: DestinyNode
}

interface PredictivePathsSectionProps {
  predictivePaths: PredictivePath[]
  selectedPath: DestinyNode[]
  isPlanned: (nodeId: string) => boolean
  onBreadcrumbClick: (path: DestinyNode[], clickedIndex: number) => void
  getCurrentNodeName: () => string
  selectedTags: SelectedTag[]
  onTagSelect: (tag: SelectedTag) => void
  onTagRemove: (tagId: string) => void
}

export function PredictivePathsSection({
  predictivePaths,
  selectedPath,
  isPlanned,
  onBreadcrumbClick,
  getCurrentNodeName,
  selectedTags,
  onTagSelect,
  onTagRemove,
}: PredictivePathsSectionProps) {
  // Filter paths based on selected tags
  const filteredPaths = useMemo(() => {
    return predictivePaths.filter(path => {
      // If no tags selected, show all paths
      if (selectedTags.length === 0) return true

      // Check each tag filter
      return selectedTags.every(tag => {
        const [filterType, nodeName] = tag.value.split(':')

        if (filterType === 'contains') {
          // Path must contain the specified node
          return path.path.some(node =>
            node.name.toLowerCase().includes(nodeName.toLowerCase())
          )
        } else if (filterType === 'ends') {
          // Path must end with the specified node (and be complete)
          return (
            path.isComplete &&
            path.endNode.name.toLowerCase().includes(nodeName.toLowerCase())
          )
        }

        return true
      })
    })
  }, [predictivePaths, selectedTags])

  if (predictivePaths.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Search Filters */}
      <DestinyPathSearch
        predictivePaths={predictivePaths}
        selectedTags={selectedTags}
        onTagSelect={onTagSelect}
        onTagRemove={onTagRemove}
      />

      {/* Paths Display */}
      <Card className="h-[calc(60vh-300px)] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Possible Paths ({filteredPaths.length} of {predictivePaths.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedPath.length === 0
              ? 'All possible destiny paths from the beginning'
              : `Paths available from your current position at "${getCurrentNodeName()}"`}
            {selectedTags.length > 0 && (
              <span> • Filtered by {selectedTags.length} criteria</span>
            )}
          </p>
        </CardHeader>
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4">
              {filteredPaths.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No paths match your current filters.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                filteredPaths.map((predictivePath, pathIndex) => (
                  <div
                    key={pathIndex}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-1">
                        {predictivePath.path.map((node, nodeIndex) => (
                          <React.Fragment key={node.id}>
                            <DestinyNodeHoverCard
                              node={node}
                              isPlanned={isPlanned(node.id)}
                            >
                              <Badge
                                variant={
                                  nodeIndex < selectedPath.length
                                    ? 'default'
                                    : nodeIndex === selectedPath.length
                                      ? 'secondary'
                                      : 'outline'
                                }
                                className={`text-xs cursor-pointer hover:scale-105 transition-transform ${
                                  nodeIndex < selectedPath.length
                                    ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                                    : predictivePath.isComplete &&
                                        nodeIndex ===
                                          predictivePath.path.length - 1
                                      ? 'bg-red-800 text-red-100 border-red-700'
                                      : ''
                                }`}
                                onClick={e => {
                                  e.stopPropagation()
                                  onBreadcrumbClick(
                                    predictivePath.path,
                                    nodeIndex
                                  )
                                }}
                              >
                                {node.name}
                              </Badge>
                            </DestinyNodeHoverCard>
                            {nodeIndex < predictivePath.path.length - 1 && (
                              <ChevronRight className="w-3 h-3 text-muted-foreground" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Length: {predictivePath.path.length} steps</span>
                      {predictivePath.isComplete && (
                        <span>• Ends at: {predictivePath.endNode.name}</span>
                      )}
                      {predictivePath.path.length > selectedPath.length && (
                        <span>
                          • {predictivePath.path.length - selectedPath.length}{' '}
                          more choices
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
