import type { Religion, ReligionEffect, ReligionSpell, ReligionTenet } from '@/shared/data/schemas'

// Raw data interfaces from the new JSON files
interface RawReligionEffect {
  effectName: string
  effectDescription: string
  magnitude: number
  duration: number
  area: number
  keywords: string[]
}

interface RawReligionSpell {
  spellName: string
  spellDescription: string
  effects: RawReligionEffect[]
}

interface RawReligionTenet {
  spellName: string
  description: string
  effects: RawReligionEffect[]
}

interface RawReligion {
  name: string
  domain: string
  boons: {
    boon1: RawReligionSpell
    boon2: RawReligionSpell
  }
  tenets: RawReligionTenet
  favoredRaces: string[]
}

interface RawBlessing {
  name: string
  domain: string
  blessing: RawReligionSpell
}

// Transform raw effect to ReligionEffect
function transformEffect(rawEffect: RawReligionEffect): ReligionEffect {
  return {
    effectName: rawEffect.effectName,
    effectDescription: rawEffect.effectDescription,
    magnitude: rawEffect.magnitude,
    duration: rawEffect.duration,
    area: rawEffect.area,
    effectType: '0', // Default effect type for gameplay effects
    targetAttribute: null,
    keywords: rawEffect.keywords || [],
  }
}

// Transform raw spell to ReligionSpell
function transformSpell(rawSpell: RawReligionSpell, spellId: string): ReligionSpell {
  return {
    spellId,
    spellName: rawSpell.spellName,
    effects: rawSpell.effects.map(transformEffect),
  }
}

// Transform raw tenet to ReligionTenet
function transformTenet(rawTenet: RawReligionTenet): ReligionTenet {
  return {
    spellId: rawTenet.spellName,
    spellName: rawTenet.spellName,
    header: rawTenet.spellName,
    description: rawTenet.description,
    effects: rawTenet.effects.map(transformEffect),
  }
}

// Transform raw religion data to Religion interface
export function transformReligionData(rawReligion: RawReligion): Religion {
  const id = rawReligion.name.toLowerCase().replace(/\s+/g, '-')
  
  return {
    id,
    name: rawReligion.name,
    type: rawReligion.domain,
    pantheon: rawReligion.domain,
    // Religion data doesn't have a separate blessing field, so we'll leave it undefined
    // The blessing will come from the blessing-data.json file
    blessing: undefined,
    boon1: transformSpell(rawReligion.boons.boon1, `${id}-boon1`),
    boon2: transformSpell(rawReligion.boons.boon2, `${id}-boon2`),
    tenet: transformTenet(rawReligion.tenets),
    favoredRaces: rawReligion.favoredRaces || [],
    worshipRestrictions: [], // Not provided in new data format
    tags: [
      rawReligion.domain,
      ...(rawReligion.favoredRaces || []),
    ].filter(Boolean),
  }
}

// Transform blessing data to Religion interface (for blessing-only view)
export function transformBlessingData(rawBlessing: RawBlessing): Religion {
  const id = rawBlessing.name.toLowerCase().replace(/\s+/g, '-')
  
  return {
    id,
    name: rawBlessing.name,
    type: rawBlessing.domain,
    pantheon: rawBlessing.domain,
    blessing: transformSpell(rawBlessing.blessing, `${id}-blessing`),
    favoredRaces: [], // Not provided in blessing data
    tags: [rawBlessing.domain],
  }
}

// Transform arrays of raw data
export function transformReligionDataArray(rawReligions: RawReligion[]): Religion[] {
  return rawReligions.map(transformReligionData)
}

export function transformBlessingDataArray(rawBlessings: RawBlessing[]): Religion[] {
  return rawBlessings.map(transformBlessingData)
}
