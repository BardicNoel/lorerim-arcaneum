import React, { useMemo } from 'react'
import Tree from 'react-d3-tree'
import { Badge } from '@/shared/ui/ui/badge'
import type { DestinyNode, PlannedNode } from '../types'

interface DestinyTreeViewProps {
  nodes: DestinyNode[]
  plannedNodes: PlannedNode[]
  selectedNode?: DestinyNode
  onNodeClick: (node: DestinyNode) => void
  onNodePlan: (nodeId: string) => void
}

interface TreeNode {
  name: string
  attributes?: Record<string, string>
  children?: TreeNode[]
  nodeDatum?: any
}

interface GraphNode {
  node: DestinyNode
  children: Set<string> // Set of child node IDs
  parents: Set<string> // Set of parent node IDs
}

export function DestinyTreeView({
  nodes,
  plannedNodes,
  selectedNode,
  onNodeClick,
  onNodePlan,
}: DestinyTreeViewProps) {
  // Build a proper graph structure first
  const buildGraph = useMemo(() => {
    const graph = new Map<string, GraphNode>()

    // Initialize all nodes in the graph
    nodes.forEach(node => {
      graph.set(node.id, {
        node,
        children: new Set(),
        parents: new Set(),
      })
    })

    // Build parent-child relationships
    nodes.forEach(node => {
      const graphNode = graph.get(node.id)!

      // Add children based on prerequisites
      node.prerequisites.forEach(prereqName => {
        const prereqNode = nodes.find(n => n.name === prereqName)
        if (prereqNode) {
          const prereqGraphNode = graph.get(prereqNode.id)!
          prereqGraphNode.children.add(node.id)
          graphNode.parents.add(prereqNode.id)
        }
      })
    })

    return graph
  }, [nodes])

  // Convert graph to tree structure, handling shared nodes properly
  const buildTreeFromGraph = (
    nodeId: string,
    visited: Set<string> = new Set()
  ): TreeNode | null => {
    if (visited.has(nodeId)) {
      return null // This node is already being processed in this branch
    }

    const graphNode = buildGraph.get(nodeId)
    if (!graphNode) return null

    visited.add(nodeId)

    // Get all children that aren't already visited in this branch
    const children = Array.from(graphNode.children)
      .map(childId => buildTreeFromGraph(childId, new Set(visited)))
      .filter(Boolean) as TreeNode[]

    return {
      name: graphNode.node.name,
      attributes: {
        id: graphNode.node.id,
        description: graphNode.node.description,
        tags: graphNode.node.tags.join(', '),
        isPlanned: plannedNodes.some(p => p.id === graphNode.node.id)
          ? 'true'
          : 'false',
        isSelected: selectedNode?.id === graphNode.node.id ? 'true' : 'false',
      },
      children: children.length > 0 ? children : undefined,
    }
  }

  // Find root nodes (nodes with no prerequisites)
  const rootNodes = useMemo(() => {
    return nodes.filter(node => node.prerequisites.length === 0)
  }, [nodes])

  // Transform data for react-d3-tree
  const treeData = useMemo(() => {
    if (rootNodes.length === 0) return null

    // If there's only one root, use it directly
    if (rootNodes.length === 1) {
      return buildTreeFromGraph(rootNodes[0].id)
    }

    // If multiple roots, create a virtual root
    const rootChildren = rootNodes
      .map(root => buildTreeFromGraph(root.id))
      .filter(Boolean) as TreeNode[]

    return {
      name: 'Destiny Tree',
      children: rootChildren,
    }
  }, [rootNodes, buildGraph, plannedNodes, selectedNode])

  // Custom node component
  const renderCustomNode = ({ nodeDatum, toggleNode }: any) => {
    const isPlanned = nodeDatum.attributes?.isPlanned === 'true'
    const isSelected = nodeDatum.attributes?.isSelected === 'true'
    const tags = nodeDatum.attributes?.tags?.split(', ').filter(Boolean) || []

    return (
      <g>
        {/* Node circle */}
        <circle
          r={20}
          className={`cursor-pointer transition-all duration-200 ${
            isSelected
              ? 'fill-primary stroke-primary stroke-2'
              : isPlanned
                ? 'fill-green-500 stroke-green-500 stroke-2'
                : 'fill-background stroke-border hover:fill-muted'
          }`}
          onClick={() => {
            const node = nodes.find(n => n.id === nodeDatum.attributes?.id)
            if (node) {
              onNodeClick(node)
            }
          }}
        />

        {/* Node text */}
        <text
          className="text-xs font-medium pointer-events-none"
          textAnchor="middle"
          dy="0.3em"
          fill={isSelected || isPlanned ? 'white' : 'currentColor'}
        >
          {nodeDatum.name.length > 8
            ? nodeDatum.name.substring(0, 8) + '...'
            : nodeDatum.name}
        </text>

        {/* Planning button */}
        <circle
          r={8}
          cx={15}
          cy={-15}
          className={`cursor-pointer transition-all duration-200 ${
            isPlanned
              ? 'fill-green-500 stroke-green-500'
              : 'fill-muted stroke-border hover:fill-primary hover:stroke-primary'
          }`}
          onClick={e => {
            e.stopPropagation()
            onNodePlan(nodeDatum.attributes?.id)
          }}
        >
          <title>{isPlanned ? 'Remove from plan' : 'Add to plan'}</title>
        </circle>

        {/* Planning indicator */}
        <text
          x={15}
          y={-15}
          className="text-xs font-bold pointer-events-none"
          textAnchor="middle"
          dy="0.3em"
          fill="white"
        >
          {isPlanned ? '✓' : '+'}
        </text>

        {/* Expand/collapse button for nodes with children */}
        {nodeDatum.children && (
          <circle
            r={6}
            cx={-15}
            cy={-15}
            className="fill-muted stroke-border cursor-pointer hover:fill-primary hover:stroke-primary"
            onClick={toggleNode}
          >
            <title>{nodeDatum.__rd3t.collapsed ? 'Expand' : 'Collapse'}</title>
          </circle>
        )}

        {/* Expand/collapse indicator */}
        {nodeDatum.children && (
          <text
            x={-15}
            y={-15}
            className="text-xs font-bold pointer-events-none"
            textAnchor="middle"
            dy="0.3em"
            fill="currentColor"
          >
            {nodeDatum.__rd3t.collapsed ? '+' : '−'}
          </text>
        )}
      </g>
    )
  }

  if (!treeData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No destiny nodes found</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <style>
        {`
          .rd3t-link {
            stroke: hsl(var(--border)) !important;
            stroke-width: 2px !important;
          }
        `}
      </style>
      <Tree
        data={treeData}
        orientation="vertical"
        pathFunc="step"
        translate={{ x: 400, y: 50 }}
        separation={{ siblings: 2, nonSiblings: 2.5 }}
        nodeSize={{ x: 200, y: 100 }}
        renderCustomNodeElement={renderCustomNode}
        onNodeClick={(nodeDatum: any) => {
          const node = nodes.find(n => n.id === nodeDatum.attributes?.id)
          if (node) {
            onNodeClick(node)
          }
        }}
      />
    </div>
  )
}
