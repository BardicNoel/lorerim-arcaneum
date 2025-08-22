/**
 * Blessing Transformation Utilities
 * 
 * Handles transformation between GigaPlanner blessing names and our app's format
 */

/**
 * Transform GigaPlanner blessing to our BuildState format
 */
export function transformBlessing(gigaPlannerBlessing: string): string | null {
  if (gigaPlannerBlessing === 'Unknown') {
    return null
  }
  
  // Debug logging
  console.log('🔄 [Blessing Transform] Blessing mapping:', {
    original: gigaPlannerBlessing,
    mapped: gigaPlannerBlessing
  })
  
  return gigaPlannerBlessing
}

/**
 * Transform our BuildState blessing to GigaPlanner format
 */
export function transformBlessingToGigaPlanner(buildStateBlessing: string | null): string {
  if (!buildStateBlessing) {
    return 'None'
  }
  
  return buildStateBlessing
}
