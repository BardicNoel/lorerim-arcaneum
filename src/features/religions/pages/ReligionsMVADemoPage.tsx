import { useReligionsStore } from '@/shared/stores/religionsStore'
import { Badge } from '@/shared/ui/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { H2, H3, P } from '@/shared/ui/ui/typography'
import { useState } from 'react'
import { ReligionCard, ReligionSheet } from '../components/composition'
import type { Religion as FeatureReligion } from '../types'
import { mapSharedReligionToFeatureReligion } from '../utils/religionMapper'

export function ReligionsMVADemoPage() {
  const religions = useReligionsStore(state => state.data)
  const [selectedReligion, setSelectedReligion] =
    useState<FeatureReligion | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleOpenDetails = (id: string) => {
    const religion = religions.find(r => r.id === id || r.name === id)
    if (religion) {
      const featureReligion = mapSharedReligionToFeatureReligion(religion)
      setSelectedReligion(featureReligion)
      setIsSheetOpen(true)
    }
  }

  // Sample religions for demo (first 6 from store)
  const sampleReligions = religions
    .slice(0, 6)
    .map(religion => mapSharedReligionToFeatureReligion(religion))

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <H2 className="text-3xl font-bold">Religion Cards Demo</H2>
        <P className="text-muted-foreground max-w-2xl mx-auto">
          Showcasing the new ReligionCard component that follows the RaceCard
          pattern with compact, scan-friendly design and consistent styling
          across desktop and mobile.
        </P>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          {/* Grid Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">ReligionCard</Badge>
                Grid Layout Demo
              </CardTitle>
              <CardDescription>
                ReligionCard Composition Component - Compact grid layout with
                hover effects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleReligions.map((religion, index) => (
                  <ReligionCard
                    key={religion.name}
                    originalReligion={religion}
                    onOpenDetails={handleOpenDetails}
                    showToggle={true}
                    className="h-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* List Demo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">ReligionCard</Badge>
                List Layout Demo
              </CardTitle>
              <CardDescription>
                ReligionCard in list layout - Single column with more space for
                content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleReligions.map((religion, index) => (
                  <ReligionCard
                    key={religion.name}
                    originalReligion={religion}
                    onOpenDetails={handleOpenDetails}
                    showToggle={true}
                    className="w-full"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>ReligionCard Features</CardTitle>
          <CardDescription>
            Key features and improvements over the previous accordion design
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <H3 className="text-lg font-semibold">Visual Design</H3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Compact, scan-friendly layout</li>
                <li>• Icon-forward design with religion avatars</li>
                <li>• Consistent spacing and typography</li>
                <li>• Hover effects and smooth transitions</li>
                <li>• Color-coded category badges</li>
              </ul>
            </div>
            <div className="space-y-4">
              <H3 className="text-lg font-semibold">Functionality</H3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Quick effects count display</li>
                <li>• Favored races chips with overflow</li>
                <li>• Blessing summary in key ability row</li>
                <li>• Tenet chips with tooltips</li>
                <li>• Details sheet for full information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Component Structure</CardTitle>
          <CardDescription>
            How the ReligionCard is organized internally
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <H3 className="text-lg font-semibold mb-2">Card Sections</H3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      1
                    </Badge>
                    <span>Header Row (Avatar, Title, Category, Toggle)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      2
                    </Badge>
                    <span>Meta Row (Effects Pill, Favored Races)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      3
                    </Badge>
                    <span>Key Ability Row (Blessing Summary)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      4
                    </Badge>
                    <span>Tenets Row (Tenet Chips)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      5
                    </Badge>
                    <span>Actions Row (Details, View All)</span>
                  </div>
                </div>
              </div>
              <div>
                <H3 className="text-lg font-semibold mb-2">
                  Shared Components
                </H3>
                <div className="space-y-2 text-sm">
                  <div>
                    • <code>EntityAvatar</code> - Generic avatar component
                  </div>
                  <div>
                    • <code>CategoryBadge</code> - Generic category badges
                  </div>
                  <div>
                    • <code>AddToBuildSwitchSimple</code> - Toggle component
                  </div>
                  <div>
                    • <code>ReligionSheet</code> - Details sheet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ReligionSheet */}
      <ReligionSheet
        religion={selectedReligion}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />
    </div>
  )
}
