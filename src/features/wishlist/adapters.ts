import type { WishlistItem } from './store'

export interface PerkData {
  id: string
  name: string
  description: string
  category: string
  tier: number
  prerequisites: string[]
  effects: Array<{
    type: string
    value: number
    target: string
  }>
}

export interface RaceData {
  id: string
  name: string
  description: string
  traits: Array<{
    name: string
    description: string
    effect: {
      type: string
      value?: number
      target?: string
      name?: string
      cooldown?: number
    }
  }>
  startingStats: {
    health: number
    mana: number
    stamina: number
    strength: number
    intelligence: number
    agility: number
  }
}

export interface TraitData {
  id: string
  name: string
  description: string
  category: string
  type: string
  effects: Array<{
    type: string
    value: number
    target: string
    condition?: string
  }>
  compatibility: string[]
}

export const adaptPerkToWishlistItem = (perk: PerkData): WishlistItem => ({
  id: perk.id,
  name: perk.name,
  description: perk.description,
  category: perk.category,
  type: 'perk',
})

export const adaptRaceToWishlistItem = (race: RaceData): WishlistItem => ({
  id: race.id,
  name: race.name,
  description: race.description,
  category: 'race',
  type: 'race',
})

export const adaptTraitToWishlistItem = (trait: TraitData): WishlistItem => ({
  id: trait.id,
  name: trait.name,
  description: trait.description,
  category: trait.category,
  type: 'trait',
})

export const adaptDataToWishlistItems = {
  perks: (perks: PerkData[]) => perks.map(adaptPerkToWishlistItem),
  races: (races: RaceData[]) => races.map(adaptRaceToWishlistItem),
  traits: (traits: TraitData[]) => traits.map(adaptTraitToWishlistItem),
}
