import type { Skill } from '../types'
import type { CharacterBuild } from '@/shared/types/build'

export function getSkillAssignmentAndPerks(skill: Skill, build: CharacterBuild) {
  const isMajor = build.skills.major.includes(skill.id)
  const isMinor = build.skills.minor.includes(skill.id)
  const assignmentType = isMajor ? 'major' as const : isMinor ? 'minor' as const : 'none' as const

  // Perk count: count selected perks for this skill
  const selectedPerks = build.perks?.selected?.[skill.id] || []
  const totalPerks = skill.totalPerks || 0
  const perkCount = `${selectedPerks.length}/${totalPerks}`

  // Assignment limits
  const canAssignMajor = !isMajor && build.skills.major.length < 3
  const canAssignMinor = !isMinor && build.skills.minor.length < 6

  return {
    assignmentType,
    perkCount,
    canAssignMajor,
    canAssignMinor,
  }
} 