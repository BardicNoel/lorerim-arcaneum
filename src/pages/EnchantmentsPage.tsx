import React, { useState, useEffect } from 'react'
import { H1, H2 } from '@/shared/ui/ui/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { BackToTopButton } from '@/shared/components/generic/BackToTopButton'
import { 
  EnchantmentGridContainer,
  EnchantmentDetailSheet
} from '@/features/enchantments/components/composition'
import { StatisticsDashboard } from '@/features/enchantments/components/statistics/composition/StatisticsDashboard'
import { EnchantmentsDataInitializer } from '@/features/enchantments/components/EnchantmentsDataInitializer'
import { useSearchParams } from 'react-router-dom'
import type { EnchantmentWithComputed } from '@/features/enchantments/types'

export default function EnchantmentsPage() {
  const [selectedEnchantment, setSelectedEnchantment] = useState<EnchantmentWithComputed | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchParams] = useSearchParams()

  // Handle URL parameter for pre-selected enchantment
  useEffect(() => {
    const selectedId = searchParams.get('selected')
    if (selectedId) {
      // This will be handled by the grid component
      // We'll need to pass this down to trigger the sheet
    }
  }, [searchParams])

  return (
    <div className="bg-background min-h-screen">
      <EnchantmentsDataInitializer />
      
      {/* Detail Sheet */}
      <EnchantmentDetailSheet
        enchantment={selectedEnchantment}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
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
            {/* Enchantment Collection */}
            <EnchantmentGridContainer
              showFilters={true}
              className="mt-4"
              onEnchantmentClick={(enchantment) => {
                setSelectedEnchantment(enchantment)
                setIsSheetOpen(true)
              }}
            />
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
      
      {/* Back to Top Button */}
      <BackToTopButton threshold={400} />
    </div>
  )
}
