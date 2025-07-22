import React, { useEffect, useState } from 'react'
import { DestinySelectionCard } from './DestinySelectionCard'
import type { DestinyNode } from '../types'
import { useBuildPathPlanner } from '../hooks/useBuildPathPlanner'
import { usePossibleDestinyPaths } from '../hooks/usePossibleDestinyPaths'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'

interface BuildPageDestinyCardProps {
  navigate: (to: string) => void
}

const BuildPageDestinyCard: React.FC<BuildPageDestinyCardProps> = ({
  navigate,
}) => {
  const [destinyNodes, setDestinyNodes] = useState<DestinyNode[]>([])
  const [destinyLoading, setDestinyLoading] = useState(true)
  const [destinyError, setDestinyError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDestinyData() {
      try {
        setDestinyLoading(true)
        const res = await fetch(
          `${import.meta.env.BASE_URL}data/subclasses.json`
        )
        if (!res.ok) throw new Error('Failed to fetch destiny data')
        const data = await res.json()
        setDestinyNodes(
          data.map((node: any, index: number) => ({
            id: node.globalFormId || `destiny-${index}`,
            name: node.name,
            description: node.description,
            tags: [],
            prerequisites: node.prerequisites || [],
            nextBranches: [],
            levelRequirement: undefined,
            lore: undefined,
            globalFormId: node.globalFormId,
          }))
        )
      } catch (err) {
        setDestinyError('Failed to load destiny data')
      } finally {
        setDestinyLoading(false)
      }
    }
    fetchDestinyData()
  }, [])

  const {
    selectedDestinyPath,
    isNodePlanned,
    handleBuildPathSelect,
    handleBreadcrumbClick,
    build,
    setDestinyPath,
  } = useBuildPathPlanner(destinyNodes)

  // Find the root node (Destiny)
  const rootNode = destinyNodes.find(n => n.prerequisites.length === 0)
  // Always call the hook, even if rootNode is undefined
  const allPathsFromRoot = usePossibleDestinyPaths(destinyNodes, rootNode)

  // If there is a selection, filter to only those paths that match the current build path up to the last selected node
  let possiblePaths = allPathsFromRoot
  if (selectedDestinyPath.length > 0) {
    possiblePaths = allPathsFromRoot.filter(path =>
      selectedDestinyPath.every(
        (node, idx) => path[idx] && path[idx].id === node.id
      )
    )
  }

  // Pure function to check if a node is terminal (no children)
  function isTerminalNode(node: DestinyNode) {
    return destinyNodes.every(n => !n.prerequisites.includes(node.name))
  }

  // Map to PredictivePath format
  const predictivePaths = possiblePaths.map(path => ({
    path,
    isComplete: path.length > 0 && isTerminalNode(path[path.length - 1]),
    endNode: path[path.length - 1],
  }))

  // Use the player creation filters hook for tag management
  const {
    handleTagSelect,
    handleTagRemove,
    filters: { selectedTags },
  } = usePlayerCreationFilters({
    onFiltersChange: () => {}, // No-op since we're not using the full filter system
    onSearch: () => {}, // No-op since we're not using the search system
  })

  return (
    <DestinySelectionCard
      selectedPath={selectedDestinyPath}
      destinyNodes={destinyNodes}
      buildDestinyPath={build.destinyPath}
      setDestinyPath={setDestinyPath}
      loading={destinyLoading}
      error={destinyError}
      navigate={navigate}
      predictivePaths={predictivePaths}
      onBuildPathSelect={handleBuildPathSelect}
      isNodePlanned={isNodePlanned}
      onBreadcrumbClick={handleBreadcrumbClick}
      selectedTags={selectedTags}
      onTagSelect={handleTagSelect}
      onTagRemove={handleTagRemove}
    />
  )
}

export default BuildPageDestinyCard
