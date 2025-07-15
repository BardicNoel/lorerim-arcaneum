import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { ChevronRight, MapPin } from 'lucide-react'
import type { DestinyNode, PlannedNode } from '../types'

interface DestinyPathBuilderProps {
  nodes: DestinyNode[]
  plannedNodes: PlannedNode[]
  onNodePlan: (nodeId: string) => void
  onNodeUnplan: (nodeId: string) => void
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

  // Add a node to the selected path
  const addToPath = (node: DestinyNode) => {
    setSelectedPath(prev => [...prev, node])
  }

  // Remove nodes from path (backtrack)
  const backtrack = (index: number) => {
    setSelectedPath(prev => prev.slice(0, index + 1))
  }

  // Check if a node is planned
  const isNodePlanned = (nodeId: string) => {
    return plannedNodes.some(p => p.id === nodeId)
  }

  // Handle planning/unplanning a node
  const handleTogglePlan = (nodeId: string) => {
    if (isNodePlanned(nodeId)) {
      onNodeUnplan(nodeId)
    } else {
      onNodePlan(nodeId)
    }
  }

  // Get current node name for the header
  const getCurrentNodeName = () => {
    if (selectedPath.length === 0) return "Destiny"
    return selectedPath[selectedPath.length - 1].name
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Left Column - Path Selection and Options */}
      <div className="xl:col-span-3 space-y-6">
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
              <div className="flex flex-wrap items-center gap-2">
                {selectedPath.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={index === selectedPath.length - 1 ? "default" : "secondary"}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => backtrack(index)}
                      >
                        {node.name}
                      </Badge>
                      {index < selectedPath.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Options */}
        {currentOptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{getCurrentNodeName()}: Choose Your Next Step</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click on one of the available paths to continue your journey
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {currentOptions.map((option) => (
                  <Card key={option.id} className="hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => addToPath(option)}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-lg">{option.name}</h4>
                          <Badge 
                            variant={isNodePlanned(option.id) ? "default" : "outline"}
                            className="text-xs"
                          >
                            {isNodePlanned(option.id) ? "Planned" : "Not Planned"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                        
                        {/* Prerequisites */}
                        {option.prerequisites.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-foreground mb-1">Prerequisites:</p>
                            <div className="flex flex-wrap gap-1">
                              {option.prerequisites.map((prereq, index) => (
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
                        {option.tags.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-foreground mb-1">Tags:</p>
                            <div className="flex flex-wrap gap-1">
                              {option.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Planning Button */}
                        <Button
                          variant={isNodePlanned(option.id) ? "outline" : "default"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTogglePlan(option.id)
                          }}
                          className="w-full"
                        >
                          {isNodePlanned(option.id) ? "Remove from Plan" : "Add to Plan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

        {/* Planned Nodes Summary */}
        {plannedNodes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Planned Destiny</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {plannedNodes.map((plannedNode) => (
                  <div key={plannedNode.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{plannedNode.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {plannedNode.description}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-3 flex-shrink-0"
                      onClick={() => onNodeUnplan(plannedNode.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column - Selected Path Carousel */}
      <div className="xl:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Selected Path</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPath.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No path selected yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedPath.map((node, index) => (
                  <Card key={node.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-lg">{node.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            Step {index + 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {node.description}
                        </p>
                        
                        {/* Tags */}
                        {node.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {node.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Planning Button */}
                        <Button
                          variant={isNodePlanned(node.id) ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleTogglePlan(node.id)}
                          className="w-full"
                        >
                          {isNodePlanned(node.id) ? "Remove from Plan" : "Add to Plan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 