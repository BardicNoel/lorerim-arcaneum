import {
  GigaPlannerDataLoader,
  getBlessingEdid,
  getBlessingNameFromEdid,
  getGameMechanicsId,
  getGameMechanicsIdFromStringId,
  getGameMechanicsNameFromId,
  getPresetId,
  getPresetIdFromStringId,
  getPresetNameFromId,
  getRaceEdid,
  getRaceNameFromEdid,
  getStandingStoneEdid,
  getStandingStoneNameFromEdid,
} from './adapters'

async function demo() {
  console.log('=== GigaPlanner Data Loader Demo ===\n')

  const loader = new GigaPlannerDataLoader()

  try {
    // Test loading all data
    console.log('Loading all GigaPlanner data...')
    const allData = await loader.loadAllData()
    console.log(`✅ Loaded ${allData.races.length} races`)
    console.log(`✅ Loaded ${allData.standingStones.length} standing stones`)
    console.log(`✅ Loaded ${allData.blessings.length} blessings`)
    console.log(`✅ Loaded ${allData.gameMechanics.length} game mechanics`)
    console.log(`✅ Loaded ${allData.presets.length} presets\n`)

    // Display first race
    const firstRace = allData.races[0]
    console.log('First race:')
    console.log(`  Name: ${firstRace.name}`)
    console.log(`  EDID: ${firstRace.edid}`)
    console.log(`  Starting HMS: [${firstRace.startingHMS.join(', ')}]`)
    console.log(`  Starting Skills: [${firstRace.startingSkills.join(', ')}]`)
    console.log(
      `  Description: ${firstRace.description.substring(0, 100)}...\n`
    )

    // Display first standing stone
    const firstStone = allData.standingStones[1] // Skip "None" at index 0
    console.log('First standing stone (Warrior):')
    console.log(`  Name: ${firstStone.name}`)
    console.log(`  EDID: ${firstStone.edid}`)
    console.log(`  Group: ${firstStone.group.substring(0, 100)}...`)
    console.log(`  Description: ${firstStone.description}`)
    console.log(`  Bonus: ${firstStone.bonus.substring(0, 100)}...\n`)

    // Display first blessing
    const firstBlessing = allData.blessings[1] // Skip "None" at index 0
    console.log('First blessing (Akatosh):')
    console.log(`  Name: ${firstBlessing.name}`)
    console.log(`  EDID: ${firstBlessing.edid}`)
    console.log(`  Category: ${firstBlessing.category}`)
    console.log(`  Shrine: ${firstBlessing.shrine}`)
    console.log(`  Follower: ${firstBlessing.follower.substring(0, 100)}...`)
    console.log(`  Devotee: ${firstBlessing.devotee.substring(0, 100)}...`)
    console.log(`  Tenents: ${firstBlessing.tenents.substring(0, 100)}...\n`)

    // Display first game mechanics
    const firstGameMechanics = allData.gameMechanics[0]
    console.log('First game mechanics (LoreRim v4):')
    console.log(`  Name: ${firstGameMechanics.name}`)
    console.log(`  ID: ${firstGameMechanics.id}`)
    console.log(`  Game ID: ${firstGameMechanics.gameId}`)
    console.log(`  Version: ${firstGameMechanics.version}`)
    console.log(`  Initial Perks: ${firstGameMechanics.initialPerks}`)
    console.log(`  Oghma Perks Given: ${firstGameMechanics.oghmaData.perksGiven}`)
    console.log(`  Leveling Base: ${firstGameMechanics.leveling.base}`)
    console.log(`  Derived Attributes Count: ${firstGameMechanics.derivedAttributes.attribute.length}`)
    console.log(`  Description: ${firstGameMechanics.description.substring(0, 100)}...\n`)

    // Display first preset
    const firstPreset = allData.presets[0]
    console.log('First preset (LoreRim v3.0.4):')
    console.log(`  Name: ${firstPreset.name}`)
    console.log(`  ID: ${firstPreset.id}`)
    console.log(`  Preset ID: ${firstPreset.presetId}`)
    console.log(`  Version: ${firstPreset.version}`)
    console.log(`  Perks Reference: ${firstPreset.perks}`)
    console.log(`  Races Reference: ${firstPreset.races}`)
    console.log(`  Game Mechanics Reference: ${firstPreset.gameMechanics}`)
    console.log(`  Blessings Reference: ${firstPreset.blessings}`)
    console.log(`  Category: ${firstPreset.category}`)
    console.log(`  Tags: ${firstPreset.tags?.join(', ')}`)
    console.log(`  Description: ${firstPreset.description.substring(0, 100)}...\n`)

    // Test EDID mappings
    console.log('Testing Race EDID mappings:')
    console.log(`  'Argonian' -> '${getRaceEdid('Argonian')}'`)
    console.log(`  'Breton' -> '${getRaceEdid('Breton')}'`)
    console.log(`  'Nord' -> '${getRaceEdid('Nord')}'`)
    console.log(`  'ArgonianRace' -> '${getRaceNameFromEdid('ArgonianRace')}'`)
    console.log(`  'BretonRace' -> '${getRaceNameFromEdid('BretonRace')}'`)
    console.log(`  'NordRace' -> '${getRaceNameFromEdid('NordRace')}'`)
    console.log(`  'UnknownRace' -> '${getRaceNameFromEdid('UnknownRace')}'`)

    console.log('\nTesting Standing Stone EDID mappings:')
    console.log(`  'Warrior' -> '${getStandingStoneEdid('Warrior')}'`)
    console.log(`  'Mage' -> '${getStandingStoneEdid('Mage')}'`)
    console.log(`  'Thief' -> '${getStandingStoneEdid('Thief')}'`)
    console.log(
      `  'REQ_Ability_Birthsign_Warrior' -> '${getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Warrior')}'`
    )
    console.log(
      `  'REQ_Ability_Birthsign_Mage' -> '${getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Mage')}'`
    )
    console.log(
      `  'REQ_Ability_Birthsign_Thief' -> '${getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Thief')}'`
    )
    console.log(
      `  'UnknownEDID' -> '${getStandingStoneNameFromEdid('UnknownEDID')}'`
    )

    console.log('\nTesting Blessing EDID mappings:')
    console.log(`  'Akatosh' -> '${getBlessingEdid('Akatosh')}'`)
    console.log(`  'Mara' -> '${getBlessingEdid('Mara')}'`)
    console.log(`  'Talos' -> '${getBlessingEdid('Talos')}'`)
    console.log(
      `  'BlessingAkatosh' -> '${getBlessingNameFromEdid('BlessingAkatosh')}'`
    )
    console.log(
      `  'BlessingMara' -> '${getBlessingNameFromEdid('BlessingMara')}'`
    )
    console.log(
      `  'BlessingTalos' -> '${getBlessingNameFromEdid('BlessingTalos')}'`
    )
    console.log(
      `  'UnknownBlessing' -> '${getBlessingNameFromEdid('UnknownBlessing')}'`
    )

    console.log('\nTesting Game Mechanics ID mappings:')
    console.log(`  'LoreRim v4' -> ${getGameMechanicsId('LoreRim v4')}`)
    console.log(`  'UnknownMechanics' -> ${getGameMechanicsId('UnknownMechanics')}`)
    console.log(`  0 -> '${getGameMechanicsNameFromId(0)}'`)
    console.log(`  1 -> '${getGameMechanicsNameFromId(1)}'`)
    console.log(`  'lorerim-v4' -> '${getGameMechanicsIdFromStringId('lorerim-v4')}'`)
    console.log(`  'unknown-mechanics' -> '${getGameMechanicsIdFromStringId('unknown-mechanics')}'`)

    console.log('\nTesting Preset ID mappings:')
    console.log(`  'LoreRim v3.0.4' -> ${getPresetId('LoreRim v3.0.4')}`)
    console.log(`  'UnknownPreset' -> ${getPresetId('UnknownPreset')}`)
    console.log(`  0 -> '${getPresetNameFromId(0)}'`)
    console.log(`  1 -> '${getPresetNameFromId(1)}'`)
    console.log(`  'lorerim-v3-0-4' -> '${getPresetIdFromStringId('lorerim-v3-0-4')}'`)
    console.log(`  'unknown-preset' -> '${getPresetIdFromStringId('unknown-preset')}'`)

    // Test caching
    console.log('\nTesting caching...')
    const startTime = performance.now()
    await loader.loadRaces() // Should use cache
    const endTime = performance.now()
    console.log(
      `✅ Second load took ${(endTime - startTime).toFixed(2)}ms (should be fast due to caching)`
    )

    // Show cache stats
    const stats = loader.getCacheStats()
    console.log(
      `\nCache stats: ${stats.size} items, keys: [${stats.keys.join(', ')}]`
    )
  } catch (error) {
    console.error('❌ Demo failed:', error)
  }
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demo()
}

export { demo }
