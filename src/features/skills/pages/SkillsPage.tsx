import { useCallback, useMemo } from 'react'
import { useSkillData, useSkillFilters, useSkillState } from '../adapters'
import { SkillsPageView } from '../components/view/SkillsPageView'

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

  // Get assignment state
  const {
    assignSkill,
    unassignSkill,
    selectedSkillId,
    setSelectedSkillId,
    majorSkills,
    minorSkills,
  } = useSkillState()

  // Combine skills data with assignment state
  const skillsWithAssignment = useMemo(() => {
    return filteredSkills.map(skill => ({
      ...skill,
      assignmentType: majorSkills.includes(skill.id)
        ? ('major' as const)
        : minorSkills.includes(skill.id)
          ? ('minor' as const)
          : ('none' as const),
      canAssignMajor: majorSkills.length < 3,
      canAssignMinor: minorSkills.length < 6,
    }))
  }, [filteredSkills, majorSkills, minorSkills])

  const skillSummary = useMemo(() => {
    return {
      majorCount: majorSkills.length,
      minorCount: minorSkills.length,
      majorLimit: 3,
      minorLimit: 6,
      canAssignMajor: majorSkills.length < 3,
      canAssignMinor: minorSkills.length < 6,
      totalSkills: filteredSkills.length,
      totalPerks: filteredSkills.reduce(
        (sum, skill) => sum + skill.selectedPerksCount,
        0
      ),
      totalPerkRanks: filteredSkills.reduce(
        (sum, skill) =>
          sum +
          skill.selectedPerks.reduce(
            (perkSum, perk) => perkSum + perk.currentRank,
            0
          ),
        0
      ),
    }
  }, [filteredSkills, majorSkills, minorSkills])

  // Handle skill assignment
  const handleAssignMajor = useCallback(
    (skillId: string) => {
      console.log('handleAssignMajor called with skillId:', skillId)
      const result = assignSkill(skillId, 'major')
      console.log('assignSkill result:', result)
      if (!result.valid) {
        alert(`Cannot assign skill as major: ${result.reason}`)
      }
      // No need to refresh - state is updated locally
    },
    [assignSkill]
  )

  const handleAssignMinor = useCallback(
    (skillId: string) => {
      console.log('handleAssignMinor called with skillId:', skillId)
      const result = assignSkill(skillId, 'minor')
      console.log('assignSkill result:', result)
      if (!result.valid) {
        alert(`Cannot assign skill as minor: ${result.reason}`)
      }
      // No need to refresh - state is updated locally
    },
    [assignSkill]
  )

  const handleRemoveAssignment = useCallback(
    (skillId: string) => {
      console.log('handleRemoveAssignment called with skillId:', skillId)
      unassignSkill(skillId)
      // No need to refresh - state is updated locally
    },
    [unassignSkill]
  )

  // Handle skill selection
  const handleSkillSelect = useCallback(
    (skillId: string) => {
      setSelectedSkillId(skillId)
    },
    [setSelectedSkillId]
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
