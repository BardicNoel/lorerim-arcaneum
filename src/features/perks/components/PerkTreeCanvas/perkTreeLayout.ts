import type { PerkRecord, LayoutConfig, LayoutNode } from './PerkTreeLayoutTypes'
import {
  findConnectedComponents,
  buildTreeMap,
  centerSubtrees,
  resolveCollisions,
  snapYToGrid,
} from './perkTreeLayoutUtils'

// Main layout function
export function layoutPerkTree(
  perks: PerkRecord[],
  config: LayoutConfig
): LayoutNode[] {
  try {
    if (perks.length === 0) return []
    // 1. Identify trees (connected components)
    const trees = findConnectedComponents(perks)
    // 2. For each tree, calculate depths and build hierarchy
    const treeHierarchies = trees.map(treePerks => buildTreeHierarchy(treePerks))
    // 3. Layout each tree
    const treeLayouts = treeHierarchies.map((hierarchy) => layoutSingleTree(hierarchy, config))
    // 4. Position trees as siblings with spacing
    const finalNodes = positionTreesAsSiblings(treeLayouts, config)
    // 5. Apply mild forces for natural spacing
    const forceAdjustedNodes = applyMildForces(finalNodes, config)
    return forceAdjustedNodes
  } catch (error) {
    // Fallback to simple positioning if algorithm fails
    return perks.map(perk => ({
      id: perk.edid,
      x: 0,
      y: 0,
      width: config.nodeWidth,
      height: config.nodeHeight,
      originalX: 0,
      originalY: 0,
    }))
  }
}

export function buildTreeHierarchy(treePerks: PerkRecord[]) {
  interface HierarchyNode {
    perk: PerkRecord
    depth: number
    children: string[]
    parents: string[]
    x: number
    y: number
    width: number
  }
  const nodes = new Map<string, HierarchyNode>()
  treePerks.forEach(perk => {
    nodes.set(perk.edid, {
      perk,
      depth: -1,
      children: perk.connection.children,
      parents: perk.connection.parents,
      x: 0,
      y: 0,
      width: 0,
    })
  })
  const roots: string[] = []
  nodes.forEach((node, id) => {
    if (node.parents.length === 0) roots.push(id)
  })
  // Calculate depths using BFS from roots
  const queue: { id: string; depth: number }[] = roots.map(id => ({ id, depth: 0 }))
  const visited = new Set<string>()
  while (queue.length > 0) {
    const { id, depth } = queue.shift()!
    if (visited.has(id)) continue
    visited.add(id)
    const node = nodes.get(id)
    if (node) {
      if (node.depth === -1 || depth < node.depth) node.depth = depth
      node.children.forEach(childId => {
        if (nodes.has(childId) && !visited.has(childId)) {
          queue.push({ id: childId, depth: depth + 1 })
        }
      })
    }
  }
  // Second pass: Handle nodes with multiple parents at different levels
  let hasChanges = true
  let iteration = 0
  while (hasChanges && iteration < 10) {
    hasChanges = false
    iteration++
    nodes.forEach((node, nodeId) => {
      if (node.parents.length > 1) {
        const parentDepths = node.parents
          .map(parentId => {
            const parent = nodes.get(parentId)
            return parent ? parent.depth : -1
          })
          .filter(depth => depth !== -1)
        if (parentDepths.length > 0) {
          const minParentDepth = Math.min(...parentDepths)
          const expectedDepth = minParentDepth + 1
          if (node.depth !== expectedDepth) {
            node.depth = expectedDepth
            hasChanges = true
          }
        }
      }
    })
  }
  // Third pass: Ensure all children are at higher depth than their parents
  nodes.forEach((node, nodeId) => {
    node.children.forEach(childId => {
      const child = nodes.get(childId)
      if (child && child.depth <= node.depth) {
        const newDepth = node.depth + 1
        child.depth = newDepth
      }
    })
  })
  return { nodes, roots }
}

export function layoutSingleTree(
  hierarchy: { nodes: Map<string, any>; roots: string[] },
  config: LayoutConfig
): LayoutNode[] {
  const { nodes, roots } = hierarchy
  // Convert hierarchy nodes to layout nodes
  const layoutNodes: LayoutNode[] = []
  nodes.forEach((hierarchyNode, id) => {
    layoutNodes.push({
      id,
      x: 0,
      y: 0,
      width: config.nodeWidth,
      height: config.nodeHeight,
      originalX: 0,
      originalY: 0,
      children: hierarchyNode.children,
    })
  })
  // Check for circular references by attempting to calculate subtree widths
  const hasCircularReferences = layoutNodes.some(node => {
    try {
      calculateSubtreeWidth(node.id, nodes, config, new Set<string>())
      return false
    } catch (error) {
      return true
    }
  })
  if (hasCircularReferences) {
    layoutNodes.forEach(node => {
      const hierarchyNode = nodes.get(node.id)
      if (hierarchyNode && hierarchyNode.perk) {
        const originalX = hierarchyNode.perk.position.x * config.gridScaleX
        const originalY = -hierarchyNode.perk.position.y * config.gridScaleY
        node.x = originalX
        node.y = originalY
        node.originalX = originalX
        node.originalY = originalY
      }
    })
    applyCircularTreeForces(layoutNodes, config)
    return layoutNodes
  }
  // Proceed with hierarchical layout if no circular references
  const rootNodes = layoutNodes.filter(node => {
    const hasParentInTree = layoutNodes.some(
      other => other.id !== node.id && other.children?.includes(node.id)
    )
    return !hasParentInTree
  })
  rootNodes.forEach(node => {
    node.y = 0
    node.originalY = 0
  })
  const visited = new Set<string>()
  const queue: { node: LayoutNode; depth: number }[] = rootNodes.map(node => ({ node, depth: 0 }))
  while (queue.length > 0) {
    const { node, depth } = queue.shift()!
    if (visited.has(node.id)) continue
    visited.add(node.id)
    if (depth > 0) {
      node.y = -depth * config.verticalSpacing
      node.originalY = node.y
    }
    if (node.children) {
      node.children.forEach(childId => {
        const childNode = layoutNodes.find(n => n.id === childId)
        if (childNode && !visited.has(childId)) {
          queue.push({ node: childNode, depth: depth + 1 })
        }
      })
    }
  }
  // Center children on their immediate parents
  const nodesByDepth = new Map<number, LayoutNode[]>()
  layoutNodes.forEach(node => {
    const depth = Math.round(node.y / config.verticalSpacing)
    if (!nodesByDepth.has(depth)) nodesByDepth.set(depth, [])
    nodesByDepth.get(depth)!.push(node)
  })
  const depths = Array.from(nodesByDepth.keys()).sort((a, b) => b - a)
  depths.forEach(depth => {
    const nodesAtDepth = nodesByDepth.get(depth)!
    nodesAtDepth.forEach(node => {
      if (node.children) {
        const childrenByParent = new Map<string, LayoutNode[]>()
        node.children.forEach(childId => {
          const childNode = layoutNodes.find(n => n.id === childId)
          if (childNode) {
            const immediateParents = layoutNodes.filter(
              n => n.children?.includes(childId) && Math.abs(n.y - childNode.y) === config.verticalSpacing
            )
            if (immediateParents.length > 0) {
              if (immediateParents.some(p => p.id === node.id)) {
                if (!childrenByParent.has(node.id)) childrenByParent.set(node.id, [])
                childrenByParent.get(node.id)!.push(childNode)
              }
            }
          }
        })
        childrenByParent.forEach((children, parentId) => {
          if (children.length > 0) {
            const parentNode = layoutNodes.find(n => n.id === parentId)
            if (parentNode) {
              const childPositions = children.map(child => {
                const subtreeWidth = calculateSubtreeWidth(child.id, nodes, config)
                return { child, subtreeWidth }
              })
              const totalWidth = childPositions.reduce((sum, { subtreeWidth }) => sum + subtreeWidth, 0)
              const spacing = (children.length - 1) * config.horizontalSpacing
              const totalNeeded = totalWidth + spacing
              let currentX = parentNode.x - totalNeeded / 2
              childPositions.forEach(({ child, subtreeWidth }) => {
                child.x = currentX + subtreeWidth / 2
                child.originalX = child.x
                currentX += subtreeWidth + config.horizontalSpacing
              })
            }
          }
        })
      }
    })
  })
  applyMildForces(layoutNodes, config)
  return layoutNodes
}

export function applyMildForces(
  layoutNodes: LayoutNode[],
  config: LayoutConfig
): LayoutNode[] {
  const forceStrength = 0.03
  const attractionStrength = 0.02
  const minDistance = config.horizontalSpacing * 0.4
  const originalPositions = new Map<string, { x: number; y: number }>()
  layoutNodes.forEach(node => {
    originalPositions.set(node.id, { x: node.x, y: node.y })
  })
  for (let iteration = 0; iteration < 5; iteration++) {
    let totalForceApplied = 0
    for (let i = 0; i < layoutNodes.length; i++) {
      for (let j = i + 1; j < layoutNodes.length; j++) {
        const nodeA = layoutNodes[i]
        const nodeB = layoutNodes[j]
        const centerAX = nodeA.x + config.nodeWidth * 0.5
        const centerAY = nodeA.y + config.nodeHeight * 0.5
        const centerBX = nodeB.x + config.nodeWidth * 0.5
        const centerBY = nodeB.y + config.nodeHeight * 0.5
        const deltaX = centerBX - centerAX
        const deltaY = centerBY - centerAY
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        if (distance < minDistance && distance > 0) {
          const forceX = (deltaX / distance) * forceStrength
          const forceY = (deltaY / distance) * forceStrength
          nodeA.x -= forceX
          nodeA.y -= forceY
          nodeB.x += forceX
          nodeB.y += forceY
          totalForceApplied++
        }
      }
    }
    if (totalForceApplied === 0) break
  }
  layoutNodes.forEach(node => {
    const original = originalPositions.get(node.id)
    if (!original) return
    const deltaX = original.x - node.x
    const deltaY = original.y - node.y
    const newX = node.x + deltaX * attractionStrength
    const newY = node.y + deltaY * attractionStrength
    const depth = Math.round(original.y / config.verticalSpacing)
    const expectedY = depth * config.verticalSpacing
    const finalY = Math.max(newY, expectedY)
    node.x = newX
    node.y = finalY
    node.originalX = newX
    node.originalY = finalY
  })
  return layoutNodes
}

export function applyCircularTreeForces(
  layoutNodes: LayoutNode[],
  config: LayoutConfig
): LayoutNode[] {
  const forceStrength = 0.08
  const attractionStrength = 0.03
  const minVerticalSeparation = config.nodeHeight * 0.8
  const maxIterations = 50
  const originalPositions = new Map<string, { x: number; y: number }>()
  layoutNodes.forEach(node => {
    originalPositions.set(node.id, { x: node.x, y: node.y })
  })
  let iteration = 0
  let totalTouching = 1
  while (totalTouching > 0 && iteration < maxIterations) {
    iteration++
    totalTouching = 0
    for (let i = 0; i < layoutNodes.length; i++) {
      for (let j = i + 1; j < layoutNodes.length; j++) {
        const nodeA = layoutNodes[i]
        const nodeB = layoutNodes[j]
        const overlapX = Math.max(0, Math.min(nodeA.x + config.nodeWidth, nodeB.x + config.nodeWidth) - Math.max(nodeA.x, nodeB.x))
        const overlapY = Math.max(0, Math.min(nodeA.y + config.nodeHeight, nodeB.y + config.nodeHeight) - Math.max(nodeA.y, nodeB.y))
        const centerAY = nodeA.y + config.nodeHeight * 0.5
        const centerBY = nodeB.y + config.nodeHeight * 0.5
        const verticalDistance = Math.abs(centerBY - centerAY)
        const needsVerticalSeparation = verticalDistance < minVerticalSeparation
        if ((overlapX > 0 && overlapY > 0) || needsVerticalSeparation) {
          totalTouching++
          let forceY = 0
          if (overlapX > 0 && overlapY > 0) {
            forceY = overlapY * forceStrength
          } else if (needsVerticalSeparation) {
            const separationNeeded = minVerticalSeparation - verticalDistance
            forceY = separationNeeded * forceStrength
          }
          if (nodeA.y < nodeB.y) {
            nodeA.y -= forceY
            nodeB.y += forceY
          } else {
            nodeA.y += forceY
            nodeB.y -= forceY
          }
        }
      }
    }
    if (totalTouching === 0) break
  }
  layoutNodes.forEach(node => {
    const original = originalPositions.get(node.id)
    if (!original) return
    const deltaY = original.y - node.y
    const newY = node.y + deltaY * attractionStrength
    node.y = newY
    node.originalY = newY
  })
  return layoutNodes
}

export function positionTreesAsSiblings(
  treeLayouts: LayoutNode[][],
  config: LayoutConfig
): LayoutNode[] {
  const allNodes: LayoutNode[] = []
  const treeAnalyses = treeLayouts.map((treeNodes) => {
    const maxY = Math.max(...treeNodes.map(n => n.y))
    const rootNodes = treeNodes.filter(n => Math.abs(n.y - maxY) < 1)
    const rootXs = rootNodes.map(n => n.x)
    const minRootX = Math.min(...rootXs)
    const maxRootX = Math.max(...rootXs)
    const rootWidth = maxRootX - minRootX
    const rootCenterX = rootXs.reduce((sum, x) => sum + x, 0) / rootXs.length
    const minX = Math.min(...treeNodes.map(n => n.x))
    const maxX = Math.max(...treeNodes.map(n => n.x + n.width))
    const treeWidth = maxX - minX
    return {
      treeNodes,
      rootNodes,
      minRootX,
      maxRootX,
      rootWidth,
      rootCenterX,
      minX,
      maxX,
      treeWidth,
    }
  })
  const allMinRootX = Math.min(...treeAnalyses.map(t => t.minRootX))
  const allMaxRootX = Math.max(...treeAnalyses.map(t => t.maxRootX))
  const totalRootWidth = allMaxRootX - allMinRootX
  let currentX = 0
  treeAnalyses.forEach((analysis) => {
    const scaleFactor = totalRootWidth > 0 ? analysis.rootWidth / totalRootWidth : 1
    const rootOffset = analysis.minRootX - allMinRootX
    const offsetX = currentX - analysis.minX + rootOffset * scaleFactor
    analysis.treeNodes.forEach(node => {
      const relativeToRoot = node.x - analysis.minRootX
      const scaledRelative = relativeToRoot * scaleFactor
      const finalX = currentX + scaledRelative
      allNodes.push({
        ...node,
        x: finalX,
        originalX: finalX,
      })
    })
    currentX += analysis.treeWidth * scaleFactor + config.horizontalSpacing
  })
  return allNodes
}

export function calculateSubtreeWidth(
  perkId: string,
  nodes: Map<string, any>,
  config: LayoutConfig,
  visited: Set<string> = new Set()
): number {
  if (visited.has(perkId)) {
    throw new Error(`Circular reference detected for perkId: ${perkId}`)
  }
  const perkNode = nodes.get(perkId)
  if (!perkNode) return config.nodeWidth
  visited.add(perkId)
  const children = perkNode.children || []
  const childSubtreeWidths = children.map((childId: string) =>
    calculateSubtreeWidth(childId, nodes, config, new Set(visited))
  )
  if (childSubtreeWidths.length === 0) {
    return config.nodeWidth
  }
  let totalWidth = 0
  childSubtreeWidths.forEach((width: number, index: number) => {
    totalWidth += width
    if (index < children.length - 1) {
      totalWidth += config.horizontalSpacing
    }
  })
  return Math.max(totalWidth, config.nodeWidth)
}

export function convertToPerkRecords(tree: any): PerkRecord[] {
  return tree.perks.map((perk: any) => ({
    edid: perk.edid,
    name: perk.name,
    position: perk.position,
    connection: perk.connections,
  }))
} 