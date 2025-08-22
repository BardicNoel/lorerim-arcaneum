/**
 * Skill Level Transformation Utilities
 * 
 * Handles transformation between GigaPlanner skill data and our app's format
 */

/**
 * Transform GigaPlanner skill levels to our BuildState format
 */
export function transformSkillLevels(
  gigaPlannerSkillLevels: Array<{ skill: string; level: number }>
): Record<string, number> {
  const skillLevels: Record<string, number> = {}
  
  gigaPlannerSkillLevels.forEach(skill => {
    if (skill.skill !== 'Level') {
      // Skip the special 'Level' skill
      skillLevels[skill.skill] = skill.level
    }
  })

  // Debug logging
  console.log('🔄 [Skill Transform] Skill levels:', {
    count: Object.keys(skillLevels).length,
    skills: Object.keys(skillLevels)
  })

  return skillLevels
}

/**
 * Transform our BuildState skill levels to GigaPlanner format
 */
export function transformSkillLevelsToGigaPlanner(
  skillLevels: Record<string, number>
): Array<{ skill: string; level: number }> {
  const gigaPlannerSkillLevels: Array<{ skill: string; level: number }> = []
  
  Object.entries(skillLevels).forEach(([skillName, level]) => {
    gigaPlannerSkillLevels.push({ skill: skillName, level })
  })

  return gigaPlannerSkillLevels
}
