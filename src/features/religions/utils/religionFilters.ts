import type { Religion } from '../types'
import type { DeityOption, BlessingOption } from '../types/selection'

/**
 * Transform a Religion into a DeityOption for deity selection
 */
export function religionToDeityOption(religion: Religion): DeityOption {
  return {
    id: religion.name.toLowerCase().replace(/\s+/g, '-'),
    name: religion.name,
    type: religion.type,
    description: religion.tenet?.description || '',
    tenetDescription: religion.tenet?.description || '',
    followerPower: religion.boon1?.spellName || '',
    devoteePower: religion.boon2?.spellName || '',
    favoredRaces: religion.favoredRaces || [],
    worshipRestrictions: religion.worshipRestrictions || [],
    originalReligion: religion,
  }
}

/**
 * Transform a Religion into a BlessingOption for blessing selection
 */
export function religionToBlessingOption(religion: Religion): BlessingOption {
  const blessingEffects = religion.blessing?.effects
    ?.filter(effect => effect.effectType !== '1' && effect.effectType !== '3')
    .map(effect => ({
      name: effect.effectName,
      description: effect.effectDescription,
      magnitude: effect.magnitude,
      duration: effect.duration,
    })) || []

  return {
    id: religion.name.toLowerCase().replace(/\s+/g, '-'),
    name: religion.name,
    type: religion.type,
    blessingName: religion.blessing?.spellName || '',
    blessingDescription: blessingEffects.map(e => e.description).join(' '),
    effects: blessingEffects,
    originalReligion: religion,
  }
}

/**
 * Get all deity options from religions
 */
export function getDeityOptions(religions: Religion[]): DeityOption[] {
  return religions.map(religionToDeityOption)
}

/**
 * Get all blessing options from religions
 */
export function getBlessingOptions(religions: Religion[]): BlessingOption[] {
  return religions
    .filter(religion => religion.blessing?.effects?.some(effect => 
      effect.effectType !== '1' && effect.effectType !== '3'
    ))
    .map(religionToBlessingOption)
}

/**
 * Find a religion by ID
 */
export function findReligionById(religions: Religion[], id: string): Religion | undefined {
  return religions.find(religion => 
    religion.name.toLowerCase().replace(/\s+/g, '-') === id
  )
} 