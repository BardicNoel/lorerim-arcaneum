import { useCallback } from 'react'
import {
  useSkillComputed,
  useSkillData,
  useSkillFilters,
  useSkillState,
} from '../adapters'
import { SkillsPageView } from '../components/view/SkillsPageView'

// Simplified entry point that composes adapters and views
export function SkillsPage() {
  // Use adapters for data and state management
  const { skills, loading, error, refreshSkills } = useSkillData()
  const { selectedSkillId, setSelectedSkillId, assignSkill, unassignSkill } =
    useSkillState()
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    categories,
    clearFilters,
  } = useSkillFilters(skills)
  const { skillSummary, skillsWithAssignment } =
    useSkillComputed(filteredSkills)

  // Handle skill assignment
  const handleAssignMajor = useCallback(
    (skillId: string) => {
      const result = assignSkill(skillId, 'major')
      if (!result.valid) {
        alert(`Cannot assign skill as major: ${result.reason}`)
      } else {
        // Refresh skills to get updated state
        refreshSkills()
      }
    },
    [assignSkill, refreshSkills]
  )

  const handleAssignMinor = useCallback(
    (skillId: string) => {
      const result = assignSkill(skillId, 'minor')
      if (!result.valid) {
        alert(`Cannot assign skill as minor: ${result.reason}`)
      } else {
        // Refresh skills to get updated state
        refreshSkills()
      }
    },
    [assignSkill, refreshSkills]
  )

  const handleRemoveAssignment = useCallback(
    (skillId: string) => {
      unassignSkill(skillId)
      // Refresh skills to get updated state
      refreshSkills()
    },
    [unassignSkill, refreshSkills]
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
