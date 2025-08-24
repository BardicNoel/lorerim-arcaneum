export interface HydratedBuildData {
  name: string
  notes: string
  race: { name: string; effects?: string }
  birthSign: { name: string; effects: string }
  traits: Array<{ name: string; effects: string; type: 'regular' | 'bonus' }>
  religion: {
    name: string
    effects: string
    tenets?: string
    followerBoon?: string
    devoteeBoon?: string
  }
  favoriteBlessing: {
    name: string
    effects: string
    source: string
  }
  skills: {
    major: Array<{ name: string; level?: number }>
    minor: Array<{ name: string; level?: number }>
    other: Array<{ name: string; level?: number }>
  }
  perks: Array<{
    skillName: string
    perks: Array<{ name: string; effects: string; rank?: number }>
  }>
  destinyPath: Array<{ name: string; effects?: string }>
  tags: string[]
  // NEW: Attribute assignments
  attributes: {
    level: number
    health: number
    stamina: number
    magicka: number
    healthLevels: number
    staminaLevels: number
    magickaLevels: number
    totalPoints: number
  }
}
