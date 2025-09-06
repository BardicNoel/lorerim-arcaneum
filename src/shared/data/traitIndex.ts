/**
 * Trait Index System
 *
 * Maps trait EDIDs to compact numeric indexes for URL compression.
 * This reduces trait references from ~30 characters to 1-2 characters.
 */

// Trait EDID to index mapping
export const TRAIT_INDEX: Record<string, number> = {
  // Magic traits
  LoreTraits_AcousticArcanistAb: 0,
  LoreTraits_ArcaneScholarAb: 1,
  LoreTraits_ArcaneTheurgeAb: 2,
  LoreTraits_ArcanistAb: 3,
  LoreTraits_ArtificerAb: 4,
  LoreTraits_BloodMageAb: 5,
  LoreTraits_ChronomancerAb: 6,
  LoreTraits_ConjurerAb: 7,
  LoreTraits_DivinerAb: 8,
  LoreTraits_ElementalistAb: 9,
  LoreTraits_EnchanterAb: 10,
  LoreTraits_GeomancerAb: 11,
  LoreTraits_HydromancerAb: 12,
  LoreTraits_IllusionistAb: 13,
  LoreTraits_MageAb: 14,
  LoreTraits_MysticAb: 15,
  LoreTraits_NecromancerAb: 16,
  LoreTraits_PyromancerAb: 17,
  LoreTraits_RitualistAb: 18,
  LoreTraits_RuneMasterAb: 19,
  LoreTraits_ShamanAb: 20,
  LoreTraits_SpellswordAb: 21,
  LoreTraits_SummonerAb: 22,
  LoreTraits_ThaumaturgeAb: 23,
  LoreTraits_WarlockAb: 24,
  LoreTraits_WitchAb: 25,
  LoreTraits_WizardAb: 26,

  // Combat traits
  Traits_AdrenalineRushAb: 27,
  Traits_AnglerAb: 28,
  Traits_ArcherAb: 29,
  Traits_BarbarianAb: 30,
  Traits_BerserkerAb: 31,
  Traits_BlademasterAb: 32,
  Traits_BrawlerAb: 33,
  Traits_ChampionAb: 34,
  Traits_DefenderAb: 35,
  Traits_DuelistAb: 36,
  Traits_ExecutionerAb: 37,
  Traits_FighterAb: 38,
  Traits_GladiatorAb: 39,
  Traits_GuardianAb: 40,
  Traits_HunterAb: 41,
  Traits_KnightAb: 42,
  Traits_MarksmanAb: 43,
  Traits_MercenaryAb: 44,
  Traits_PaladinAb: 45,
  Traits_RangerAb: 46,
  Traits_SoldierAb: 47,
  Traits_SwordsmanAb: 48,
  Traits_TacticianAb: 49,
  Traits_VanguardAb: 50,
  Traits_WarriorAb: 51,
  Traits_WeaponmasterAb: 52,

  // Stealth traits
  Traits_AssassinAb: 53,
  Traits_BanditAb: 54,
  Traits_BurglarAb: 55,
  Traits_CatBurglarAb: 56,
  Traits_CutpurseAb: 57,
  Traits_InfiltratorAb: 58,
  Traits_NinjaAb: 59,
  Traits_PickpocketAb: 60,
  Traits_PoisonerAb: 61,
  Traits_RogueAb: 62,
  Traits_ScoutAb: 63,
  Traits_ShadowAb: 64,
  Traits_SneakAb: 65,
  Traits_SpyAb: 66,
  Traits_ThiefAb: 67,
  Traits_TricksterAb: 68,

  // Special traits
  Traits_MasterofDestinyAb: 69,
  Traits_SkilledAb: 70,
  Traits_SoulEmbedAb: 71,
  Traits_NosferatuAb: 72,
  Traits_VampireAb: 73,
  Traits_WerewolfAb: 74,
  Traits_DragonbornAb: 75,
  Traits_ChosenAb: 76,
  Traits_ProphetAb: 77,
  Traits_SaintAb: 78,
  Traits_HeroAb: 79,
  Traits_LegendAb: 80,
} as const

// Reverse mapping: index to EDID
export const TRAIT_INDEX_REVERSE: Record<number, string> = Object.fromEntries(
  Object.entries(TRAIT_INDEX).map(([edid, index]) => [index, edid])
)

/**
 * Convert trait EDID to index
 */
export function traitToIndex(edid: string): number | undefined {
  return TRAIT_INDEX[edid]
}

/**
 * Convert trait index to EDID
 */
export function traitFromIndex(index: number): string | undefined {
  return TRAIT_INDEX_REVERSE[index]
}

/**
 * Convert array of trait EDIDs to indexes
 */
export function traitsToIndexes(edids: string[]): number[] {
  return edids
    .map(edid => traitToIndex(edid))
    .filter((index): index is number => index !== undefined)
}

/**
 * Convert array of trait indexes to EDIDs
 */
export function traitsFromIndexes(indexes: number[]): string[] {
  return indexes
    .map(index => traitFromIndex(index))
    .filter((edid): edid is string => edid !== undefined)
}

/**
 * Get total number of traits in the index
 */
export function getTraitCount(): number {
  return Object.keys(TRAIT_INDEX).length
}
