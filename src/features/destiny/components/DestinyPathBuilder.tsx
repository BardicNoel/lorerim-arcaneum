import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/ui/hover-card'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { ChevronRight, MapPin, GitBranch } from 'lucide-react'
import type { DestinyNode, PlannedNode } from '../types'

interface DestinyPathBuilderProps {
  nodes: DestinyNode[]
  plannedNodes: PlannedNode[]
  onNodePlan: (nodeId: string) => void
  onNodeUnplan: (nodeId: string) => void
}

interface PredictivePath {
  path: DestinyNode[]
  isComplete: boolean
  endNode: DestinyNode
}

export function DestinyPathBuilder({ 
  nodes, 
  plannedNodes, 
  onNodePlan, 
  onNodeUnplan 
}: DestinyPathBuilderProps) {
  const [selectedPath, setSelectedPath] = useState<DestinyNode[]>([])

  // Find root nodes (nodes with no prerequisites)
  const rootNodes = useMemo(() => {
    return nodes.filter(node => node.prerequisites.length === 0)
  }, [nodes])

  // Get available next nodes for a given node
  const getNextNodes = (nodeName: string) => {
    return nodes.filter(node => node.prerequisites.includes(nodeName))
  }

  // Get current available options based on selected path
  const currentOptions = useMemo(() => {
    if (selectedPath.length === 0) return rootNodes
    const lastNode = selectedPath[selectedPath.length - 1]
    return getNextNodes(lastNode.name)
  }, [selectedPath, rootNodes])

  // Generate predictive paths from current position
  const predictivePaths = useMemo(() => {
    const paths: PredictivePath[] = []
    const visited = new Set<string>()

    const buildPaths = (currentPath: DestinyNode[]) => {
      const lastNode = currentPath[currentPath.length - 1]
      const nextNodes = getNextNodes(lastNode.name)

      if (nextNodes.length === 0) {
        // End of path
        paths.push({
          path: [...currentPath],
          isComplete: true,
          endNode: lastNode
        })
        return
      }

      // Continue building paths for each next node
      nextNodes.forEach(nextNode => {
        const pathKey = currentPath.map(n => n.id).join('->') + '->' + nextNode.id
        if (!visited.has(pathKey)) {
          visited.add(pathKey)
          buildPaths([...currentPath, nextNode])
        }
      })
    }

    // Start building paths from current position
    if (selectedPath.length === 0) {
      // From root, build paths from each root node
      rootNodes.forEach(rootNode => {
        buildPaths([rootNode])
      })
    } else {
      // From current position, build paths from each available option
      currentOptions.forEach(option => {
        buildPaths([...selectedPath, option])
      })
    }

    return paths
  }, [selectedPath, currentOptions, rootNodes, nodes])

  // Remove nodes from path (backtrack)
  const backtrack = (index: number) => {
    const newPath = selectedPath.slice(0, index + 1)
    setSelectedPath(newPath)
    updatePlannedNodes(newPath)
  }

  // Check if a node is planned
  const isNodePlanned = (nodeId: string) => {
    return plannedNodes.some(p => p.id === nodeId)
  }

  // Update planned nodes when selected path changes
  const updatePlannedNodes = (path: DestinyNode[]) => {
    // Clear existing planned nodes
    plannedNodes.forEach(node => {
      onNodeUnplan(node.id)
    })
    
    // Add all nodes from the selected path to planned nodes
    path.forEach(node => {
      onNodePlan(node.id)
    })
  }

  // Get current node name for the header
  const getCurrentNodeName = () => {
    if (selectedPath.length === 0) return "Destiny"
    return selectedPath[selectedPath.length - 1].name
  }

  // Handle breadcrumb click - advance to specific stage in path
  const handleBreadcrumbClick = (path: DestinyNode[], clickedIndex: number) => {
    const newPath = path.slice(0, clickedIndex + 1)
    setSelectedPath(newPath)
    updatePlannedNodes(newPath)
  }

  return (
    <div className="space-y-6">
      {/* Path Selection Tools */}
      <div className="space-y-6">
          {/* Path Breadcrumbs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Your Destiny Path
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPath.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No path started yet</p>
                  <Button onClick={() => setSelectedPath([rootNodes[0]])}>
                    Start Your Journey
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Breadcrumbs */}
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedPath.map((node, index) => (
                      <React.Fragment key={node.id}>
                        <div className="flex items-center gap-2">
                          <HoverCard openDelay={100} closeDelay={0}>
                            <HoverCardTrigger asChild>
                              <Badge 
                                variant={index === selectedPath.length - 1 ? "default" : "secondary"}
                                className="cursor-pointer hover:bg-primary/80"
                                onClick={() => backtrack(index)}
                              >
                                {node.name}
                              </Badge>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-lg">{node.name}</h4>
                                  <Badge 
                                    variant={isNodePlanned(node.id) ? "default" : "outline"}
                                    className="text-xs"
                                  >
                                    {isNodePlanned(node.id) ? "Planned" : "Not Planned"}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {node.description}
                                </p>
                                
                                {/* Prerequisites */}
                                {node.prerequisites.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-foreground mb-1">Prerequisites:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {node.prerequisites.map((prereq, index) => (
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
                                
                                {/* Tags */}
                                {node.tags.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-foreground mb-1">Tags:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {node.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                          {index < selectedPath.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  
                  {/* Selected Path List */}
                  <div className="space-y-2">
                    {selectedPath.map((node, index) => (
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
                </div>
              )}
            </CardContent>
          </Card>

          {/* Predictive Paths */}
          {predictivePaths.length > 0 && (
            <Card className="h-[calc(60vh-200px)] overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Possible Paths ({predictivePaths.length})
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedPath.length === 0 
                    ? "All possible destiny paths from the beginning"
                    : `Paths available from your current position at "${getCurrentNodeName()}"`
                  }
                </p>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <ScrollArea className="h-full">
                  <div className="space-y-4 p-4">
                    {predictivePaths.map((predictivePath, pathIndex) => {
                      // Check if this path matches the current selected path
                      const isSelectedPath = selectedPath.length > 0 && 
                        predictivePath.path.length >= selectedPath.length &&
                        selectedPath.every((node, index) => 
                          predictivePath.path[index]?.id === node.id
                        )
                      
                      return (
                        <div 
                          key={pathIndex}
                          className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex flex-wrap items-center gap-1">
                              {predictivePath.path.map((node, nodeIndex) => (
                                <React.Fragment key={node.id}>
                                  <HoverCard openDelay={100} closeDelay={0}>
                                    <HoverCardTrigger asChild>
                                      <Badge 
                                        variant={
                                          nodeIndex < selectedPath.length 
                                            ? "default" 
                                            : nodeIndex === selectedPath.length 
                                              ? "secondary"
                                              : "outline"
                                        }
                                        className={`text-xs cursor-pointer hover:scale-105 transition-transform ${
                                          nodeIndex < selectedPath.length
                                            ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                            : predictivePath.isComplete && nodeIndex === predictivePath.path.length - 1
                                              ? "bg-red-800 text-red-100 border-red-700"
                                              : ""
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleBreadcrumbClick(predictivePath.path, nodeIndex)
                                        }}
                                      >
                                        {node.name}
                                      </Badge>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <h4 className="font-medium text-lg">{node.name}</h4>
                                          <Badge 
                                            variant={isNodePlanned(node.id) ? "default" : "outline"}
                                            className="text-xs"
                                          >
                                            {isNodePlanned(node.id) ? "Planned" : "Not Planned"}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {node.description}
                                        </p>
                                        
                                        {/* Prerequisites */}
                                        {node.prerequisites.length > 0 && (
                                          <div>
                                            <p className="text-xs font-medium text-foreground mb-1">Prerequisites:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {node.prerequisites.map((prereq, index) => (
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
                                        
                                        {/* Tags */}
                                        {node.tags.length > 0 && (
                                          <div>
                                            <p className="text-xs font-medium text-foreground mb-1">Tags:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {node.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                  {tag}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </HoverCardContent>
                                  </HoverCard>
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
                              <span>• {predictivePath.path.length - selectedPath.length} more choices</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* End of Path */}
          {selectedPath.length > 0 && currentOptions.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Path Complete</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    You've reached the end of this path. "{selectedPath[selectedPath.length - 1].name}" has no further progression options.
                  </p>
                  <Button onClick={() => setSelectedPath([])}>
                    Start New Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

  )
} 