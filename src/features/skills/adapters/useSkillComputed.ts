import { useMemo } from 'react'
import type { UnifiedSkill } from './unifiedAdapter'

// Adapter for computed skill data
export function useSkillComputed(skills: UnifiedSkill[]) {
  const skillSummary = useMemo(() => {
    const majorSkills = skills.filter(skill => skill.assignmentType === 'major')
    const minorSkills = skills.filter(skill => skill.assignmentType === 'minor')
    
    const majorCount = majorSkills.length
    const minorCount = minorSkills.length
    
    return {
      majorCount,
      minorCount,
      majorLimit: 3,
      minorLimit: 6,
      canAssignMajor: majorCount < 3,
      canAssignMinor: minorCount < 6,
      totalSkills: skills.length,
      totalPerks: skills.reduce((sum, skill) => sum + skill.selectedPerksCount, 0),
      totalPerkRanks: skills.reduce((sum, skill) => 
        sum + skill.selectedPerks.reduce((perkSum, perk) => perkSum + perk.currentRank, 0), 0
      ),
    }
  }, [skills])
  
  const skillsWithAssignment = useMemo(() => {
    return skills.map(skill => ({
      ...skill,
      canAssignMajor: skillSummary.canAssignMajor,
      canAssignMinor: skillSummary.canAssignMinor,
    }))
  }, [skills, skillSummary])
  
  const skillsByCategory = useMemo(() => {
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    }, {} as Record<string, UnifiedSkill[]>)
    
    return grouped
  }, [skills])
  
  const skillsByAssignment = useMemo(() => {
    return {
      major: skills.filter(skill => skill.assignmentType === 'major'),
      minor: skills.filter(skill => skill.assignmentType === 'minor'),
      unassigned: skills.filter(skill => skill.assignmentType === 'none'),
    }
  }, [skills])
  
  return {
    skillSummary,
    skillsWithAssignment,
    skillsByCategory,
    skillsByAssignment,
  }
} 