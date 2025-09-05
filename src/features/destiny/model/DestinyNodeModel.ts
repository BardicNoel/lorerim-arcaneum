import type { DestinyNode } from '../types'

export class DestinyNodeModel {
  /**
   * Validate if a node has all required fields
   */
  static isValid(node: any): node is DestinyNode {
    return (
      typeof node === 'object' &&
      node !== null &&
      typeof node.id === 'string' &&
      typeof node.name === 'string' &&
      typeof node.description === 'string' &&
      Array.isArray(node.tags) &&
      Array.isArray(node.prerequisites)
    )
  }

  /**
   * Check if two nodes are equal by ID
   */
  static equals(node1: DestinyNode, node2: DestinyNode): boolean {
    return node1.id === node2.id
  }

  /**
   * Check if a node has a specific tag
   */
  static hasTag(node: DestinyNode, tag: string): boolean {
    return node.tags.includes(tag)
  }

  /**
   * Check if a node has any of the specified tags
   */
  static hasAnyTag(node: DestinyNode, tags: string[]): boolean {
    return tags.some(tag => this.hasTag(node, tag))
  }

  /**
   * Check if a node has all of the specified tags
   */
  static hasAllTags(node: DestinyNode, tags: string[]): boolean {
    return tags.every(tag => this.hasTag(node, tag))
  }

  /**
   * Get nodes that have a specific tag
   */
  static filterByTag(nodes: DestinyNode[], tag: string): DestinyNode[] {
    return nodes.filter(node => this.hasTag(node, tag))
  }

  /**
   * Get nodes that have any of the specified tags
   */
  static filterByAnyTag(nodes: DestinyNode[], tags: string[]): DestinyNode[] {
    return nodes.filter(node => this.hasAnyTag(node, tags))
  }

  /**
   * Get nodes that have all of the specified tags
   */
  static filterByAllTags(nodes: DestinyNode[], tags: string[]): DestinyNode[] {
    return nodes.filter(node => this.hasAllTags(node, tags))
  }

  /**
   * Check if a node is a root node (no prerequisites)
   */
  static isRootNode(node: DestinyNode): boolean {
    return node.prerequisites.length === 0
  }

  /**
   * Get all root nodes from a list
   */
  static getRootNodes(nodes: DestinyNode[]): DestinyNode[] {
    return nodes.filter(node => this.isRootNode(node))
  }

  /**
   * Check if a node is a leaf node (no other nodes depend on it)
   */
  static isLeafNode(node: DestinyNode, allNodes: DestinyNode[]): boolean {
    return !allNodes.some(otherNode =>
      otherNode.prerequisites.includes(node.edid)
    )
  }

  /**
   * Get all leaf nodes from a list
   */
  static getLeafNodes(nodes: DestinyNode[]): DestinyNode[] {
    return nodes.filter(node => this.isLeafNode(node, nodes))
  }

  /**
   * Get nodes that have a specific node as a prerequisite
   */
  static getNextNodes(
    node: DestinyNode,
    allNodes: DestinyNode[]
  ): DestinyNode[] {
    return allNodes.filter(otherNode =>
      otherNode.prerequisites.includes(node.edid)
    )
  }

  /**
   * Get nodes that are prerequisites for a specific node
   */
  static getPrerequisiteNodes(
    node: DestinyNode,
    allNodes: DestinyNode[]
  ): DestinyNode[] {
    return allNodes.filter(otherNode =>
      node.prerequisites.includes(otherNode.edid)
    )
  }

  /**
   * Search nodes by name or description
   */
  static search(nodes: DestinyNode[], query: string): DestinyNode[] {
    const lowerQuery = query.toLowerCase()
    return nodes.filter(
      node =>
        node.name.toLowerCase().includes(lowerQuery) ||
        node.description.toLowerCase().includes(lowerQuery) ||
        node.tags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Sort nodes by name
   */
  static sortByName(nodes: DestinyNode[]): DestinyNode[] {
    return [...nodes].sort((a, b) => a.name.localeCompare(b.name))
  }

  /**
   * Sort nodes by number of prerequisites (ascending)
   */
  static sortByPrerequisites(nodes: DestinyNode[]): DestinyNode[] {
    return [...nodes].sort(
      (a, b) => a.prerequisites.length - b.prerequisites.length
    )
  }

  /**
   * Get unique tags from a list of nodes
   */
  static getUniqueTags(nodes: DestinyNode[]): string[] {
    const allTags = nodes.flatMap(node => node.tags)
    return [...new Set(allTags)].sort()
  }

  /**
   * Get unique prerequisites from a list of nodes
   */
  static getUniquePrerequisites(nodes: DestinyNode[]): string[] {
    const allPrerequisites = nodes.flatMap(node => node.prerequisites)
    return [...new Set(allPrerequisites)].sort()
  }
}
