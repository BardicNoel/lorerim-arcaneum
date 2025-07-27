import { useSkillsPage } from '../adapters'
import { SkillsPageView } from '../components/view/SkillsPageView'

// Simplified entry point that composes adapters and views
export function SkillsPage() {
  // Use specialized adapter for skills page
  const {
    skills,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    selectedSkillId,
    onSkillSelect: handleSkillSelect,
    onAssignMajor: handleAssignMajor,
    onAssignMinor: handleAssignMinor,
    onRemoveAssignment: handleRemoveAssignment,
    onResetPerks: handleResetPerks,
    perkTree,
    skillSummary,
  } = useSkillsPage()

  return (
    <SkillsPageView
      skills={skills}
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
      onResetPerks={handleResetPerks}
      perkTree={perkTree}
      skillSummary={skillSummary}
    />
  )
}
