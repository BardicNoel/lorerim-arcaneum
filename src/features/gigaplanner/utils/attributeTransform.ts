/**
 * Attribute Assignment Transformation Utilities
 * 
 * Handles transformation between GigaPlanner attribute data and our app's format
 */

/**
 * Transform GigaPlanner attribute assignments to our BuildState format
 */
export function transformAttributeAssignments(
  hmsIncreases: { health: number; stamina: number; magicka: number },
  level: number,
  oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina'
): {
  health: number
  stamina: number
  magicka: number
  level: number
  assignments: Record<number, 'health' | 'stamina' | 'magicka'>
} {
  const attributeAssignments = {
    health: hmsIncreases.health,
    stamina: hmsIncreases.stamina,
    magicka: hmsIncreases.magicka,
    level: level,
    assignments: {} as Record<number, 'health' | 'stamina' | 'magicka'>,
  }

  // Add Oghma choice to attribute assignments if not 'None'
  if (oghmaChoice !== 'None') {
    const oghmaValue = 1 // Always add 1 for Oghma choice

    if (oghmaValue > 0) {
      const attributeKey = oghhmaChoice.toLowerCase() as 'health' | 'magicka' | 'stamina'
      if (attributeKey in attributeAssignments) {
        attributeAssignments[attributeKey] += oghmaValue
        console.log(`🔄 [Attribute Transform] Added Oghma choice (${oghmaChoice}) to attribute assignments`)
      }
    }
  }

  // Debug logging
  console.log('🔄 [Attribute Transform] Attribute assignments:', {
    health: attributeAssignments.health,
    stamina: attributeAssignments.stamina,
    magicka: attributeAssignments.magicka,
    level: attributeAssignments.level,
    oghmaChoice
  })

  return attributeAssignments
}

/**
 * Transform our BuildState attribute assignments to GigaPlanner format
 */
export function transformAttributeAssignmentsToGigaPlanner(
  attributeAssignments: {
    health: number
    stamina: number
    magicka: number
    level: number
    assignments: Record<number, 'health' | 'stamina' | 'magicka'>
  }
): {
  level: number
  hmsIncreases: { health: number; stamina: number; magicka: number }
  oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina'
} {
  const level = attributeAssignments.level || 1
  const health = attributeAssignments.health || 0
  const magicka = attributeAssignments.magicka || 0
  const stamina = attributeAssignments.stamina || 0

  // Determine Oghma choice from attribute assignments
  let oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina' = 'None'
  if (health > 0) oghmaChoice = 'Health'
  else if (magicka > 0) oghmaChoice = 'Magicka'
  else if (stamina > 0) oghmaChoice = 'Stamina'

  return {
    level,
    hmsIncreases: {
      health,
      magicka,
      stamina,
    },
    oghmaChoice,
  }
}
