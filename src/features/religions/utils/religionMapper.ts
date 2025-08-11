import type { Religion as SharedReligion } from '@/shared/data/schemas'
import type { Religion as FeatureReligion } from '../types'

/**
 * Maps a shared Religion type to the feature Religion type
 */
export function mapSharedReligionToFeatureReligion(
  sharedReligion: SharedReligion
): FeatureReligion {
  return {
    name: sharedReligion.name,
    type: sharedReligion.type || sharedReligion.pantheon || 'Unknown',
    blessing: {
      spellId: sharedReligion.blessing?.spellId || '',
      spellName: sharedReligion.blessing?.spellName || '',
      effects: sharedReligion.blessing?.effects || [],
    },
    boon1: {
      spellId: sharedReligion.boon1?.spellId || '',
      spellName: sharedReligion.boon1?.spellName || '',
      effects: sharedReligion.boon1?.effects || [],
    },
    boon2: {
      spellId: sharedReligion.boon2?.spellId || '',
      spellName: sharedReligion.boon2?.spellName || '',
      effects: sharedReligion.boon2?.effects || [],
    },
    tenet: {
      spellId: sharedReligion.tenet?.spellId || '',
      spellName: sharedReligion.tenet?.spellName || '',
      header: sharedReligion.tenet?.header || '',
      description: sharedReligion.tenet?.description || '',
      effects: sharedReligion.tenet?.effects || [],
    },
    favoredRaces: sharedReligion.favoredRaces || [],
    worshipRestrictions: sharedReligion.worshipRestrictions || [],
  }
}

/**
 * Extracts a short description from a longer text by taking the first sentence
 */
export function extractShortDescription(text: string): string {
  if (!text) return ''

  // Split by sentence endings and take the first one
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  return sentences[0]?.trim() || text.substring(0, 100) + '...'
}

/**
 * Maps religion data to the new ReligionCard format
 */
export function mapReligionToCardFormat(
  religion: SharedReligion | FeatureReligion
): {
  id: string
  name: string
  category: string
  icon: string
  blessing: { name: string; short: string; full: string }
  effectsCount: number
  favoredRaces: Array<{ id: string; name: string; icon: string }>
  tenets: Array<{
    id: string
    icon?: string
    title: string
    short: string
    full?: string
  }>
  tags?: string[]
} {
  const blessingName = religion.blessing?.effects?.[0]?.effectName || 'Blessing'
  const blessingDescription =
    religion.blessing?.effects?.[0]?.effectDescription || ''

  // Calculate total effects count
  const effectsCount =
    (religion.blessing?.effects?.length || 0) +
    (religion.tenet?.effects?.length || 0) +
    (religion.boon1?.effects?.length || 0) +
    (religion.boon2?.effects?.length || 0)

  // Extract tenets from tenet effects
  const tenets = religion.tenet?.effects?.[0]?.effectDescription
    ? religion.tenet.effects[0].effectDescription
        .split('.')
        .filter(sentence => sentence.trim().length > 0)
        .map((tenet, index) => ({
          id: `tenet-${index}`,
          icon: 'shield',
          title: tenet.trim().split(' ').slice(0, 3).join(' ') + '...',
          short: tenet.trim(),
          full: tenet.trim(),
        }))
    : []

  return {
    id: religion.id || religion.name,
    name: religion.name,
    category: religion.type || religion.pantheon || 'Unknown',
    icon: religion.name.toLowerCase().replace(/\s+/g, '-'),
    blessing: {
      name: blessingName,
      short: extractShortDescription(blessingDescription),
      full: blessingDescription,
    },
    effectsCount,
    favoredRaces: (religion.favoredRaces || []).map(race => ({
      id: race.toLowerCase().replace(/\s+/g, '-'),
      name: race,
      icon: race.toLowerCase().replace(/\s+/g, '-'),
    })),
    tenets,
    tags: religion.tags || [],
  }
}
