import { useMemo } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useSkillData } from './useSkillData'
import { useSkillFilters } from './useSkillFilters'
import type { Skill } from '../types'

export interface QuickSelectorSkill extends Skill {
  isMajor: boolean
  isMinor: boolean
  totalPerks: number
  selectedPerks: number
  canAssignMajor: boolean
  canAssignMinor: boolean
}

// Adapter for build page skill selection (QuickSelector view)
export function useSkillsQuickSelector() {
  // Get base skill data
  const { skills, loading, error } = useSkillData()
  
  // Get character build state
  const { build, addMajorSkill, addMinorSkill, removeMajorSkill, removeMinorSkill } = useCharacterBuild()

  // Transform skills for quick selector
  const quickSelectorSkills = useMemo(() => {
    return skills.map(skill => {
      const isMajor = build.skills.major.includes(skill.id)
      const isMinor = build.skills.minor.includes(skill.id)
      
      // Count selected perks for this skill
      const selectedPerks = build.perks?.selected?.[skill.id] || []
      const selectedPerksCount = selectedPerks.length
      
      // Assignment limits
      const canAssignMajor = !isMajor && build.skills.major.length < 3
      const canAssignMinor = !isMinor && build.skills.minor.length < 6

      return {
        ...skill,
        isMajor,
        isMinor,
        totalPerks: skill.totalPerks,
        selectedPerks: selectedPerksCount,
        canAssignMajor,
        canAssignMinor,
      } as QuickSelectorSkill
    })
  }, [skills, build.skills.major, build.skills.minor, build.perks?.selected])

  // Get selected skills for display
  const selectedMajorSkills = useMemo(() => {
    return quickSelectorSkills.filter(skill => skill.isMajor)
  }, [quickSelectorSkills])

  const selectedMinorSkills = useMemo(() => {
    return quickSelectorSkills.filter(skill => skill.isMinor)
  }, [quickSelectorSkills])

  // Get available skills (not already assigned)
  const availableSkills = useMemo(() => {
    return quickSelectorSkills.filter(
      skill => !skill.isMajor && !skill.isMinor
    )
  }, [quickSelectorSkills])

  // Assignment handlers
  const handleMajorSkillSelect = (skill: Skill) => {
    addMajorSkill(skill.id)
  }

  const handleMinorSkillSelect = (skill: Skill) => {
    addMinorSkill(skill.id)
  }

  const handleMajorSkillRemove = (skillId: string) => {
    removeMajorSkill(skillId)
  }

  const handleMinorSkillRemove = (skillId: string) => {
    removeMinorSkill(skillId)
  }

  return {
    // Data
    skills: quickSelectorSkills,
    selectedMajorSkills,
    selectedMinorSkills,
    availableSkills,
    
    // State
    loading,
    error,
    
    // Actions
    handleMajorSkillSelect,
    handleMinorSkillSelect,
    handleMajorSkillRemove,
    handleMinorSkillRemove,
  }
} 