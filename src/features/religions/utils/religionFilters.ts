import type { Religion } from '../types'
import type { BlessingOption, DeityOption } from '../types/selection'
import { mapSharedReligionToFeatureReligion } from './religionMapper'

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
  const blessingEffects =
    religion.blessing?.effects
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
export function getDeityOptions(
  religions: Religion[] | undefined | null
): DeityOption[] {
  if (!religions) return []
  return religions.map(religionToDeityOption)
}

/**
 * Get all blessing options from religions
 */
export function getBlessingOptions(
  religions: Religion[] | undefined | null
): BlessingOption[] {
  if (!religions || religions.length === 0) {
    return []
  }

  // Transform to feature format like the religion page does
  const featureReligions = religions.map(mapSharedReligionToFeatureReligion)

  // Use the same filter as the religion page - filter out effects with type "1" and "3"
  const religionsWithBlessings = featureReligions.filter(religion => {
    if (!religion.blessing || !religion.blessing.effects) return false

    // Filter out effects with type "1" and "3" (same as religion page)
    const validEffects = religion.blessing.effects.filter(
      effect => effect.effectType !== '1' && effect.effectType !== '3'
    )

    return validEffects.length > 0
  })

  return religionsWithBlessings.map(religionToBlessingOption)
}

/**
 * Find a religion by ID
 */
export function findReligionById(
  religions: Religion[] | undefined | null,
  id: string
): Religion | undefined {
  if (!religions || !id) return undefined
  return religions.find(
    religion => religion.name.toLowerCase().replace(/\s+/g, '-') === id
  )
}
