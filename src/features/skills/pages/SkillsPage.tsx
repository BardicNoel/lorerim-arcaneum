import { BuildPageShell } from '@/shared/components/playerCreation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { useSkillsPage } from '../adapters'
import { SkillsPageView } from '../components/view/SkillsPageView'
import { usePerkReferencesComputed } from '@/features/perk-references/adapters/usePerkReferencesComputed'
import { usePerkReferencesFilters } from '@/features/perk-references/adapters/usePerkReferencesFilters'
import { PerkReferencesPageView } from '@/features/perk-references/pages/PerkReferencesPageView'


// Main page component that composes adapters and views
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

  // Use perk references adapters for the reference tab
  const {
    filteredItems,
    groupedItems,
    stats,
    isLoading: perkReferencesLoading,
    error: perkReferencesError,
    searchCategories,
    availableFilters,
  } = usePerkReferencesComputed()

  const {
    selectedTags,
    viewMode,
    searchQuery: perkSearchQuery,
    onTagSelect,
    onTagRemove,
    onClearTags,
    onViewModeChange,
    onSearchChange,
  } = usePerkReferencesFilters()

  if (loading || perkReferencesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading data...</p>
        </div>
      </div>
    )
  }

  if (error || perkReferencesError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || perkReferencesError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <BuildPageShell
      title="Skills & Perks"
      description="Manage your character's skills and browse all available perks."
    >
      <div className="mb-6">
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Perk Builder</TabsTrigger>
            <TabsTrigger value="reference">Perk References</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="reference" className="space-y-4">
            <PerkReferencesPageView
              items={filteredItems}
              groupedItems={groupedItems}
              stats={stats}
              searchCategories={searchCategories}
              selectedTags={selectedTags}
              viewMode={viewMode}
              searchQuery={perkSearchQuery}
              onTagSelect={onTagSelect}
              onTagRemove={onTagRemove}
              onClearTags={onClearTags}
              onViewModeChange={onViewModeChange}
              onSearchChange={onSearchChange}
            />
          </TabsContent>
        </Tabs>
             </div>
     </BuildPageShell>
   )
 }
