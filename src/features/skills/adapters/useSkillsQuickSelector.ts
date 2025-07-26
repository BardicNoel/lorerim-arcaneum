import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useMemo } from 'react'
import type { UnifiedSkill } from '../types'
import { useSkillData } from './useSkillData'

export interface QuickSelectorSkill extends UnifiedSkill {
  isMajor: boolean
  isMinor: boolean
  canAssignMajor: boolean
  canAssignMinor: boolean
}

// Adapter for build page skill selection (QuickSelector view)
export function useSkillsQuickSelector() {
  // Get base skill data
  const { skills, loading, error } = useSkillData()

  // Get character build state
  const {
    build,
    addMajorSkill,
    addMinorSkill,
    removeMajorSkill,
    removeMinorSkill,
  } = useCharacterBuild()

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
        selectedPerksCount,
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
    return quickSelectorSkills.filter(skill => !skill.isMajor && !skill.isMinor)
  }, [quickSelectorSkills])

  // Assignment handlers
  const handleMajorSkillSelect = (skill: UnifiedSkill) => {
    addMajorSkill(skill.id)
  }

  const handleMinorSkillSelect = (skill: UnifiedSkill) => {
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
