export interface BaseAttributes {
  health: number
  stamina: number
  magicka: number
}

export interface DerivedStat {
  name: string
  value: number
  isPercentage: boolean
  formula: string
  description: string
  category: 'combat' | 'survival' | 'movement' | 'magic'
}

export interface DerivedStatConfig {
  name: string
  isPercentage: boolean
  prefactor: number
  threshold: number
  weights: {
    health: number
    magicka: number
    stamina: number
  }
  description: string
  category: 'combat' | 'survival' | 'movement' | 'magic'
}

export interface DerivedStatsCalculation {
  baseAttributes: BaseAttributes
  derivedStats: DerivedStat[]
  sources: {
    race: string
    birthsign: string
    traits: string[]
    equipment: string[]
    religion: string
    destinyPath: string[]
    attributeAssignments: number
  }
}

export interface DataSources {
  races?: any[] // Will be properly typed when we add race data
}

