import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useCallback, useMemo, useState } from 'react'
import type { UnifiedSkill } from '../types'
import {
  calculateMinimumSkillLevel,
  calculateStartingSkillLevel,
} from '../utils/skillLevels'
import { usePerkData } from './usePerkData'
import { useSkillData } from './useSkillData'
import { useSkillFilters } from './useSkillFilters'

export interface SkillsPageSkill extends UnifiedSkill {
  assignmentType: 'major' | 'minor' | 'none'
  canAssignMajor: boolean
  canAssignMinor: boolean
  perkCount: string
  startingLevel: number
  minLevel: number
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

// ============================================================================
// Skills Page Adapter
// ============================================================================
// Combines skill data, character build state, and provides calculated levels
// Handles skill assignment, perk management, and filtering functionality

export function useSkillsPage() {
  // ============================================================================
  // Data Sources
  // ============================================================================

  // Get base skill data from store
  const { skills, loading, error, refreshSkills } = useSkillData()

  // Get character build state and assignment functions
  const {
    build,
    addMajorSkill,
    addMinorSkill,
    removeMajorSkill,
    removeMinorSkill,
  } = useCharacterBuild()

  // Apply search and category filters
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    categories,
    clearFilters,
  } = useSkillFilters(skills)

  // Transform skills with calculated level properties
  const skillsPageSkills = useMemo(() => {
    return filteredSkills.map(skill => {
      const selectedPerks = build.perks?.selected?.[skill.id] || []
      const selectedPerksCount = selectedPerks.length
      const totalPerks = skill.totalPerks ?? 0

      // Calculate level components separately
      const startingLevel = calculateStartingSkillLevel(skill.id, build)
      const minLevel = calculateMinimumSkillLevel(
        skill.id,
        selectedPerks,
        build.perks?.ranks || {}
      )

      return {
        ...skill,
        selectedPerksCount,
        level: startingLevel + minLevel, // Total skill level
        startingLevel, // Base level from race + major/minor
        minLevel, // Minimum level from selected perks
        assignmentType: build.skills.major.includes(skill.id)
          ? ('major' as const)
          : build.skills.minor.includes(skill.id)
            ? ('minor' as const)
            : ('none' as const),
        canAssignMajor:
          !build.skills.major.includes(skill.id) &&
          build.skills.major.length < 3,
        canAssignMinor:
          !build.skills.minor.includes(skill.id) &&
          build.skills.minor.length < 6,
        perkCount: `${selectedPerksCount}/${totalPerks}`,
      } as SkillsPageSkill
    })
  }, [filteredSkills, build])

  // ============================================================================
  // Skill Summary Calculation
  // ============================================================================
  const skillSummary = useMemo((): SkillSummary => {
    const totalSelectedPerks = skillsPageSkills.reduce(
      (sum, skill) => sum + (skill.selectedPerksCount || 0),
      0
    )

    return {
      majorCount: build.skills.major.length,
      minorCount: build.skills.minor.length,
      majorLimit: 3,
      minorLimit: 6,
      canAssignMajor: build.skills.major.length < 3,
      canAssignMinor: build.skills.minor.length < 6,
      totalSkills: skillsPageSkills.length,
      totalPerks: totalSelectedPerks,
      totalPerkRanks: 0, // Perk ranks not currently tracked
    }
  }, [skillsPageSkills, build.skills.major, build.skills.minor])

  // ============================================================================
  // Action Handlers
  // ============================================================================
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

  // ============================================================================
  // Skill Selection & Perk Management
  // ============================================================================

  // Skill selection state
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)

  const handleSkillSelect = useCallback((skillId: string) => {
    setSelectedSkillId(skillId)
  }, [])

  // Get selected skill object
  const selectedSkill = useMemo(() => {
    if (!selectedSkillId) return null
    return skillsPageSkills.find(skill => skill.id === selectedSkillId) || null
  }, [selectedSkillId, skillsPageSkills])

  // Use perk data adapter for the selected skill
  const { selectedPerkTree, handleResetPerks } = usePerkData(selectedSkillId)

  // Get selected perks for the selected skill
  const selectedPerks = useMemo(() => {
    if (!selectedSkill || !build.perks?.selected) return []
    return build.perks.selected[selectedSkill.id] || []
  }, [selectedSkill, build.perks?.selected])

  // Get perk ranks for the selected skill
  const perkRanks = useMemo(() => {
    if (!selectedSkill || !build.perks?.ranks) return {}
    return build.perks.ranks[selectedSkill.id] || {}
  }, [selectedSkill, build.perks?.ranks])

  // Get available perks for the selected skill
  const availablePerks = useMemo(() => {
    if (!selectedPerkTree) return []
    return selectedPerkTree.perks || []
  }, [selectedPerkTree])

  // Perk selection handlers
  const handlePerkSelect = useCallback(
    (_perkId: string) => {
      if (!selectedSkill) return

      // Toggle perk selection - implementation would go here
      // const currentSelected = build.perks?.selected?.[selectedSkill.id] || []
      // const isSelected = currentSelected.includes(_perkId)
    },
    [selectedSkill, build.perks?.selected]
  )

  const handlePerkRankChange = useCallback(
    (_perkId: string, _rank: number) => {
      if (!selectedSkill) return

      // Update perk rank - implementation would go here
      // const currentRanks = build.perks?.ranks?.[selectedSkill.id] || {}
    },
    [selectedSkill, build.perks?.ranks]
  )

  // ============================================================================
  // Return Interface
  // ============================================================================

  return {
    // Skills data with calculated levels
    skills: skillsPageSkills,
    skillSummary,
    selectedSkill,
    selectedSkillId,

    // Perk tree data for selected skill
    perkTree: selectedPerkTree,
    selectedPerks,
    perkRanks,
    availablePerks,

    // Loading states
    loading,
    error,

    // Filter controls
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    clearFilters,

    // Skill assignment actions
    onAssignMajor: handleAssignMajor,
    onAssignMinor: handleAssignMinor,
    onRemoveAssignment: handleRemoveAssignment,
    onSkillSelect: handleSkillSelect,

    // Perk management actions
    onPerkSelect: handlePerkSelect,
    onPerkRankChange: handlePerkRankChange,
    onResetPerks: handleResetPerks,
    refreshSkills,
  }
}
