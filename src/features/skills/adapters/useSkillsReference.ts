import { useMemo } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useSkillData } from './useSkillData'
import { useSkillFilters } from './useSkillFilters'
import type { UnifiedSkill } from '../types'
import { useState } from 'react'

export interface ReferenceSkill extends UnifiedSkill {
  isMajor: boolean
  isMinor: boolean
  canAssignMajor: boolean
  canAssignMinor: boolean
}

// Adapter for skills page browsing (Reference view)
export function useSkillsReference() {
  // Get base skill data
  const { skills, loading, error } = useSkillData()
  
  // Get character build state
  const { build, addMajorSkill, addMinorSkill, removeMajorSkill, removeMinorSkill } = useCharacterBuild()

  // Transform skills for reference view
  const referenceSkills = useMemo(() => {
    return skills.map(skill => {
      const isMajor = build.skills.major.includes(skill.id)
      const isMinor = build.skills.minor.includes(skill.id)
      
      // Assignment limits
      const canAssignMajor = !isMajor && build.skills.major.length < 3
      const canAssignMinor = !isMinor && build.skills.minor.length < 6

      return {
        ...skill,
        isMajor,
        isMinor,
        canAssignMajor,
        canAssignMinor,
      } as ReferenceSkill
    })
  }, [skills, build.skills.major, build.skills.minor])

  // Apply filters to reference skills
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    categories,
    clearFilters,
  } = useSkillFilters(referenceSkills)

  // Assignment handlers
  const handleAssignMajor = (skillId: string) => {
    // Check if skill is already major - if so, remove it
    if (build.skills.major.includes(skillId)) {
      removeMajorSkill(skillId)
    } else {
      // Otherwise add it as major
      addMajorSkill(skillId)
    }
  }

  const handleAssignMinor = (skillId: string) => {
    // Check if skill is already minor - if so, remove it
    if (build.skills.minor.includes(skillId)) {
      removeMinorSkill(skillId)
    } else {
      // Otherwise add it as minor
      addMinorSkill(skillId)
    }
  }

  const handleRemoveAssignment = (skillId: string) => {
    removeMajorSkill(skillId)
    removeMinorSkill(skillId)
  }

  // Skill selection state
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  
  const handleSkillSelect = (skillId: string) => {
    setSelectedSkillId(skillId)
  }

  return {
    // Data
    skills: filteredSkills,
    allSkills: referenceSkills,
    selectedSkillId,
    
    // State
    loading,
    error,
    
    // Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    clearFilters,
    
    // Actions
    handleAssignMajor,
    handleAssignMinor,
    handleRemoveAssignment,
    handleSkillSelect,
  }
} 