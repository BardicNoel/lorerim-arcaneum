import React, { useMemo } from 'react'
import { MultiAutocompleteSearch } from '@/shared/components/playerCreation/MultiAutocompleteSearch'
import { SelectedTags } from '@/shared/components/playerCreation/SelectedTags'
import type { DestinyNode } from '../types'
import type {
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'

interface PredictivePath {
  path: DestinyNode[]
  isComplete: boolean
  endNode: DestinyNode
}

interface DestinyPathSearchProps {
  predictivePaths: PredictivePath[]
  selectedTags: SelectedTag[]
  onTagSelect: (tag: SelectedTag) => void
  onTagRemove: (tagId: string) => void
}

export function DestinyPathSearch({
  predictivePaths,
  selectedTags,
  onTagSelect,
  onTagRemove,
}: DestinyPathSearchProps) {
  // Generate search categories for path filtering
  const searchCategories = useMemo((): SearchCategory[] => {
    // Get all unique nodes from all paths with their levels
    const nodeLevelMap = new Map<string, { name: string; level: number }>()

    predictivePaths.forEach(path => {
      path.path.forEach((node, index) => {
        // Calculate level based on position in path (0-based)
        const level = index
        const existing = nodeLevelMap.get(node.name)

        // Keep the lowest level if a node appears in multiple paths
        if (!existing || level < existing.level) {
          nodeLevelMap.set(node.name, { name: node.name, level })
        }
      })
    })

    // Get all terminal nodes (end nodes)
    const terminalNodes = new Set<string>()
    predictivePaths.forEach(path => {
      if (path.isComplete) {
        terminalNodes.add(path.endNode.name)
      }
    })

    // Sort nodes by level first, then alphabetically within each level
    const sortedNodes = Array.from(nodeLevelMap.entries())
      .map(([name, { level }]) => ({ name, level }))
      .sort((a, b) => {
        // First sort by level
        if (a.level !== b.level) {
          return a.level - b.level
        }
        // Then sort alphabetically within the same level
        return a.name.localeCompare(b.name)
      })

    // Filter paths based on already selected tags
    const filteredPaths = predictivePaths.filter(path => {
      if (selectedTags.length === 0) return true

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

    // Get filtered terminal nodes based on selected contains tags
    const filteredTerminalNodes = new Set<string>()
    filteredPaths.forEach(path => {
      if (path.isComplete) {
        filteredTerminalNodes.add(path.endNode.name)
      }
    })

    // Get filtered contains nodes based on selected ends tags
    const filteredContainsNodes = new Set<string>()
    filteredPaths.forEach(path => {
      path.path.forEach((node, index) => {
        const level = index
        const existing = filteredContainsNodes.has(node.name)
        if (!existing) {
          filteredContainsNodes.add(node.name)
        }
      })
    })

    return [
      {
        id: 'contains-nodes',
        name: 'Contains Node',
        placeholder: 'Search for paths containing a specific node...',
        options: sortedNodes
          .filter(({ name }) => filteredContainsNodes.has(name))
          .map(({ name, level }) => ({
            id: `contains-${name}`,
            label: `${name} (Level ${level})`,
            value: `contains:${name}`,
            category: 'Contains Node',
            description: `Paths that include ${name}`,
          })),
      },
      {
        id: 'ends-with-nodes',
        name: 'Ends With Node',
        placeholder: 'Search for paths ending at a specific node...',
        options: Array.from(filteredTerminalNodes)
          .sort()
          .map(node => ({
            id: `ends-${node}`,
            label: node,
            value: `ends:${node}`,
            category: 'Ends With Node',
            description: `Paths that end at ${node}`,
          })),
      },
    ]
  }, [predictivePaths, selectedTags])

  return (
    <div className="space-y-4">
      {/* Multi Autocomplete Search */}
      <MultiAutocompleteSearch
        categories={searchCategories}
        onSelect={onTagSelect}
        className="w-full"
      />

      {/* Selected Tags */}
      <SelectedTags
        tags={selectedTags}
        onRemove={onTagRemove}
        className="justify-start"
      />
    </div>
  )
}
