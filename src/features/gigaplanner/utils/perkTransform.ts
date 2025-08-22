/**
 * Perk Transformation Utilities
 * 
 * Handles transformation between GigaPlanner perk data and our app's format
 */

/**
 * Helper function to find which skill a perk belongs to
 * This would need to be implemented with actual perk data
 */
function findPerkSkill(perkName: string, perkListName: string): string | null {
  // This is a simplified implementation
  // In a real implementation, you would look up the perk in the perk data
  // to determine which skill it belongs to

  // For now, return null to indicate we couldn't determine the skill
  // This will result in a warning during transformation
  return null
}

/**
 * Transform GigaPlanner perks to our BuildState format
 */
export function transformPerks(
  gigaPlannerPerks: string[],
  perkListName: string
): {
  selected: Record<string, string[]>
  ranks: Record<string, number>
} | null {
  const perks: Record<string, string[]> = {}
  const warnings: string[] = []
  
  gigaPlannerPerks.forEach(perkName => {
    // Find which skill this perk belongs to
    const perkSkill = findPerkSkill(perkName, perkListName)
    if (perkSkill) {
      if (!perks[perkSkill]) {
        perks[perkSkill] = []
      }
      perks[perkSkill].push(perkName)
    } else {
      warnings.push(`Could not determine skill for perk: ${perkName}`)
    }
  })

  // Debug logging
  console.log('🔄 [Perk Transform] Perks:', {
    count: gigaPlannerPerks.length,
    groupedCount: Object.keys(perks).length,
    warnings: warnings.length
  })

  if (Object.keys(perks).length === 0) {
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
