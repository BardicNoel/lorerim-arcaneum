import {
  GigaPlannerDataLoader,
  getBlessingEdid,
  getBlessingNameFromEdid,
} from './adapters'

async function testBlessings() {
  console.log('=== Testing Blessings Functionality ===\n')

  const loader = new GigaPlannerDataLoader()

  try {
    // Test loading blessings
    console.log('Loading blessings data...')
    const blessings = await loader.loadBlessings()
    console.log(`✅ Loaded ${blessings.length} blessings\n`)

    // Display first few blessings
    console.log('First 3 blessings:')
    blessings.slice(0, 3).forEach((blessing, index) => {
      console.log(`${index + 1}. ${blessing.name} (${blessing.category})`)
      console.log(`   EDID: ${blessing.edid}`)
      console.log(`   Shrine: ${blessing.shrine}`)
      console.log(`   Race: ${blessing.race}`)
      console.log('')
    })

    // Test EDID mappings
    console.log('Testing Blessing EDID mappings:')
    console.log(`  'Akatosh' -> '${getBlessingEdid('Akatosh')}'`)
    console.log(`  'Mara' -> '${getBlessingEdid('Mara')}'`)
    console.log(`  'Talos' -> '${getBlessingEdid('Talos')}'`)
    console.log(`  'Azura' -> '${getBlessingEdid('Azura')}'`)
    console.log(`  'None' -> '${getBlessingEdid('None')}'`)
    console.log('')

    console.log('Testing reverse EDID mappings:')
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
      `  'BlessingAzura' -> '${getBlessingNameFromEdid('BlessingAzura')}'`
    )
    console.log(`  '' -> '${getBlessingNameFromEdid('')}'`)
    console.log(
      `  'UnknownBlessing' -> '${getBlessingNameFromEdid('UnknownBlessing')}'`
    )
    console.log('')

    // Test categories
    const categories = [...new Set(blessings.map(b => b.category))]
    console.log(`Blessing categories: ${categories.join(', ')}`)
    console.log('')

    // Test caching
    console.log('Testing caching...')
    const startTime = performance.now()
    await loader.loadBlessings() // Should use cache
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
    console.error('❌ Test failed:', error)
  }
}

// Run test
testBlessings()
