import React from 'react'
import { YourDestinyPathCard } from './YourDestinyPathCard'
import { PredictivePathsSection } from './PredictivePathsSection'
import { PathCompleteCard } from './PathCompleteCard'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useDestinyPossiblePaths } from '../hooks/useDestinyPossiblePaths'
import { useDestinyPathSetter } from '../hooks/useDestinyPathSetter'
import type { DestinyNode, PlannedNode } from '../types'


interface DestinyPathBuilderProps {
  nodes: DestinyNode[]
  plannedNodes: PlannedNode[]
  onNodePlan: (nodeId: string) => void
  onNodeUnplan: (nodeId: string) => void
}

export function DestinyPathBuilder({
  nodes,

}: DestinyPathBuilderProps) {
  const { getDestinyPath } = useCharacterBuild()
  const destinyPathIds = getDestinyPath()
  const selectedPath = React.useMemo(() => {
    return destinyPathIds
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is DestinyNode => !!n)
  }, [destinyPathIds, nodes])

  // Use standardized setter for all path updates
  const setDestinyPathToNode = useDestinyPathSetter()

  // Use the player creation filters hook for tag management
  const {
    handleTagSelect,
    handleTagRemove,
    filters: { selectedTags },
  } = usePlayerCreationFilters({
    onFiltersChange: () => {}, // No-op since we're not using the full filter system
    onSearch: () => {}, // No-op since we're not using the search system
  })

  // Use the last node in the current selectedPath as the start node for possible paths
  const lastNode =
    selectedPath.length > 0 ? selectedPath[selectedPath.length - 1] : undefined
  const possiblePaths = useDestinyPossiblePaths(nodes)

  // Pure function to check if a node is terminal (no children)
  function isTerminalNode(node: DestinyNode) {
    return nodes.every(n => !n.prerequisites.includes(node.name))
  }

  // Map to PredictivePath format
  const predictivePaths = possiblePaths.map(path => ({
    path,
    isComplete: path.length > 0 && isTerminalNode(path[path.length - 1]),
    endNode: path[path.length - 1],
  }))

  return (
    <div className="space-y-6">
      {/* Your Destiny Path */}
      <YourDestinyPathCard
        selectedPath={selectedPath}
        rootNodes={nodes.filter(node => node.prerequisites.length === 0)}
        isPlanned={id => selectedPath.some(n => n.id === id)}
        onBacktrack={index => setDestinyPathToNode(selectedPath, index)}
        onStartPath={node => setDestinyPathToNode([node], 0)}
      />

      {/* Predictive Paths */}
      <PredictivePathsSection
        predictivePaths={predictivePaths}
        selectedPath={selectedPath}
        isPlanned={id => selectedPath.some(n => n.id === id)}
        onBreadcrumbClick={setDestinyPathToNode}
        getCurrentNodeName={() =>
          selectedPath.length === 0 ? 'Destiny' : selectedPath[selectedPath.length - 1].name
        }
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
      />

      {/* Path Complete */}
      <PathCompleteCard
        selectedPath={selectedPath}
        currentOptions={[]}
        onStartNewPath={() => setDestinyPathToNode([], -1)}
      />
    </div>
  )
}
