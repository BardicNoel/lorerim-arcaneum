import type { Religion } from '../types'

export interface ReligionSelection {
  followedDeity: Religion | null
  blessingSource: Religion | null
}

export interface ReligionSelectionState {
  followedDeityId: string | null
  blessingSourceId: string | null
}

export interface DeityOption {
  id: string
  name: string
  type: string
  description: string
  tenetDescription: string
  followerPower: string
  devoteePower: string
  favoredRaces: string[]
  worshipRestrictions: string[]
  originalReligion: Religion
}

export interface BlessingOption {
  id: string
  name: string
  type: string
  blessingName: string
  blessingDescription: string
  effects: Array<{
    name: string
    description: string
    magnitude: number
    duration: number
  }>
  originalReligion: Religion
}
