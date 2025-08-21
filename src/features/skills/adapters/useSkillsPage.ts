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

// Adapter for skills page (combines reference + assignment + transformation)
export function useSkillsPage() {
  // Get base skill data
  const {
    skills,
    perkTrees: perkTreesData,
    loading,
    error,
    refreshSkills,
  } = useSkillData()

  // Get character build state
  const {
    build,
    addMajorSkill,
    addMinorSkill,
    removeMajorSkill,
    removeMinorSkill,
  } = useCharacterBuild()

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

      // Calculate separate level components
      const startingLevel = calculateStartingSkillLevel(skill.id, build)
      const minLevel = calculateMinimumSkillLevel(
        skill.id,
        selectedPerks,
        build.perks?.ranks || {}
      )
      const totalLevel = startingLevel + minLevel

      return {
        ...skill,
        selectedPerksCount, // Update the selected perks count
        level: totalLevel, // Total skill level (starting + min level)
        startingLevel, // Starting level (race bonus + major/minor bonuses)
        minLevel, // Minimum level required by selected perks
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
  }, [
    filteredSkills,
    build, // Include full build object for starting skill level calculations
  ])

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

  const handleSkillSelect = useCallback((skillId: string) => {
    setSelectedSkillId(skillId)
  }, [])

  // Get selected skill object
  const selectedSkill = useMemo(() => {
    if (!selectedSkillId) return null
    return skillsPageSkills.find(skill => skill.id === selectedSkillId) || null
  }, [selectedSkillId, skillsPageSkills])

  // Use perk data adapter for the selected skill
  const {
    selectedPerkTree,
    loading: perkLoading,
    error: perkError,
    handleResetPerks,
  } = usePerkData(selectedSkillId)

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
    (perkId: string) => {
      if (!selectedSkill) return

      // Toggle perk selection
      const currentSelected = build.perks?.selected?.[selectedSkill.id] || []
      const isSelected = currentSelected.includes(perkId)

      if (isSelected) {
        // Remove perk
        const newSelected = currentSelected.filter(id => id !== perkId)
        // Update build state (you'll need to implement this)
        console.log('Remove perk:', perkId, 'from skill:', selectedSkill.id)
      } else {
        // Add perk
        const newSelected = [...currentSelected, perkId]
        // Update build state (you'll need to implement this)
        console.log('Add perk:', perkId, 'to skill:', selectedSkill.id)
      }
    },
    [selectedSkill, build.perks?.selected]
  )

  const handlePerkRankChange = useCallback(
    (perkId: string, rank: number) => {
      if (!selectedSkill) return

      // Update perk rank
      const currentRanks = build.perks?.ranks?.[selectedSkill.id] || {}
      const newRanks = { ...currentRanks, [perkId]: rank }

      // Update build state (you'll need to implement this)
      console.log(
        'Update perk rank:',
        perkId,
        'to',
        rank,
        'for skill:',
        selectedSkill.id
      )
    },
    [selectedSkill, build.perks?.ranks]
  )

  return {
    // Data
    skills: skillsPageSkills,
    skillSummary,
    selectedSkill,
    selectedSkillId,
    perkTree: selectedPerkTree,
    selectedPerks,
    perkRanks,
    availablePerks,

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
    onPerkSelect: handlePerkSelect,
    onPerkRankChange: handlePerkRankChange,
    onResetPerks: handleResetPerks,
    refreshSkills,
  }
}
