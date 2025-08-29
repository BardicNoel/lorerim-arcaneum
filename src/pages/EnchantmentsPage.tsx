import React, { useState, useEffect, useMemo } from 'react'
import { H1, H2 } from '@/shared/ui/ui/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { BackToTopButton } from '@/shared/components/generic/BackToTopButton'
import { BuildPageShell } from '@/shared/components/playerCreation/BuildPageShell'
import { CustomMultiAutocompleteSearch } from '@/shared/components/playerCreation/CustomMultiAutocompleteSearch'
import type { SearchCategory, SearchOption, SelectedTag } from '@/shared/components/playerCreation/types'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/shared/ui/ui/button'
import { X } from 'lucide-react'
import { 
  EnchantmentGridContainer,
  EnchantmentDetailSheet
} from '@/features/enchantments/components/composition'
import { StatisticsDashboard } from '@/features/enchantments/components/statistics/composition/StatisticsDashboard'
import { EnchantmentsDataInitializer } from '@/features/enchantments/components/EnchantmentsDataInitializer'
import { useSearchParams } from 'react-router-dom'
import type { EnchantmentWithComputed } from '@/features/enchantments/types'
import { useEnchantmentsStore } from '@/shared/stores'
import { useEnchantmentUniformFilters, formatWornRestriction } from '@/features/enchantments/hooks/useEnchantmentUniformFilters'

export default function EnchantmentsPage() {
  const [selectedEnchantment, setSelectedEnchantment] = useState<EnchantmentWithComputed | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [searchParams] = useSearchParams()
  
  // Get enchantment data for count
  const { data: enchantments } = useEnchantmentsStore()
  
  // View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])
  
  // Get store state for sorting
  const { viewState, setViewState } = useEnchantmentsStore()
  const { sortBy, sortOrder } = viewState
  
  // Use the new filtering hook
  const { filteredEnchantments } = useEnchantmentUniformFilters(enchantments, selectedTags)

  // Generate search categories for autocomplete
  const searchCategories = useMemo((): SearchCategory[] => {
    if (!enchantments || enchantments.length === 0) {
      return []
    }

    // Extract unique armor restrictions from wornRestrictions
    const allArmorRestrictions = [...new Set(
      enchantments
        .filter(e => e.isArmorEnchantment) // Only armor enchantments have restrictions
        .flatMap(e => e.wornRestrictions)
        .filter(Boolean) // Remove empty strings
    )].sort()

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, effects, or description...',
        options: [], // No autocomplete options - free-form text input
      },
      {
        id: 'categories',
        name: 'Categories', 
        placeholder: 'Filter by what can be enchanted...',
        options: [
          {
            id: 'category-weapon',
            label: 'Weapon',
            value: 'weapon',
            category: 'Categories',
            description: 'Weapon enchantments',
          },
          {
            id: 'category-armor',
            label: 'Armor',
            value: 'armor', 
            category: 'Categories',
            description: 'Armor enchantments',
          },
        ],
      },
             {
         id: 'armor-restrictions',
         name: 'Armor Restrictions',
         placeholder: 'Filter by armor type restrictions...',
         options: allArmorRestrictions.map(restriction => ({
           id: `restriction-${restriction}`,
           label: formatWornRestriction(restriction),
           value: restriction,
           category: 'Armor Restrictions',
           description: `Enchantments restricted to ${formatWornRestriction(restriction)}`,
         })),
       },
    ]
  }, [enchantments])

  // Tag management
  const handleTagSelect = (optionOrTag: SearchOption | string) => {
    let tag: SelectedTag
    if (typeof optionOrTag === 'string') {
      tag = {
        id: `custom-${optionOrTag}`,
        label: optionOrTag,
        value: optionOrTag,
        category: 'Fuzzy Search',
      }
    } else {
      // Handle 'Categories', 'Armor Restrictions', and 'Fuzzy Search'
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
    }
    
    if (!selectedTags.some(t => t.value === tag.value && t.category === tag.category)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  const handleClearAllTags = () => {
    setSelectedTags([])
  }

  // Handle URL parameter for pre-selected enchantment
  useEffect(() => {
    const selectedId = searchParams.get('selected')
    if (selectedId) {
      // This will be handled by the grid component
      // We'll need to pass this down to trigger the sheet
    }
  }, [searchParams])

  return (
    <BuildPageShell
      title="Enchantments"
      description={`Explore the vast collection of ${enchantments.length} enchantments available in the world. Discover powerful effects, find items that carry these enchantments, and understand the restrictions that govern their use.`}
    >
      <EnchantmentsDataInitializer />
      
      {/* Detail Sheet */}
      <EnchantmentDetailSheet
        enchantment={selectedEnchantment}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />

      {/* Tabs */}
      <Tabs defaultValue="enchantments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="enchantments">Enchantments</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enchantments">
          {/* Search Bar Section */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <CustomMultiAutocompleteSearch
                categories={searchCategories}
                onSelect={handleTagSelect}
                onCustomSearch={handleTagSelect}
              />
            </div>
          </div>

          {/* View Controls Section */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: View Mode Toggle */}
            <div className="flex items-center gap-2">
              <div className="flex border rounded-lg p-1 bg-muted">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  title="Grid view"
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  title="List view"
                >
                  List
                </button>
              </div>
            </div>

                         {/* Right: Sort Options */}
             <div className="relative">
               <select
                 value={sortBy}
                 onChange={(e) => setViewState({ sortBy: e.target.value as any })}
                 className="appearance-none bg-background border border-border rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
               >
                 <option value="name">Sort: A-Z</option>
                 <option value="targetType">Sort: Ench Target</option>
                 <option value="wornRestrictions">Sort: Worn Restrictions</option>
               </select>
               <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
             </div>
          </div>
            
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              {/* Clear All Button */}
              <button
                onClick={handleClearAllTags}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 border border-border/50 hover:border-border cursor-pointer group"
                title="Clear all filters"
              >
                <X className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-200" />
                Clear All
              </button>

              {/* Individual Tags */}
              {selectedTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-skyrim-gold/20 border border-skyrim-gold/30 text-sm font-medium text-skyrim-gold hover:bg-skyrim-gold/30 transition-colors duration-200 cursor-pointer group"
                  onClick={() => handleTagRemove(tag.id)}
                  title="Click to remove"
                >
                  {tag.label}
                  <span className="ml-2 text-skyrim-gold/70 group-hover:text-skyrim-gold transition-colors duration-200">
                    ×
                  </span>
                </span>
              ))}
            </div>
          )}

                     {/* Enchantment Collection */}
           <EnchantmentGridContainer
             showFilters={false}
             enchantments={filteredEnchantments}
             viewMode={viewMode}
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
     
     {/* Back to Top Button */}
     <BackToTopButton threshold={400} />
   </BuildPageShell>
 )
}
