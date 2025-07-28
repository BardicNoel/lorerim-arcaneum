import { BuildPageShell } from '@/shared/components/playerCreation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { usePerkReferencesComputed } from '../adapters/usePerkReferencesComputed'
import { usePerkReferencesFilters } from '../adapters/usePerkReferencesFilters'
import { PerkReferencesPageView } from './PerkReferencesPageView'
import { PerkReferencesLayout } from './PerkReferencesLayout'

// Main page component that composes adapters and views
export function PerkReferencesPage() {
  // Use specialized adapters for perk references
  const {
    filteredItems,
    groupedItems,
    stats,
    isLoading,
    error,
    searchCategories,
    availableFilters,
  } = usePerkReferencesComputed()

  const {
    selectedTags,
    viewMode,
    searchQuery,
    onTagSelect,
    onTagRemove,
    onClearTags,
    onViewModeChange,
    onSearchChange,
  } = usePerkReferencesFilters()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading perk data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
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
      title="Perk References"
      description="Browse and search all available perks. Find the perfect abilities for your character build."
    >
      <div className="mb-6">
        <Tabs defaultValue="reference" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Perk Builder</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="reference" className="space-y-4">
            <PerkReferencesLayout>
              <PerkReferencesPageView
                items={filteredItems}
                groupedItems={groupedItems}
                stats={stats}
                searchCategories={searchCategories}
                selectedTags={selectedTags}
                viewMode={viewMode}
                searchQuery={searchQuery}
                onTagSelect={onTagSelect}
                onTagRemove={onTagRemove}
                onClearTags={onClearTags}
                onViewModeChange={onViewModeChange}
                onSearchChange={onSearchChange}
              />
            </PerkReferencesLayout>
          </TabsContent>

          <TabsContent value="builder" className="space-y-4">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">Perk Builder</h3>
              <p className="text-muted-foreground">
                Interactive perk builder coming soon. For now, use the Reference tab to browse perks.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BuildPageShell>
  )
} 