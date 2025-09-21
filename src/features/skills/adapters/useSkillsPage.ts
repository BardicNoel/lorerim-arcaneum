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
    majorSkills,
    minorSkills,
    addMajorSkill,
    addMinorSkill,
    removeMajorSkill,
    removeMinorSkill,
    addPerk,
    removePerk,
    setPerkRank,
    getPerkRank,
    getSkillPerks,
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
      const selectedPerks = getSkillPerks(skill.id)
      const selectedPerksCount = selectedPerks.length
      const totalPerks = skill.totalPerks ?? 0

      // Calculate level components separately
      const startingLevel = calculateStartingSkillLevel(skill.id, build)
      const minLevel = calculateMinimumSkillLevel(
        skill.id,
        selectedPerks,
        {} // We'll need to get ranks differently, but for now use empty object
      )

      return {
        ...skill,
        selectedPerksCount,
        level: startingLevel + minLevel, // Total skill level
        startingLevel, // Base level from race + major/minor
        minLevel, // Minimum level from selected perks
        assignmentType: majorSkills.includes(skill.id)
          ? ('major' as const)
          : minorSkills.includes(skill.id)
            ? ('minor' as const)
            : ('none' as const),
        canAssignMajor:
          !majorSkills.includes(skill.id) && majorSkills.length < 3,
        canAssignMinor:
          !minorSkills.includes(skill.id) && minorSkills.length < 6,
        perkCount: `${selectedPerksCount}/${totalPerks}`,
      } as SkillsPageSkill
    })
  }, [filteredSkills, build, majorSkills, minorSkills, getSkillPerks])

  // ============================================================================
  // Skill Summary Calculation
  // ============================================================================
  const skillSummary = useMemo((): SkillSummary => {
    const totalSelectedPerks = skillsPageSkills.reduce(
      (sum, skill) => sum + (skill.selectedPerksCount || 0),
      0
    )

    return {
      majorCount: majorSkills.length,
      minorCount: minorSkills.length,
      majorLimit: 3,
      minorLimit: 6,
      canAssignMajor: majorSkills.length < 3,
      canAssignMinor: minorSkills.length < 6,
      totalSkills: skillsPageSkills.length,
      totalPerks: totalSelectedPerks,
      totalPerkRanks: 0, // Perk ranks not currently tracked
    }
  }, [skillsPageSkills, majorSkills, minorSkills])

  // ============================================================================
  // Action Handlers
  // ============================================================================
  const handleAssignMajor = useCallback(
    (skillId: string) => {
      // Check if skill is already major - if so, remove it
      if (majorSkills.includes(skillId)) {
        removeMajorSkill(skillId)
      } else {
        // Otherwise add it as major
        addMajorSkill(skillId)
      }
    },
    [majorSkills, addMajorSkill, removeMajorSkill]
  )

  const handleAssignMinor = useCallback(
    (skillId: string) => {
      // Check if skill is already minor - if so, remove it
      if (minorSkills.includes(skillId)) {
        removeMinorSkill(skillId)
      } else {
        // Otherwise add it as minor
        addMinorSkill(skillId)
      }
    },
    [minorSkills, addMinorSkill, removeMinorSkill]
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
    if (!selectedSkill) return []
    return getSkillPerks(selectedSkill.id)
  }, [selectedSkill, getSkillPerks])

  // Get perk ranks for the selected skill
  const perkRanks = useMemo(() => {
    if (!selectedSkill) return {}
    // Get all selected perks for this skill and their ranks
    const selectedPerks = getSkillPerks(selectedSkill.id)
    const ranks: Record<string, number> = {}
    selectedPerks.forEach((perkId: string) => {
      ranks[perkId] = getPerkRank(perkId)
    })
    return ranks
  }, [selectedSkill, getSkillPerks, getPerkRank])

  // Get available perks for the selected skill
  const availablePerks = useMemo(() => {
    if (!selectedPerkTree) return []
    return selectedPerkTree.perks || []
  }, [selectedPerkTree])

  // Perk selection handlers
  const handlePerkSelect = useCallback(
    (perkId: string) => {
      if (!selectedSkill) return

      // Toggle perk selection using the character build functions
      const isSelected = selectedPerks.includes(perkId)
      if (isSelected) {
        removePerk(selectedSkill.id, perkId)
      } else {
        addPerk(selectedSkill.id, perkId)
      }
    },
    [selectedSkill, selectedPerks, addPerk, removePerk]
  )

  const handlePerkRankChange = useCallback(
    (perkId: string, rank: number) => {
      console.log('🔧 handlePerkRankChange called:', {
        perkId,
        rank,
        selectedSkill: selectedSkill?.id,
      })

      if (!selectedSkill) {
        console.log('❌ No selected skill, returning early')
        return
      }

      // Use the same logic as usePerkNodeCycle for proper rank cycling
      const currentRank = getPerkRank(perkId) || 0
      console.log('📊 Current rank:', currentRank, 'Target rank:', rank)
      console.log('📋 Selected perks:', selectedPerks)
      console.log('🎯 Perk in selected perks:', selectedPerks.includes(perkId))

      if (rank === 0) {
        console.log('🔄 Going to rank 0, removing perk')
        // Going to rank 0, remove perk and set rank to 0
        if (selectedPerks.includes(perkId)) {
          console.log('🗑️ Removing perk from selected perks')
          removePerk(selectedSkill.id, perkId)
        }
        console.log('📉 Setting rank to 0')
        setPerkRank(perkId, 0)
      } else {
        // For any rank > 0, ensure the perk is in selected perks and set rank
        if (!selectedPerks.includes(perkId)) {
          console.log('➕ Adding perk to selected perks (was missing)')
          addPerk(selectedSkill.id, perkId)
        }

        // Set the rank
        console.log('🔄 Setting rank to:', rank)
        setPerkRank(perkId, rank)
      }
    },
    [
      selectedSkill,
      selectedPerks,
      addPerk,
      removePerk,
      setPerkRank,
      getPerkRank,
    ]
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
