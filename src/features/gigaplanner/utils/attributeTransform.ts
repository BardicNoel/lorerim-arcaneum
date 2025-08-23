/**
 * Attribute Assignment Transformation Utilities
 * 
 * Handles transformation between GigaPlanner attribute data and our app's format
 */

/**
 * Transform GigaPlanner attribute assignments to our BuildState format
 * 
 * GigaPlanner provides total points, but our system uses level-based assignments.
 * Each level assignment gives 5 points, so we need to convert the totals to assignments.
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
  // Start with the base totals from GigaPlanner
  let healthPoints = hmsIncreases.health
  let staminaPoints = hmsIncreases.stamina
  let magickaPoints = hmsIncreases.magicka
  
  console.log(`🔄 [Attribute Transform] Initial points - Health: ${healthPoints}, Stamina: ${staminaPoints}, Magicka: ${magickaPoints}`)

  // Add Oghma choice if not 'None'
  if (oghmaChoice !== 'None') {
    const oghmaValue = 1 // Always add 1 for Oghma choice
    const attributeKey = oghmaChoice.toLowerCase() as 'health' | 'magicka' | 'stamina'
    if (attributeKey === 'health') healthPoints += oghmaValue
    else if (attributeKey === 'stamina') staminaPoints += oghmaValue
    else if (attributeKey === 'magicka') magickaPoints += oghmaValue
    console.log(`🔄 [Attribute Transform] Added Oghma choice (${oghmaChoice}) to attribute assignments`)
  }

  // Convert points to level assignments
  // Each level assignment gives 5 points, so we need to create the appropriate assignments
  const assignments: Record<number, 'health' | 'stamina' | 'magicka'> = {}
  let currentLevel = 2 // Start at level 2 (level 1 has no assignment)
  
  console.log(`🔄 [Attribute Transform] Starting assignment creation. Current level: ${currentLevel}`)

  // Helper function to add assignments for a given attribute
  const addAssignmentsForAttribute = (attribute: 'health' | 'stamina' | 'magicka', levels: number) => {
    console.log(`🔄 [Attribute Transform] Adding ${levels} levels for ${attribute}`)
    for (let i = 0; i < levels; i++) {
      assignments[currentLevel] = attribute
      console.log(`🔄 [Attribute Transform] Level ${currentLevel} assigned to ${attribute}`)
      currentLevel++
    }
  }

  // Add assignments for each attribute (order: health, stamina, magicka)
  addAssignmentsForAttribute('health', healthPoints)
  addAssignmentsForAttribute('stamina', staminaPoints)
  addAssignmentsForAttribute('magicka', magickaPoints)
  
  console.log(`🔄 [Attribute Transform] After creating assignments. Current level: ${currentLevel}, Assignments:`, assignments)

  // Calculate the actual totals based on assignments (each level gives 5 points)
  const calculatedHealth = healthPoints * 5
  const calculatedStamina = staminaPoints * 5
  const calculatedMagicka = magickaPoints * 5

  // Debug logging
  console.log('🔄 [Attribute Transform] GigaPlanner input:', {
    health: hmsIncreases.health,
    stamina: hmsIncreases.stamina,
    magicka: hmsIncreases.magicka,
    level,
    oghmaChoice
  })
  
  console.log('🔄 [Attribute Transform] Converted assignments:', {
    health: calculatedHealth,
    stamina: calculatedStamina,
    magicka: calculatedMagicka,
    level,
    assignments,
    totalAssignments: Object.keys(assignments).length,
    assignmentKeys: Object.keys(assignments),
    assignmentValues: Object.values(assignments)
  })

  return {
    health: calculatedHealth,
    stamina: calculatedStamina,
    magicka: calculatedMagicka,
    level: level,
    assignments,
  }
}

/**
 * Transform our BuildState attribute assignments to GigaPlanner format
 * 
 * Our system uses level-based assignments, but GigaPlanner expects total points.
 * We need to convert the assignments back to total points.
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
  
  // Calculate totals from assignments (each assignment gives 5 points)
  let health = 0
  let stamina = 0
  let magicka = 0

  // Count assignments for each attribute (each assignment = 1 level)
  Object.values(attributeAssignments.assignments).forEach(assignment => {
    if (assignment === 'health') health += 1
    else if (assignment === 'stamina') stamina += 1
    else if (assignment === 'magicka') magicka += 1
  })

  // Determine Oghma choice from attribute assignments
  // For now, we'll use a simple heuristic: whichever attribute has the most points
  let oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina' = 'None'
  if (health > 0 && health >= stamina && health >= magicka) oghmaChoice = 'Health'
  else if (stamina > 0 && stamina >= magicka) oghmaChoice = 'Stamina'
  else if (magicka > 0) oghmaChoice = 'Magicka'

  // Debug logging
  console.log('🔄 [Attribute Transform] Converting to GigaPlanner:', {
    assignments: attributeAssignments.assignments,
    calculated: { health, stamina, magicka },
    level,
    oghmaChoice
  })

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
