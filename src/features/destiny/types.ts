export interface DestinyNode {
  id: string
  edid: string // Unique editor ID for node relationships
  name: string
  description: string
  icon?: string
  tags: string[]
  prerequisites: string[] // Will now be EDIDs
  nextBranches?: string[] // Optional since we calculate this dynamically in the tree view
  levelRequirement?: number
  lore?: string
  globalFormId?: string
}
