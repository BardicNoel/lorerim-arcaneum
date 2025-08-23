export const RACE_NAME_TO_EDID: Record<string, string> = {
  Argonian: 'ArgonianRace',
  Breton: 'BretonRace',
  Dunmer: 'DarkElfRace',
  Altmer: 'HighElfRace',
  Imperial: 'ImperialRace',
  Khajiit: 'KhajiitRace',
  Nord: 'NordRace',
  Orsimer: 'OrcRace',
  Redguard: 'RedguardRace',
  Bosmer: 'WoodElfRace',
}

export function getRaceEdid(raceName: string): string {
  return RACE_NAME_TO_EDID[raceName] || raceName
}

export function getRaceNameFromEdid(edid: string): string | null {
  const entry = Object.entries(RACE_NAME_TO_EDID).find(
    ([_, value]) => value === edid
  )
  return entry ? entry[0] : null
}

export const STANDING_STONE_NAME_TO_EDID: Record<string, string> = {
  None: '', // Special case for no standing stone
  Warrior: 'REQ_Ability_Birthsign_Warrior',
  Lady: 'REQ_Ability_Birthsign_Lady',
  Lord: 'REQ_Ability_Birthsign_Lord',
  Steed: 'REQ_Ability_Birthsign_Steed',
  Mage: 'REQ_Ability_Birthsign_Mage',
  Apprentice: 'REQ_Ability_Birthsign_Apprentice',
  Atronach: 'REQ_Ability_Birthsign_Atronach',
  Ritual: 'REQ_Ability_Birthsign_Ritual',
  Thief: 'REQ_Ability_Birthsign_Thief',
  Lover: 'REQ_Ability_Birthsign_Lover',
  Shadow: 'REQ_Ability_Birthsign_Shadow',
  Tower: 'REQ_Ability_Birthsign_Tower',
  Serpent: 'REQ_Ability_Birthsign_Serpent',
}

export function getStandingStoneEdid(stoneName: string): string {
  if (stoneName in STANDING_STONE_NAME_TO_EDID) {
    return STANDING_STONE_NAME_TO_EDID[stoneName]
  }
  return stoneName
}

export function getStandingStoneNameFromEdid(edid: string): string | null {
  const entry = Object.entries(STANDING_STONE_NAME_TO_EDID).find(
    ([_, value]) => value === edid
  )
  return entry ? entry[0] : null
}

export const BLESSING_NAME_TO_EDID: Record<string, string> = {
  None: '', // Special case for no blessing
  Akatosh: 'BlessingAkatosh',
  Arkay: 'BlessingArkay',
  Dibella: 'BlessingDibella',
  Julianos: 'BlessingJulianos',
  Kynareth: 'BlessingKynareth',
  Mara: 'BlessingMara',
  Stendarr: 'BlessingStendarr',
  Talos: 'BlessingTalos',
  Zenithar: 'BlessingZenithar',
  Azura: 'BlessingAzura',
  Boethia: 'BlessingBoethia',
  'Clavicus Vile': 'BlessingClavicusVile',
  'Hermaeus Mora': 'BlessingHermaeusMora',
  Hircine: 'BlessingHircine',
  Jyggalag: 'BlessingJyggalag',
  Malacath: 'BlessingMalacath',
  'Mehrunes Dagon': 'BlessingMehrunesDagon',
  Mephala: 'BlessingMephala',
  Meridia: 'BlessingMeridia',
  'Molag Bal': 'BlessingMolagBal',
  Namira: 'BlessingNamira',
  Nocturnal: 'BlessingNocturnal',
  Peryite: 'BlessingPeryite',
  Sanguine: 'BlessingSanguine',
  Sheogorath: 'BlessingSheogorath',
  Vaermina: 'BlessingVaermina',
  Auriel: 'BlessingAuriel',
  Jephre: 'BlessingJephre',
  Magnus: 'BlessingMagnus',
  Phynaster: 'BlessingPhynaster',
  Syrabane: 'BlessingSyrabane',
  Trinimac: 'BlessingTrinimac',
  Xarxes: 'BlessingXarxes',
  "Z'en": 'BlessingZen',
  Almalexia: 'BlessingAlmalexia',
  'Sotha Sil': 'BlessingSothaSil',
  Vivec: 'BlessingVivec',
  Leki: 'BlessingLeki',
  Morwha: 'BlessingMorwha',
  Satakal: 'BlessingSatakal',
  'Tall Papa': 'BlessingTallPapa',
  'The HoonDing': 'BlessingHoonDing',
  Rajhin: 'BlessingRajhin',
  "Riddle'Thar": 'BlessingRiddleThar',
  'Baan Dar': 'BlessingBaanDar',
  Ebonarm: 'BlessingEbonarm',
  Mannimarco: 'BlessingMannimarco',
  Shor: 'BlessingShor',
  Sithis: 'BlessingSithis',
  'St. Alessia': 'BlessingStAlessia',
  'The All-Maker': 'BlessingAllMaker',
  'The Hist': 'BlessingHist',
  'The Magna-Ge': 'BlessingMagnaGe',
  'The Old Ways': 'BlessingOldWays',
}

export function getBlessingEdid(blessingName: string): string {
  if (blessingName in BLESSING_NAME_TO_EDID) {
    return BLESSING_NAME_TO_EDID[blessingName]
  }
  return blessingName
}

export function getBlessingNameFromEdid(edid: string): string | null {
  const entry = Object.entries(BLESSING_NAME_TO_EDID).find(
    ([_, value]) => value === edid
  )
  return entry ? entry[0] : null
}

export const GAME_MECHANICS_NAME_TO_ID: Record<string, number> = {
  'LoreRim v4': 0,
  // Future game mechanics will be added here
  // 'Vanilla': 1,
  // 'Requiem': 2,
  // 'Ordinator': 3,
}

export function getGameMechanicsId(mechanicsName: string): number {
  return GAME_MECHANICS_NAME_TO_ID[mechanicsName] ?? 0
}

export function getGameMechanicsNameFromId(mechanicsId: number): string | null {
  const entry = Object.entries(GAME_MECHANICS_NAME_TO_ID).find(
    ([_, id]) => id === mechanicsId
  )
  return entry ? entry[0] : null
}

export function getGameMechanicsIdFromStringId(
  stringId: string
): string | null {
  // Map from string ID back to name, then to numeric ID
  const idToNameMap: Record<string, string> = {
    'lorerim-v4': 'LoreRim v4',
  }

  return idToNameMap[stringId] || null
}

export const PRESET_NAME_TO_ID: Record<string, number> = {
  'LoreRim v3.0.4': 0,
  // Future presets will be added here
  // 'Vanilla': 1,
  // 'Requiem': 2,
  // 'Ordinator': 3,
}

export function getPresetId(presetName: string): number {
  return PRESET_NAME_TO_ID[presetName] ?? 0
}

export function getPresetNameFromId(presetId: number): string | null {
  const entry = Object.entries(PRESET_NAME_TO_ID).find(
    ([_, id]) => id === presetId
  )
  return entry ? entry[0] : null
}

export function getPresetIdFromStringId(stringId: string): string | null {
  // Map from string ID back to name, then to numeric ID
  const idToNameMap: Record<string, string> = {
    'lorerim-v3-0-4': 'LoreRim v3.0.4',
  }

  return idToNameMap[stringId] || null
}

// Skill name mappings
export const SKILL_NAMES = [
  'Smithing',
  'Heavy Armor',
  'Block',
  'Two-Handed',
  'One-Handed',
  'Marksman',
  'Evasion',
  'Sneak',
  'Wayfarer',
  'Finesse',
  'Speech',
  'Alchemy',
  'Illusion',
  'Conjuration',
  'Destruction',
  'Restoration',
  'Alteration',
  'Enchanting',
  'Destiny',
  'Traits',
] as const

export type SkillName = (typeof SKILL_NAMES)[number]

// Perk name to EDID mappings (partial - will be expanded)
export const PERK_NAME_TO_EDID: Record<string, string> = {
  // Smithing perks
  Craftsmanship: 'PerkCraftsmanship',
  'Advanced Blacksmithing': 'PerkAdvancedBlacksmithing',
  'Arcane Craftsmanship': 'PerkArcaneCraftsmanship',
  'Legendary Blacksmithing': 'PerkLegendaryBlacksmithing',
  'Advanced Light Armors': 'PerkAdvancedLightArmors',
  'Elven Smithing': 'PerkElvenSmithing',
  'Glass Smithing': 'PerkGlassSmithing',
  'Dwarven Smithing': 'PerkDwarvenSmithing',
  'Orcish Smithing': 'PerkOrcishSmithing',
  'Ebony Smithing': 'PerkEbonySmithing',
  'Daedric Smithing': 'PerkDaedricSmithing',
  'Draconic Blacksmithing': 'PerkDraconicBlacksmithing',

  // Heavy Armor perks
  Conditioning: 'PerkConditioning',
  'Relentless Onslaught': 'PerkRelentlessOnslaught',
  'Devastating Tackle': 'PerkDevastatingTackle',
  'Combat Casting': 'PerkCombatCasting',
  'Combat Trance': 'PerkCombatTrance',
  'Combat Meditation': 'PerkCombatMeditation',
  'Battle Mage': 'PerkBattleMage',
  'Combat Training': 'PerkCombatTraining',
  Immovable: 'PerkImmovable',
  Fortitude: 'PerkFortitude',
  'Power of the Combatant': 'PerkPowerOfTheCombatant',
  Juggernaut: 'PerkJuggernaut',
  'Mounted Combat': 'PerkMountedCombat',

  // Block perks
  'Improved Blocking': 'PerkImprovedBlocking',
  'Experienced Blocking': 'PerkExperiencedBlocking',
  'Torch Combat': 'PerkTorchCombat',
  'Strong Grip': 'PerkStrongGrip',
  'Elemental Protection': 'PerkElementalProtection',
  'Defensive Stance': 'PerkDefensiveStance',
  'Powerful Bashes': 'PerkPowerfulBashes',
  'Shield Strike': 'PerkShieldStrike',
  'Overpowering Bashes': 'PerkOverpoweringBashes',
  'Disarming Bash': 'PerkDisarmingBash',
  'Unstoppable Charge': 'PerkUnstoppableCharge',

  // Two-Handed perks
  'Great Weapon Mastery': 'PerkGreatWeaponMastery',
  'Barbaric Might': 'PerkBarbaricMight',
  'Quarterstaff Focus': 'PerkQuarterstaffFocus',
  'Defensive Strike': 'PerkDefensiveStrike',
  'Hafted Blade Focus': 'PerkHaftedBladeFocus',
  'Shield Breaker': 'PerkShieldBreaker',
  'Longblade Focus': 'PerkLongbladeFocus',
  Reversal: 'PerkReversal',
  'Warhammer Focus': 'PerkWarhammerFocus',
  Onslaught: 'PerkOnslaught',
  'Devastating Charge': 'PerkDevastatingCharge',
  'Devastating Strike': 'PerkDevastatingStrike',
  'Hyper Armor': 'PerkHyperArmor',
  'Mighty Strike': 'PerkMightyStrike',
  Warbringer: 'PerkWarbringer',

  // One-Handed perks
  'Weapon Mastery': 'PerkWeaponMastery',
  'Penetrating Strikes': 'PerkPenetratingStrikes',
  'Short Blade Focus': 'PerkShortBladeFocus',
  Puncture: 'PerkPuncture',
  'War Axe Focus': 'PerkWarAxeFocus',
  Armsbreaker: 'PerkArmsbreaker',
  'Mace Focus': 'PerkMaceFocus',
  'Stunning Blow': 'PerkStunningBlow',
  'Sword & Spear Focus': 'PerkSwordAndSpearFocus',
  'Disarming Strike': 'PerkDisarmingStrike',
  'Powerful Charge': 'PerkPowerfulCharge',
  'Powerful Strike': 'PerkPowerfulStrike',
  Flurry: 'PerkFlurry',
  'Storm of Steel': 'PerkStormOfSteel',
  'Hand to Hand': 'PerkHandToHand',
  Grappling: 'PerkGrappling',
  Takedown: 'PerkTakedown',
  'Unarmed Defense': 'PerkUnarmedDefense',
  'Unarmed Stance': 'PerkUnarmedStance',
  'Armed Spelllcasting': 'PerkArmedSpellcasting',
  'Balanced Wielding': 'PerkBalancedWielding',

  // Marksman perks
  'Ranged Combat Training': 'PerkRangedCombatTraining',
  Ranger: 'PerkRanger',
  'Eagle Eye': 'PerkEagleEye',
  "Marksman's Focus": 'PerkMarksmansFocus',
  'Rapid Reload': 'PerkRapidReload',
  'Quick Shot': 'PerkQuickShot',
  'Knife Expertise': 'PerkKnifeExpertise',

  // Evasion perks
  Agility: 'PerkAgility',
  Dodge: 'PerkDodge',
  'Agile Spellcasting': 'PerkAgileSpellcasting',

  // Sneak perks
  Stealth: 'PerkStealth',
  'Deft Strike': 'PerkDeftStrike',
  'Anatomical Lore': 'PerkAnatomicalLore',
  'Arcane Assassin': 'PerkArcaneAssassin',

  // Finesse perks
  'Nimble Fingers': 'PerkNimbleFingers',

  // Alchemy perks
  'Alchemical Lore': 'PerkAlchemicalLore',
  'Concentrated Poisons': 'PerkConcentratedPoisons',
  'Improved Poisons': 'PerkImprovedPoisons',

  // Illusion perks
  'Novice Illusion': 'PerkNoviceIllusion',
  'Apprentice Illusion': 'PerkApprenticeIllusion',

  // Add more perk mappings as needed
}

export function getPerkEdid(perkName: string): string {
  return PERK_NAME_TO_EDID[perkName] || perkName
}

// Map GigaPlanner perk names to internal perk names (without "Perk" prefix)
export const PERK_NAME_TO_INTERNAL: Record<string, string> = {
  // Smithing perks
  Craftsmanship: 'Craftsmanship',
  'Advanced Blacksmithing': 'AdvancedBlacksmithing',
  'Arcane Craftsmanship': 'ArcaneCraftsmanship',
  'Legendary Blacksmithing': 'LegendaryBlacksmithing',
  'Advanced Light Armors': 'AdvancedLightArmors',
  'Elven Smithing': 'ElvenSmithing',
  'Glass Smithing': 'GlassSmithing',
  'Dwarven Smithing': 'DwarvenSmithing',
  'Orcish Smithing': 'OrcishSmithing',
  'Ebony Smithing': 'EbonySmithing',
  'Daedric Smithing': 'DaedricSmithing',
  'Draconic Blacksmithing': 'DraconicBlacksmithing',

  // Heavy Armor perks
  Conditioning: 'Conditioning',
  'Relentless Onslaught': 'RelentlessOnslaught',
  'Devastating Tackle': 'DevastatingTackle',
  'Combat Casting': 'CombatCasting',
  'Combat Trance': 'CombatTrance',
  'Combat Meditation': 'CombatMeditation',
  'Battle Mage': 'BattleMage',
  'Combat Training': 'CombatTraining',
  Immovable: 'Immovable',
  Fortitude: 'Fortitude',
  'Power of the Combatant': 'PowerOfTheCombatant',
  Juggernaut: 'Juggernaut',
  'Mounted Combat': 'MountedCombat',

  // Block perks
  'Improved Blocking': 'ImprovedBlocking',
  'Experienced Blocking': 'ExperiencedBlocking',
  'Torch Combat': 'TorchCombat',
  'Strong Grip': 'StrongGrip',
  'Elemental Protection': 'ElementalProtection',
  'Defensive Stance': 'DefensiveStance',
  'Powerful Bashes': 'PowerfulBashes',
  'Shield Strike': 'ShieldStrike',
  'Overpowering Bashes': 'OverpoweringBashes',
  'Disarming Bash': 'DisarmingBash',
  'Unstoppable Charge': 'UnstoppableCharge',

  // Two-Handed perks
  'Great Weapon Mastery': 'GreatWeaponMastery',
  'Barbaric Might': 'BarbaricMight',
  'Quarterstaff Focus': 'QuarterstaffFocus',
  'Defensive Strike': 'DefensiveStrike',
  'Hafted Blade Focus': 'HaftedBladeFocus',
  'Shield Breaker': 'ShieldBreaker',
  'Longblade Focus': 'LongbladeFocus',
  Reversal: 'Reversal',
  'Warhammer Focus': 'WarhammerFocus',
  Onslaught: 'Onslaught',
  'Devastating Charge': 'DevastatingCharge',
  'Devastating Strike': 'DevastatingStrike',
  'Hyper Armor': 'HyperArmor',
  'Mighty Strike': 'MightyStrike',
  Warbringer: 'Warbringer',

  // One-Handed perks
  'Weapon Mastery': 'WeaponMastery',
  'Penetrating Strikes': 'PenetratingStrikes',
  'Short Blade Focus': 'ShortBladeFocus',
  Puncture: 'Puncture',
  'War Axe Focus': 'WarAxeFocus',
  Armsbreaker: 'Armsbreaker',
  'Mace Focus': 'MaceFocus',
  'Stunning Blow': 'StunningBlow',
  'Sword & Spear Focus': 'SwordAndSpearFocus',
  'Disarming Strike': 'DisarmingStrike',
  'Powerful Charge': 'PowerfulCharge',
  'Powerful Strike': 'PowerfulStrike',
  Flurry: 'Flurry',
  'Storm of Steel': 'StormOfSteel',
  'Hand to Hand': 'HandToHand',
  Grappling: 'Grappling',
  Takedown: 'Takedown',
  'Unarmed Defense': 'UnarmedDefense',
  'Unarmed Stance': 'UnarmedStance',
  'Armed Spelllcasting': 'ArmedSpellcasting',
  'Balanced Wielding': 'BalancedWielding',

  // Marksman perks
  'Ranged Combat Training': 'RangedCombatTraining',
  Ranger: 'Ranger',
  'Eagle Eye': 'EagleEye',
  "Marksman's Focus": 'MarksmansFocus',
  'Rapid Reload': 'RapidReload',
  'Quick Shot': 'QuickShot',
  'Knife Expertise': 'KnifeExpertise',

  // Evasion perks
  Agility: 'Agility',
  Dodge: 'Dodge',
  'Agile Spellcasting': 'AgileSpellcasting',

  // Sneak perks
  Stealth: 'Stealth',
  'Deft Strike': 'DeftStrike',
  'Anatomical Lore': 'AnatomicalLore',
  'Arcane Assassin': 'ArcaneAssassin',

  // Finesse perks
  'Nimble Fingers': 'NimbleFingers',

  // Alchemy perks
  'Alchemical Lore': 'AlchemicalLore',
  'Concentrated Poisons': 'ConcentratedPoisons',
  'Improved Poisons': 'ImprovedPoisons',

  // Illusion perks
  'Novice Illusion': 'NoviceIllusion',
  'Apprentice Illusion': 'ApprenticeIllusion',
}

export function getPerkInternalName(perkName: string): string {
  return PERK_NAME_TO_INTERNAL[perkName] || perkName
}

export function getPerkNameFromEdid(edid: string): string | null {
  const entry = Object.entries(PERK_NAME_TO_EDID).find(
    ([_, value]) => value === edid
  )
  return entry ? entry[0] : null
}

export function getSkillName(skillIndex: number): string {
  return SKILL_NAMES[skillIndex] || 'Unknown'
}

export function getSkillIndex(skillName: string): number {
  return SKILL_NAMES.indexOf(skillName as SkillName)
}
