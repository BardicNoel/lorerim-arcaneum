/**
 * Perk Transformation Utilities
 *
 * Handles transformation between GigaPlanner perk data and our app's format
 * Uses the perk trees store data for dynamic mapping instead of hardcoded values
 */

import { usePerkTreesStore } from '@/shared/stores/perkTreesStore'

/**
 * Find perk by name (case-insensitive) in the perk trees store
 */
function findPerkByName(
  perkName: string
): { edid: string; skillTree: string } | null {
  const perkTreesStore = usePerkTreesStore.getState()

  // Ensure perk trees data is loaded
  if (perkTreesStore.data.length === 0) {
    console.warn(
      '🔄 [Perk Transform] Perk trees store data not loaded, attempting to load...'
    )
    perkTreesStore.load().catch(error => {
      console.error(
        '🔄 [Perk Transform] Failed to load perk trees data:',
        error
      )
    })
    return null
  }

  // Search for perk by name (case-insensitive) across all perk trees
  for (const tree of perkTreesStore.data) {
    const foundPerk = tree.perks?.find(
      perk => perk.name.toLowerCase() === perkName.toLowerCase()
    )

    if (foundPerk) {
      return {
        edid: foundPerk.edid,
        skillTree: tree.treeId,
      }
    }
  }

  return null
}

/**
 * Transform GigaPlanner perks to our BuildState format
 */
export function transformPerks(
  gigaPlannerPerks: Array<{ name: string; skill: number | string }>,
  perkListName: string
): {
  selected: Record<string, string[]>
  ranks: Record<string, number>
} | null {
  console.log('🔄 [Perk Transform] Starting perk transformation...')
  console.log('🔄 [Perk Transform] Input perks:', gigaPlannerPerks)
  console.log('🔄 [Perk Transform] Perk list name:', perkListName)

  const perks: Record<string, string[]> = {}
  const warnings: string[] = []

  gigaPlannerPerks.forEach((perk, index) => {
    console.log(`🔄 [Perk Transform] Processing perk ${index}:`, {
      name: perk.name,
      skill: perk.skill,
      skillType:
        perk.skill === 'Destiny'
          ? 'subclass'
          : perk.skill === 'Traits'
            ? 'trait'
            : 'regular',
    })

    // Check if this is a subclass (Destiny) or trait (Traits)
    if (perk.skill === 'Destiny') {
      // This is a subclass - we'll handle it separately
      console.log('🔄 [Perk Transform] Found subclass:', perk.name)
      return
    } else if (perk.skill === 'Traits') {
      // This is a trait - we'll handle it separately
      console.log('🔄 [Perk Transform] Found trait:', perk.name)
      return
    }

    // For regular perks, search for the perk in the perk trees store
    const foundPerk = findPerkByName(perk.name)
    if (foundPerk) {
      if (!perks[foundPerk.skillTree]) {
        perks[foundPerk.skillTree] = []
      }

      perks[foundPerk.skillTree].push(foundPerk.edid)
      console.log(
        `🔄 [Perk Transform] Added perk to skill ${foundPerk.skillTree}:`,
        {
          originalName: perk.name,
          foundEdid: foundPerk.edid,
          skillTree: foundPerk.skillTree,
        }
      )
    } else {
      warnings.push(`Could not find perk in store: ${perk.name}`)
      console.log(
        `🔄 [Perk Transform] Warning: Could not find perk in store: ${perk.name}`
      )
    }
  })

  // Debug logging
  console.log('🔄 [Perk Transform] Final results:', {
    inputCount: gigaPlannerPerks.length,
    regularCount: gigaPlannerPerks.filter(
      p => p.skill !== 'Destiny' && p.skill !== 'Traits'
    ).length,
    subclassCount: gigaPlannerPerks.filter(p => p.skill === 'Destiny').length,
    traitCount: gigaPlannerPerks.filter(p => p.skill === 'Traits').length,
    groupedCount: Object.keys(perks).length,
    warnings: warnings.length,
    groupedPerks: perks,
  })

  if (Object.keys(perks).length === 0) {
    console.log('🔄 [Perk Transform] No regular perks found, returning null')
    return null
  }

  return {
    selected: perks,
    ranks: {}, // Initialize empty ranks
  }
}

/**
 * Transform our BuildState perks to GigaPlanner format
 */
export function transformPerksToGigaPlanner(
  perks: {
    selected: Record<string, string[]>
    ranks: Record<string, number>
  } | null
): string[] {
  if (!perks?.selected) {
    return []
  }

  // Flatten from grouped format
  const gigaPlannerPerks: string[] = []
  Object.values(perks.selected).forEach(perkList => {
    gigaPlannerPerks.push(...perkList)
  })

  return gigaPlannerPerks
}

/**
 * Extract subclasses from GigaPlanner perks (skill 'Destiny')
 */
export function extractSubclasses(
  gigaPlannerPerks: Array<{ name: string; skill: number | string }>
): string[] {
  const subclasses = gigaPlannerPerks
    .filter(perk => perk.skill === 'Destiny')
    .map(perk => perk.name)

  console.log('🔄 [Subclass Extract] Found subclasses:', subclasses)
  return subclasses
}

/**
 * Extract traits from GigaPlanner perks (skill 'Traits')
 */
export function extractTraits(
  gigaPlannerPerks: Array<{ name: string; skill: number | string }>
): string[] {
  const traits = gigaPlannerPerks
    .filter(perk => perk.skill === 'Traits')
    .map(perk => perk.name)

  console.log('🔄 [Trait Extract] Found traits:', traits)
  return traits
}
