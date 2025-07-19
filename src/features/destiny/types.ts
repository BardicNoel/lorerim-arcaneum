export interface DestinyNode {
  id: string
  name: string
  description: string
  icon?: string
  tags: string[]
  prerequisites: string[]
  nextBranches?: string[] // Optional since we calculate this dynamically in the tree view
  levelRequirement?: number
  lore?: string
  globalFormId?: string
}

export interface DestinyFilters {
  search: string
  type: string
  tags: string[]
  levelRequirement?: number
}

export interface PlannedNode {
  id: string
  name: string
  description: string
  levelRequirement?: number
}

export interface DestinyTreeData {
  nodes: DestinyNode[]
  plannedNodes: PlannedNode[]
}
