import { BuildPageShell } from '@/shared/components/playerCreation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { PerkReferencesPageView } from './PerkReferencesPageView'

// Main page component that composes adapters and views
export function PerkReferencesPage() {
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
            <PerkReferencesPageView />
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