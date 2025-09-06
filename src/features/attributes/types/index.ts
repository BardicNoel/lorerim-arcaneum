export type AttributeType = 'health' | 'stamina' | 'magicka'

export interface AttributeAssignments {
  health: number
  stamina: number
  magicka: number
  level: number
  // Removed: assignments: Record<number, AttributeType>
}

export interface AttributeStats {
  base: number
  assigned: number
  total: number
  ratio: number
}

export interface AttributeDisplayData {
  health: AttributeStats
  stamina: AttributeStats
  magicka: AttributeStats
}
