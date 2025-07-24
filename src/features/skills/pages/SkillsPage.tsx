import { useCallback, useMemo, useState } from 'react'
import { useSkillData, useSkillFilters } from '../adapters'
import { SkillsPageView } from '../components/view/SkillsPageView'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import type { UnifiedSkill } from '../types'

// Simplified entry point that composes adapters and views
export function SkillsPage() {
  // Use adapters for data and state management
  const { skills, loading, error, refreshSkills } = useSkillData()
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    categories,
    clearFilters,
  } = useSkillFilters(skills)

  // Get assignment state from character build
  const {
    addMajorSkill,
    addMinorSkill,
    removeMajorSkill,
    removeMinorSkill,
    build,
  } = useCharacterBuild()

  // Normalize skills data for display
  const normalizedSkills = useMemo(() => {
    return filteredSkills.map((skill: UnifiedSkill) => ({
      ...skill,
      totalPerks: skill.totalPerks || 0,
      selectedPerksCount: skill.selectedPerks?.length || 0,
    }))
  }, [filteredSkills])

  // Combine skills data with assignment state
  const skillsWithAssignment = useMemo(() => {
    return normalizedSkills.map(skill => {
      const selectedPerksCount = skill.selectedPerksCount ?? 0;
      const totalPerks = skill.totalPerks ?? 0;
      return {
        ...skill,
        assignmentType: build.skills.major.includes(skill.id)
          ? ('major' as const)
          : build.skills.minor.includes(skill.id)
            ? ('minor' as const)
            : ('none' as const),
        canAssignMajor: build.skills.major.length < 3,
        canAssignMinor: build.skills.minor.length < 6,
        perkCount: `${selectedPerksCount}/${totalPerks}`,
      };
    });
  }, [normalizedSkills, build.skills.major, build.skills.minor]);

  const skillSummary = useMemo(() => {
    return {
      majorCount: build.skills.major.length,
      minorCount: build.skills.minor.length,
      majorLimit: 3,
      minorLimit: 6,
      canAssignMajor: build.skills.major.length < 3,
      canAssignMinor: build.skills.minor.length < 6,
      totalSkills: skillsWithAssignment.length,
      totalPerks: skillsWithAssignment.reduce(
        (sum, skill) => sum + (skill.selectedPerksCount || 0),
        0
      ),
      totalPerkRanks: 0, // Not tracked in this mapping
    }
  }, [skillsWithAssignment, build.skills.major, build.skills.minor])

  // Handle skill assignment
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

  // Handle skill selection
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  const handleSkillSelect = useCallback(
    (skillId: string) => {
      setSelectedSkillId(skillId)
    },
    []
  )

  // Pass everything to pure view
  return (
    <SkillsPageView
      skills={skillsWithAssignment}
      loading={loading}
      error={error}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedCategory={selectedCategory}
      onCategorySelect={setSelectedCategory}
      categories={categories}
      selectedSkillId={selectedSkillId}
      onSkillSelect={handleSkillSelect}
      onAssignMajor={handleAssignMajor}
      onAssignMinor={handleAssignMinor}
      onRemoveAssignment={handleRemoveAssignment}
      skillSummary={skillSummary}
    />
  )
}
