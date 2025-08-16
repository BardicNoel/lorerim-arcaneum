// Define the interface locally to avoid import issues
interface DerivedStatConfig {
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

export const DERIVED_STATS_CONFIG: Record<string, DerivedStatConfig> = {
  magicResist: {
    name: 'Magic Resist',
    isPercentage: true,
    prefactor: 1.0,
    threshold: 150,
    weights: { health: 0, magicka: 1, stamina: 0 },
    description: 'Reduces incoming magical damage',
    category: 'survival',
  },
  magickaRegen: {
    name: 'Magicka Regen',
    isPercentage: true,
    prefactor: 8.0,
    threshold: 100,
    weights: { health: 0, magicka: 1, stamina: 0 },
    description: 'Increases magicka regeneration rate',
    category: 'magic',
  },
  diseaseResist: {
    name: 'Disease Resist',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 100,
    weights: { health: 0.4, magicka: 0, stamina: 0.6 },
    description: 'Reduces chance of contracting diseases',
    category: 'survival',
  },
  poisonResist: {
    name: 'Poison Resist',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 140,
    weights: { health: 0.6, magicka: 0, stamina: 0.4 },
    description: 'Reduces poison damage and effects',
    category: 'survival',
  },
  staminaRegen: {
    name: 'Stamina Regen',
    isPercentage: true,
    prefactor: 8.0,
    threshold: 100,
    weights: { health: 0, magicka: 0, stamina: 1 },
    description: 'Increases stamina regeneration rate',
    category: 'movement',
  },
  moveSpeed: {
    name: 'Move Speed',
    isPercentage: true,
    prefactor: 0.75,
    threshold: 125,
    weights: { health: 0.2, magicka: 0, stamina: 0.8 },
    description: 'Increases movement speed',
    category: 'movement',
  },
  carryWeight: {
    name: 'Carry Weight',
    isPercentage: false,
    prefactor: 4.0,
    threshold: 110,
    weights: { health: 0.8, magicka: 0, stamina: 0.2 },
    description: 'Increases maximum carry capacity',
    category: 'survival',
  },
  rangedDamage: {
    name: 'Ranged Damage',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 150,
    weights: { health: 0.2, magicka: 0, stamina: 0.8 },
    description: 'Increases ranged weapon damage',
    category: 'combat',
  },
  oneHandDamage: {
    name: 'One-Hand Damage',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 150,
    weights: { health: 0.5, magicka: 0, stamina: 0.5 },
    description: 'Increases one-handed weapon damage',
    category: 'combat',
  },
  twoHandDamage: {
    name: 'Two-Hand Damage',
    isPercentage: true,
    prefactor: 4.0,
    threshold: 150,
    weights: { health: 0.8, magicka: 0, stamina: 0.2 },
    description: 'Increases two-handed weapon damage',
    category: 'combat',
  },
  unarmedDamage: {
    name: 'Unarmed Damage',
    isPercentage: false,
    prefactor: 4.5,
    threshold: 125,
    weights: { health: 0.5, magicka: 0, stamina: 0.5 },
    description: 'Increases unarmed combat damage',
    category: 'combat',
  },
}
