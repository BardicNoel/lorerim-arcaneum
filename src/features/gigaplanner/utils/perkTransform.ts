/**
 * Perk Transformation Utilities
 * 
 * Handles transformation between GigaPlanner perk data and our app's format
 */

/**
 * Helper function to find which skill a perk belongs to
 * This uses the skill information already provided by GigaPlanner
 */
function findPerkSkill(perkName: string, perkListName: string): string | null {
  // Since GigaPlanner already provides the skill information,
  // we don't need to look it up - we just need to use the skill
  // that was passed in with the perk data
  return null // This will be handled differently in the main transform function
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
      skillType: perk.skill === 'Destiny' ? 'subclass' : perk.skill === 'Traits' ? 'trait' : 'regular'
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
    
    // For regular perks, use the skill name directly from GigaPlanner
    const perkSkill = typeof perk.skill === 'string' ? perk.skill : null
    if (perkSkill) {
      if (!perks[perkSkill]) {
        perks[perkSkill] = []
      }
      perks[perkSkill].push(perk.name)
      console.log(`🔄 [Perk Transform] Added perk to skill ${perkSkill}:`, perk.name)
    } else {
      warnings.push(`Could not determine skill for perk: ${perk.name}`)
      console.log(`🔄 [Perk Transform] Warning: Could not determine skill for perk: ${perk.name}`)
    }
  })

  // Debug logging
  console.log('🔄 [Perk Transform] Final results:', {
    inputCount: gigaPlannerPerks.length,
    regularCount: gigaPlannerPerks.filter(p => p.skill !== 'Destiny' && p.skill !== 'Traits').length,
    subclassCount: gigaPlannerPerks.filter(p => p.skill === 'Destiny').length,
    traitCount: gigaPlannerPerks.filter(p => p.skill === 'Traits').length,
    groupedCount: Object.keys(perks).length,
    warnings: warnings.length,
    groupedPerks: perks
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
