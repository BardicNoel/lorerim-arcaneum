import type { SearchOption } from '@/shared/components/playerCreation/types'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { AlertCircle, CheckCircle, RotateCcw, SearchX } from 'lucide-react'
import { useDestinyFilters } from '../../adapters/useDestinyFilters'
import { useDestinyNodes } from '../../adapters/useDestinyNodes'
import { useDestinyPath } from '../../adapters/useDestinyPath'
import { useDestinyPossiblePaths } from '../../adapters/useDestinyPossiblePaths'
import type { DestinyNode } from '../../types'
import { DestinyBreadcrumbTrail } from '../atomic/DestinyBreadcrumbTrail'
import { DestinySelectedPathList } from '../atomic/DestinySelectedPathList'
import { DestinyFilters } from './DestinyFilters'
import { DestinyPossiblePathsList } from './DestinyPossiblePathsList'

interface DestinyPathBuilderProps {
  onPathChange?: (path: DestinyNode[]) => void
  onPathComplete?: (path: DestinyNode[]) => void
  className?: string
  compact?: boolean
  currentPath?: DestinyNode[] // Add this prop
}

export function DestinyPathBuilder({
  onPathChange,
  onPathComplete,
  className = '',
  compact = false,
  currentPath = [], // Add this prop with default
}: DestinyPathBuilderProps) {
  const {
    currentPath: pathState,
    currentNode,
    availableNodes,
    isValidPath,
    pathErrors,
    addNodeToPath,
    removeNodeFromPath,
    setPath,
    clearPath,
    goToPathIndex,
    isPathComplete,
    getPathSummary,
  } = useDestinyPath({
    initialPath: currentPath, // Pass the currentPath as initialPath
  })

  // Get possible paths from current position
  const { possiblePaths } = useDestinyPossiblePaths({
    fromNode: currentNode || undefined,
  })

  // Get all nodes for breadcrumb trail
  const { nodes } = useDestinyNodes()

  // Use destiny filters for build path
  const buildPathFilters = useDestinyFilters({
    filterType: 'build-path',
    currentPath: pathState,
  })

  // Use filtered paths from destiny filters
  const displayPaths =
    buildPathFilters.selectedFilters.length > 0
      ? buildPathFilters.filteredPaths
      : possiblePaths.map(p => p.path)

  // Handle destiny filter selection
  const handleDestinyFilterSelect = (option: string | SearchOption) => {
    if (typeof option === 'string') {
      // Custom search - not implemented for destiny filters yet
      return
    }

    // Create destiny filter from selected option
    let destinyFilterType:
      | 'includes-node'
      | 'ends-with-node'
      | 'tags'
      | 'prerequisites'
    let nodeId: string

    if (option.category === 'Includes Node') {
      destinyFilterType = 'includes-node'
      nodeId = option.id.replace(/^includes-/, '')
    } else if (option.category === 'Ends With Node') {
      destinyFilterType = 'ends-with-node'
      nodeId = option.id.replace(/^ends-/, '')
    } else {
      return // Unknown category
    }

    const filter = {
      id: option.id,
      type: destinyFilterType,
      nodeName: option.value,
      nodeId: nodeId,
      label: option.label,
    }

    buildPathFilters.addFilter(filter)
  }

  // Handle destiny filter removal
  const handleDestinyFilterRemove = (filterId: string) => {
    buildPathFilters.removeFilter(filterId)
  }

  // Handle destiny filter clear
  const handleDestinyFilterClear = () => {
    buildPathFilters.clearFilters()
  }

  // Handle path selection
  const handlePathClick = (path: DestinyNode[], clickedIndex: number) => {
    let newPath: DestinyNode[]

    if (pathState.length === 0) {
      // No current path - user is starting fresh
      // Set the path up to the clicked index
      newPath = path.slice(0, clickedIndex + 1)
    } else {
      // Has current path - user is extending from current position
      if (clickedIndex === 0) {
        // User clicked on the first node (current node) - no change needed
        return
      }

      // Get the nodes to add (skip the first node since it's the current node)
      const nodesToAdd = path.slice(1, clickedIndex + 1)
      newPath = [...pathState, ...nodesToAdd]
    }

    // Set the entire path at once (bypasses individual node validation)
    setPath(newPath)

    onPathChange?.(newPath)

    // Check if path is complete
    if (isPathComplete) {
      onPathComplete?.(newPath)
    }
  }

  // Handle breadcrumb click
  const handleBreadcrumbClick = (index: number) => {
    goToPathIndex(index)
    onPathChange?.(pathState)
  }

  // Handle clearing path
  const handleClearPath = () => {
    clearPath()
    onPathChange?.([])
  }

  const pathSummary = getPathSummary()

  // Compact mode for build page
  if (compact) {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Selected Path List */}
        <DestinySelectedPathList path={pathState} />

        {/* Clear Path Button */}
        {pathState.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearPath}
              className="text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear Path
            </Button>
          </div>
        )}

        {/* Possible Remaining Paths */}
        {displayPaths.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Possible Remaining Paths
            </h4>
            <ScrollArea className="h-[200px]">
              <div className="p-4">
                <DestinyPossiblePathsList
                  possiblePaths={displayPaths.map(path => ({
                    path,
                    isComplete: false,
                    endNode: path[path.length - 1],
                  }))}
                  selectedPathLength={pathState.length}
                  onPathClick={handlePathClick}
                  variant="compact"
                />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Path Validation Errors - Compact */}
        {!isValidPath && pathErrors.length > 0 && (
          <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
            <div className="flex items-center gap-1 mb-1">
              <AlertCircle className="w-3 h-3" />
              <span className="font-medium">Path Errors:</span>
            </div>
            <ul className="space-y-0.5">
              {pathErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  // Full mode for dedicated destiny page
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Path Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Destiny Path Builder
            </CardTitle>
            <div className="flex items-center gap-2">
              {pathState.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPath}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Path
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Breadcrumb Trail */}
          <DestinyBreadcrumbTrail
            path={pathState}
            allNodes={nodes}
            onBreadcrumbClick={handleBreadcrumbClick}
            className="mb-4"
          />

          {/* Path Summary */}
          {pathState.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Path Length: {pathState.length}</span>
              <span>•</span>
              <span>Start: {pathSummary.startNode?.name}</span>
              <span>•</span>
              <span>Current: {pathSummary.endNode?.name}</span>
              {isPathComplete && (
                <>
                  <span>•</span>
                  <Badge variant="default" className="text-xs">
                    Complete
                  </Badge>
                </>
              )}
            </div>
          )}

          {/* Path Validation Errors */}
          {!isValidPath && pathErrors.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Path Validation Errors:</span>
              </div>
              <ul className="text-sm space-y-1">
                {pathErrors.map((error, index) => (
                  <li key={index} className="text-destructive">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Path Display */}
      {pathState.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pathState.map((node, index) => (
                <div
                  key={node.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50"
                >
                  <Badge variant="outline" className="text-xs">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">{node.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {node.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Possible Paths */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {pathState.length === 0
              ? 'Choose Your Starting Point'
              : 'Possible Paths'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {pathState.length === 0
              ? 'Select a root destiny node to begin your path'
              : displayPaths.length === 0
                ? buildPathFilters.selectedFilters.length > 0
                  ? 'No paths match your current filters'
                  : 'You have reached the end of this destiny path'
                : buildPathFilters.selectedFilters.length > 0
                  ? `Showing ${displayPaths.length} filtered paths from your current position`
                  : `Explore ${displayPaths.length} possible paths from your current position`}
          </p>
        </CardHeader>
        <CardContent className="h-[600px] p-0">
          {/* Filters positioned right over possible paths - always visible */}
          <div className="p-6 pb-6">
            <DestinyFilters
              searchCategories={buildPathFilters.searchCategories}
              selectedFilters={buildPathFilters.selectedFilters}
              onFilterSelect={handleDestinyFilterSelect}
              onFilterRemove={handleDestinyFilterRemove}
              onClearFilters={handleDestinyFilterClear}
            />
          </div>

          {displayPaths.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {buildPathFilters.selectedFilters.length > 0 ? (
                <SearchX className="w-12 h-12 mx-auto mb-4 opacity-50" />
              ) : (
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              )}
              <p className="text-lg font-medium">
                {buildPathFilters.selectedFilters.length > 0
                  ? 'No paths match your filters'
                  : 'Path Complete!'}
              </p>
              <p className="text-sm">
                {buildPathFilters.selectedFilters.length > 0
                  ? 'Try adjusting your filters to see more paths.'
                  : "You've reached the end of this destiny path."}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(600px-200px)]">
              <div className="p-6 pt-4">
                <DestinyPossiblePathsList
                  possiblePaths={displayPaths.map(path => ({
                    path,
                    isComplete: false,
                    endNode: path[path.length - 1],
                  }))}
                  selectedPathLength={pathState.length}
                  onPathClick={handlePathClick}
                />
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
