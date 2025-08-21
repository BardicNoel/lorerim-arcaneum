import { 
  GigaPlannerDataLoader, 
  getRaceEdid, 
  getRaceNameFromEdid,
  getStandingStoneEdid,
  getStandingStoneNameFromEdid
} from './adapters';

async function demo() {
  console.log('=== GigaPlanner Data Loader Demo ===\n');

  const loader = new GigaPlannerDataLoader();

  try {
    // Test loading all data
    console.log('Loading all GigaPlanner data...');
    const allData = await loader.loadAllData();
    console.log(`✅ Loaded ${allData.races.length} races`);
    console.log(`✅ Loaded ${allData.standingStones.length} standing stones\n`);

    // Display first race
    const firstRace = allData.races[0];
    console.log('First race:');
    console.log(`  Name: ${firstRace.name}`);
    console.log(`  EDID: ${firstRace.edid}`);
    console.log(`  Starting HMS: [${firstRace.startingHMS.join(', ')}]`);
    console.log(`  Starting Skills: [${firstRace.startingSkills.join(', ')}]`);
    console.log(`  Description: ${firstRace.description.substring(0, 100)}...\n`);

    // Display first standing stone
    const firstStone = allData.standingStones[1]; // Skip "None" at index 0
    console.log('First standing stone (Warrior):');
    console.log(`  Name: ${firstStone.name}`);
    console.log(`  EDID: ${firstStone.edid}`);
    console.log(`  Group: ${firstStone.group.substring(0, 100)}...`);
    console.log(`  Description: ${firstStone.description}`);
    console.log(`  Bonus: ${firstStone.bonus.substring(0, 100)}...\n`);

    // Test EDID mappings
    console.log('Testing Race EDID mappings:');
    console.log(`  'Argonian' -> '${getRaceEdid('Argonian')}'`);
    console.log(`  'Breton' -> '${getRaceEdid('Breton')}'`);
    console.log(`  'Nord' -> '${getRaceEdid('Nord')}'`);
    console.log(`  'ArgonianRace' -> '${getRaceNameFromEdid('ArgonianRace')}'`);
    console.log(`  'BretonRace' -> '${getRaceNameFromEdid('BretonRace')}'`);
    console.log(`  'NordRace' -> '${getRaceNameFromEdid('NordRace')}'`);
    console.log(`  'UnknownRace' -> '${getRaceNameFromEdid('UnknownRace')}'`);

    console.log('\nTesting Standing Stone EDID mappings:');
    console.log(`  'Warrior' -> '${getStandingStoneEdid('Warrior')}'`);
    console.log(`  'Mage' -> '${getStandingStoneEdid('Mage')}'`);
    console.log(`  'Thief' -> '${getStandingStoneEdid('Thief')}'`);
    console.log(`  'REQ_Ability_Birthsign_Warrior' -> '${getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Warrior')}'`);
    console.log(`  'REQ_Ability_Birthsign_Mage' -> '${getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Mage')}'`);
    console.log(`  'REQ_Ability_Birthsign_Thief' -> '${getStandingStoneNameFromEdid('REQ_Ability_Birthsign_Thief')}'`);
    console.log(`  'UnknownEDID' -> '${getStandingStoneNameFromEdid('UnknownEDID')}'`);

    // Test caching
    console.log('\nTesting caching...');
    const startTime = performance.now();
    await loader.loadRaces(); // Should use cache
    const endTime = performance.now();
    console.log(`✅ Second load took ${(endTime - startTime).toFixed(2)}ms (should be fast due to caching)`);

    // Show cache stats
    const stats = loader.getCacheStats();
    console.log(`\nCache stats: ${stats.size} items, keys: [${stats.keys.join(', ')}]`);

  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  demo();
}

export { demo };
