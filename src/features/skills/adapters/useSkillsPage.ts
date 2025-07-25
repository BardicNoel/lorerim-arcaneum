import { useMemo, useState, useCallback } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useSkillData } from './useSkillData'
import { useSkillFilters } from './useSkillFilters'
import type { UnifiedSkill } from '../types'
import { calculateMinimumSkillLevel } from '../utils/skillLevels'

export interface SkillsPageSkill extends UnifiedSkill {
  assignmentType: 'major' | 'minor' | 'none'
  canAssignMajor: boolean
  canAssignMinor: boolean
  perkCount: string
}

export interface SkillSummary {
  majorCount: number
  minorCount: number
  majorLimit: number
  minorLimit: number
  canAssignMajor: boolean
  canAssignMinor: boolean
  totalSkills: number
  totalPerks: number
  totalPerkRanks: number
}

// Adapter for skills page (combines reference + assignment + transformation)
export function useSkillsPage() {
  // Get base skill data
  const { skills, loading, error, refreshSkills } = useSkillData()
  
  // Get character build state
  const { build, addMajorSkill, addMinorSkill, removeMajorSkill, removeMinorSkill } = useCharacterBuild()

  // Apply filters to skills
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    categories,
    clearFilters,
  } = useSkillFilters(skills)

  // Transform skills for skills page display
  const skillsPageSkills = useMemo(() => {
    return filteredSkills.map(skill => {
      // Get actual selected perks count from character build store
      const selectedPerks = build.perks?.selected?.[skill.id] || []
      const selectedPerksCount = selectedPerks.length
      const totalPerks = skill.totalPerks ?? 0
      
      // Calculate minimum skill level based on selected perks
      const skillLevel = calculateMinimumSkillLevel(
        skill.id,
        selectedPerks,
        build.perks?.ranks || {}
      )
      
      return {
        ...skill,
        selectedPerksCount, // Update the selected perks count
        level: skillLevel, // Update the skill level
        assignmentType: build.skills.major.includes(skill.id)
          ? ('major' as const)
          : build.skills.minor.includes(skill.id)
            ? ('minor' as const)
            : ('none' as const),
        canAssignMajor: !build.skills.major.includes(skill.id) && build.skills.major.length < 3,
        canAssignMinor: !build.skills.minor.includes(skill.id) && build.skills.minor.length < 6,
        perkCount: `${selectedPerksCount}/${totalPerks}`,
      } as SkillsPageSkill
    })
  }, [filteredSkills, build.skills.major, build.skills.minor, build.perks?.selected, build.perks?.ranks])

  // Compute skill summary
  const skillSummary = useMemo(() => {
    return {
      majorCount: build.skills.major.length,
      minorCount: build.skills.minor.length,
      majorLimit: 3,
      minorLimit: 6,
      canAssignMajor: build.skills.major.length < 3,
      canAssignMinor: build.skills.minor.length < 6,
      totalSkills: skillsPageSkills.length,
      totalPerks: skillsPageSkills.reduce(
        (sum, skill) => sum + (skill.selectedPerksCount || 0),
        0
      ),
      totalPerkRanks: 0, // Not tracked in this mapping
    } as SkillSummary
  }, [skillsPageSkills, build.skills.major, build.skills.minor])

  // Assignment handlers
  const handleAssignMajor = useCallback(
    (skillId: string) => {
      addMajorSkill(skillId)
    },
    [addMajorSkill]
  )

  const handleAssignMinor = useCallback(
    (skillId: string) => {
      addMinorSkill(skillId)
    },
    [addMinorSkill]
  )

  const handleRemoveAssignment = useCallback(
    (skillId: string) => {
      removeMajorSkill(skillId)
      removeMinorSkill(skillId)
    },
    [removeMajorSkill, removeMinorSkill]
  )

  // Skill selection state
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  
  const handleSkillSelect = useCallback(
    (skillId: string) => {
      setSelectedSkillId(skillId)
    },
    []
  )

  return {
    // Data
    skills: skillsPageSkills,
    skillSummary,
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
    onAssignMajor: handleAssignMajor,
    onAssignMinor: handleAssignMinor,
    onRemoveAssignment: handleRemoveAssignment,
    onSkillSelect: handleSkillSelect,
    refreshSkills,
  }
} 