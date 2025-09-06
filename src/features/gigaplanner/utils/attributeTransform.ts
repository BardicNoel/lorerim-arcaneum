/**
 * Attribute Assignment Transformation Utilities
 *
 * Handles transformation between GigaPlanner attribute data and our app's format
 */

/**
 * Transform GigaPlanner attribute assignments to our BuildState format
 *
 * GigaPlanner provides levels (each level = 5 attribute points).
 * Our system stores raw assignment points (not multiplied by 5).
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
} {
  // Start with the base levels from GigaPlanner
  let healthLevels = hmsIncreases.health
  let staminaLevels = hmsIncreases.stamina
  let magickaLevels = hmsIncreases.magicka

  console.log(
    `🔄 [Attribute Transform] Initial levels - Health: ${healthLevels}, Stamina: ${staminaLevels}, Magicka: ${magickaLevels}`
  )

  // Add Oghma choice if not 'None'
  if (oghmaChoice !== 'None') {
    const oghmaValue = 1 // Always add 1 level for Oghma choice
    const attributeKey = oghmaChoice.toLowerCase() as
      | 'health'
      | 'magicka'
      | 'stamina'
    if (attributeKey === 'health') healthLevels += oghmaValue
    else if (attributeKey === 'stamina') staminaLevels += oghmaValue
    else if (attributeKey === 'magicka') magickaLevels += oghmaValue
    console.log(
      `🔄 [Attribute Transform] Added Oghma choice (${oghmaChoice}) to attribute assignments`
    )
  }

  // Our system stores raw assignment points (levels), not multiplied by 5
  // The multiplication by 5 happens in the derived stats calculation

  // Debug logging
  console.log('🔄 [Attribute Transform] GigaPlanner input:', {
    health: hmsIncreases.health,
    stamina: hmsIncreases.stamina,
    magicka: hmsIncreases.magicka,
    level,
    oghmaChoice,
  })

  console.log('🔄 [Attribute Transform] Converted to assignment points:', {
    health: healthLevels,
    stamina: staminaLevels,
    magicka: magickaLevels,
    level,
  })

  return {
    health: healthLevels,
    stamina: staminaLevels,
    magicka: magickaLevels,
    level: level,
  }
}

/**
 * Transform our BuildState attribute assignments to GigaPlanner format
 *
 * Our system stores raw assignment points (levels), and GigaPlanner expects levels.
 * No conversion needed - we store the same values GigaPlanner expects.
 */
export function transformAttributeAssignmentsToGigaPlanner(attributeAssignments: {
  health: number
  stamina: number
  magicka: number
  level: number
}): {
  level: number
  hmsIncreases: { health: number; stamina: number; magicka: number }
  oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina'
} {
  const level = attributeAssignments.level || 1

  // Our system stores raw assignment points (levels), same as GigaPlanner expects
  const health = attributeAssignments.health
  const stamina = attributeAssignments.stamina
  const magicka = attributeAssignments.magicka

  // Determine Oghma choice from attribute assignments
  // For now, we'll use a simple heuristic: whichever attribute has the most points
  let oghmaChoice: 'None' | 'Health' | 'Magicka' | 'Stamina' = 'None'
  if (health > 0 && health >= stamina && health >= magicka)
    oghmaChoice = 'Health'
  else if (stamina > 0 && stamina >= magicka) oghmaChoice = 'Stamina'
  else if (magicka > 0) oghmaChoice = 'Magicka'

  // Debug logging
  console.log('🔄 [Attribute Transform] Converting to GigaPlanner:', {
    assignmentPoints: {
      health: attributeAssignments.health,
      stamina: attributeAssignments.stamina,
      magicka: attributeAssignments.magicka,
    },
    gigaPlannerLevels: { health, stamina, magicka },
    level,
    oghmaChoice,
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
