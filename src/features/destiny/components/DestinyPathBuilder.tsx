import React, { useState, useMemo } from 'react'
import { useDestinyPath } from '../hooks/useDestinyPath'
import { YourDestinyPathCard } from './YourDestinyPathCard'
import { PredictivePathsSection } from './PredictivePathsSection'
import { PathCompleteCard } from './PathCompleteCard'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { usePossibleDestinyPaths } from '../hooks/usePossibleDestinyPaths'
import type { DestinyNode, PlannedNode } from '../types'
import type { SelectedTag } from '@/shared/components/playerCreation/types'

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
  onNodeUnplan,
}: DestinyPathBuilderProps) {
  const { getDestinyPath, setDestinyPath } = useCharacterBuild()
  // Hydrate from build state
  const destinyPathIds = getDestinyPath()
  const initialPath = React.useMemo(() => {
    // Map ids to DestinyNode objects, filter out missing
    return destinyPathIds
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is DestinyNode => !!n)
  }, [destinyPathIds, nodes])

  const {
    selectedPath,
    rootNodes,
    currentOptions,
    isNodePlanned,
    getCurrentNodeName,
    backtrack,
    handleBreadcrumbClick,
    startPath,
    startNewPath,
  } = useDestinyPath({
    nodes,
    plannedNodes,
    onNodePlan,
    onNodeUnplan,
    initialPath,
  })

  // Persist selectedPath to build state
  React.useEffect(() => {
    const current = getDestinyPath()
    const next = selectedPath.map(n => n.id)
    if (
      current.length !== next.length ||
      current.some((id, i) => id !== next[i])
    ) {
      setDestinyPath(next)
    }
  }, [selectedPath, getDestinyPath, setDestinyPath])

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
  const lastNode = selectedPath.length > 0 ? selectedPath[selectedPath.length - 1] : undefined;
  const possiblePaths = usePossibleDestinyPaths(nodes, lastNode);

  // Pure function to check if a node is terminal (no children)
  function isTerminalNode(node: DestinyNode) {
    return nodes.every(n => !n.prerequisites.includes(node.name));
  }

  // Map to PredictivePath format
  const predictivePaths = possiblePaths.map(path => ({
    path,
    isComplete: path.length > 0 && isTerminalNode(path[path.length - 1]),
    endNode: path[path.length - 1],
  }));

  return (
    <div className="space-y-6">
      {/* Your Destiny Path */}
      <YourDestinyPathCard
        selectedPath={selectedPath}
        rootNodes={rootNodes}
        isPlanned={isNodePlanned}
        onBacktrack={backtrack}
        onStartPath={startPath}
      />

      {/* Predictive Paths */}
      <PredictivePathsSection
        predictivePaths={predictivePaths}
        selectedPath={selectedPath}
        isPlanned={isNodePlanned}
        onBreadcrumbClick={handleBreadcrumbClick}
        getCurrentNodeName={getCurrentNodeName}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
      />

      {/* Path Complete */}
      <PathCompleteCard
        selectedPath={selectedPath}
        currentOptions={currentOptions}
        onStartNewPath={startNewPath}
      />
    </div>
  )
}
