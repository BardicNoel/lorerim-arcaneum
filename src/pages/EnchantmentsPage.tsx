import React from 'react'
import { H1, H2 } from '@/shared/ui/ui/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { 
  EnchantmentGridContainer,
  EnchantmentDetailSheet
} from '@/features/enchantments/components/composition'
import { StatisticsDashboard } from '@/features/enchantments/components/statistics/composition/StatisticsDashboard'
import { EnchantmentsDataInitializer } from '@/features/enchantments/components/EnchantmentsDataInitializer'
import { useEnchantmentDetail } from '@/features/enchantments/hooks/useEnchantmentDetail'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

export default function EnchantmentsPage() {
  const { selectedEnchantment, openDetail, closeDetail, isOpen } = useEnchantmentDetail()
  const [searchParams] = useSearchParams()

  // Handle URL parameter for pre-selected enchantment
  useEffect(() => {
    const selectedId = searchParams.get('selected')
    if (selectedId) {
      openDetail(selectedId)
    }
  }, [searchParams, openDetail])

  return (
    <div className="bg-background min-h-screen">
      <EnchantmentsDataInitializer />
      
      {/* Detail Sheet */}
      <EnchantmentDetailSheet
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDetail()
          }
        }}
        enchantmentId={selectedEnchantment}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <H1 className="text-4xl font-bold text-skyrim-gold">
            🔮 Enchantments
          </H1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore the vast collection of enchantments available in the world. 
            Discover powerful effects, find items that carry these enchantments, 
            and understand the restrictions that govern their use.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="enchantments" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="enchantments">Enchantments</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="enchantments">
            {/* Main Enchantment Content */}
            <div className="space-y-6">
              {/* Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-skyrim-gold/20">
                  <CardHeader>
                    <CardTitle className="text-skyrim-gold flex items-center gap-2">
                      🎯 Target Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <H2 className="text-lg font-semibold text-skyrim-gold">Touch</H2>
                      <p className="text-sm text-muted-foreground">
                        Enchantments that affect targets when touched, typically found on weapons.
                      </p>
                    </div>
                    <div>
                      <H2 className="text-lg font-semibold text-skyrim-gold">Self</H2>
                      <p className="text-sm text-muted-foreground">
                        Enchantments that affect the wearer, typically found on armor and accessories.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-skyrim-gold/20">
                  <CardHeader>
                    <CardTitle className="text-skyrim-gold flex items-center gap-2">
                      📋 Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <H2 className="text-lg font-semibold text-skyrim-gold">Standard Enchantments</H2>
                      <p className="text-sm text-muted-foreground">
                        Common enchantments available throughout the world.
                      </p>
                    </div>
                    <div>
                      <H2 className="text-lg font-semibold text-skyrim-gold">Unique Enchantments</H2>
                      <p className="text-sm text-muted-foreground">
                        Special enchantments found on specific items or locations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usage Instructions */}
              <Card className="border-skyrim-gold/20">
                <CardHeader>
                  <CardTitle className="text-skyrim-gold flex items-center gap-2">
                    💡 How to Use
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center space-y-2">
                      <div className="text-2xl">🔍</div>
                      <H2 className="text-lg font-semibold">Search & Filter</H2>
                      <p className="text-sm text-muted-foreground">
                        Use the search bar and filters to find specific enchantments by name, category, or effects.
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl">📱</div>
                      <H2 className="text-lg font-semibold">Browse Grid</H2>
                      <p className="text-sm text-muted-foreground">
                        Click on any enchantment card to view detailed information in a modal sheet.
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl">🌐</div>
                      <H2 className="text-lg font-semibold">Global Search</H2>
                      <p className="text-sm text-muted-foreground">
                        Use the global search bar to find enchantments from anywhere in the application.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enchantment Grid */}
              <Card className="border-skyrim-gold/20">
                <CardHeader>
                  <CardTitle className="text-skyrim-gold flex items-center gap-2">
                    ⚡ Enchantment Collection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EnchantmentGridContainer
                    showFilters={true}
                    className="mt-4"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="statistics">
            {/* Statistics Dashboard */}
            <Card className="border-skyrim-gold/20">
              <CardHeader>
                <CardTitle className="text-skyrim-gold flex items-center gap-2">
                  📊 Enchantment Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatisticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
