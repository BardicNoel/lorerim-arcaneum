import React, { useState, useEffect } from 'react'
import { 
  PlayerCreationLayout,
  PlayerCreationContent,
  PlayerCreationItemsSection,
  PlayerCreationDetailSection,
  PlayerCreationEmptyDetail,
  PlayerCreationFilters,
  ItemGrid
} from '@/shared/components/playerCreation'
import { usePlayerCreation } from '@/shared/hooks/usePlayerCreation'
import { usePlayerCreationFilters } from '@/shared/hooks/usePlayerCreationFilters'
import { ReligionCard } from '../components/ReligionCard'
import { ReligionDetailPanel } from '../components/ReligionDetailPanel'
import { BlessingCard } from '../components/BlessingCard'
import { BlessingDetailPanel } from '../components/BlessingDetailPanel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import type { PlayerCreationItem, SearchCategory, SelectedTag } from '@/shared/components/playerCreation/types'
import type { Religion, ReligionPantheon } from '../types'

export function UnifiedReligionsPage() {
  // Load religion data from public/data/wintersun-religion-docs.json at runtime
  const [religions, setReligions] = useState<Religion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'follower' | 'blessing'>('follower')

  useEffect(() => {
    async function fetchReligions() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/wintersun-religion-docs.json`)
        if (!res.ok) throw new Error('Failed to fetch religion data')
        const data = await res.json()
        // Flatten the pantheon structure to get all religions
        const allReligions: Religion[] = data.flatMap((pantheon: ReligionPantheon) => 
          pantheon.deities.map(deity => ({
            ...deity,
            pantheon: pantheon.type // Add pantheon info to each religion
          }))
        )
        setReligions(allReligions)
      } catch (err) {
        setError('Failed to load religion data')
        console.error('Error loading religions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReligions()
  }, [])

  // Convert religions to PlayerCreationItem format for both follower and blessing views
  const followerItems: PlayerCreationItem[] = religions.map(religion => ({
    id: `follower-${religion.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: religion.name,
    description: religion.tenet?.description || '',
    tags: religion.favoredRaces || [],
    summary: religion.tenet?.description || '',
    effects: religion.tenet?.effects?.map(effect => ({
      type: 'positive',
      name: effect.effectName,
      description: effect.effectDescription,
      value: effect.magnitude,
      target: effect.targetAttribute || ''
    })) || [],
    associatedItems: [],
    imageUrl: undefined,
    category: religion.type
  }))

  const blessingItems: PlayerCreationItem[] = religions
    .filter(religion => religion.blessing)
    .map(religion => ({
      id: `blessing-${religion.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: `${religion.name} Blessing`,
      description: religion.blessing?.spellName || '',
      tags: religion.favoredRaces || [],
      summary: religion.blessing?.spellName || '',
      effects: religion.blessing?.effects?.map(effect => ({
        type: 'positive',
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || ''
      })) || [],
      associatedItems: [],
      imageUrl: undefined,
      category: religion.type
    }))

  // Generate search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const pantheons = [...new Set(religions.map(religion => religion.type))]
    const effectTypes = [...new Set(religions.flatMap(religion => 
      religion.blessing?.effects?.map(effect => effect.effectType) || []
    ))]
    const followerTags = [...new Set(followerItems.flatMap(item => item.tags))]
    const blessingTags = [...new Set(blessingItems.flatMap(item => item.tags))]
    const allTags = [...new Set([...followerTags, ...blessingTags])]

    return [
      {
        id: 'pantheons',
        name: 'Pantheons',
        placeholder: 'Search by pantheon...',
        options: pantheons.map(pantheon => ({
          id: `pantheon-${pantheon}`,
          label: pantheon,
          value: pantheon,
          category: 'Pantheons',
          description: `Religions from ${pantheon} pantheon`
        }))
      },
      {
        id: 'effect-types',
        name: 'Effect Types',
        placeholder: 'Search by effect type...',
        options: effectTypes.map(effectType => ({
          id: `effect-${effectType}`,
          label: effectType,
          value: effectType,
          category: 'Effect Types',
          description: `Religions with ${effectType} effects`
        }))
      },
      {
        id: 'tags',
        name: 'Tags',
        placeholder: 'Search by tag...',
        options: allTags.map(tag => ({
          id: `tag-${tag}`,
          label: tag,
          value: tag,
          category: 'Tags',
          description: `Religions tagged with ${tag}`
        }))
      }
    ]
  }

  const searchCategories = generateSearchCategories()

  const {
    selectedItem,
    viewMode,
    filteredItems,
    currentFilters,
    handleItemSelect,
    handleFiltersChange,
    handleSearch,
    handleViewModeChange
  } = usePlayerCreation({
    items: activeTab === 'follower' ? followerItems : blessingItems,
    filters: []
  })

  // Use the new filters hook
  const {
    handleTagSelect,
    handleTagRemove
  } = usePlayerCreationFilters({
    initialFilters: currentFilters,
    onFiltersChange: handleFiltersChange,
    onSearch: handleSearch
  })

  const renderReligionCard = (item: PlayerCreationItem, isSelected: boolean) => (
    <ReligionCard 
      item={item} 
      isSelected={isSelected}
    />
  )

  const renderBlessingCard = (item: PlayerCreationItem, isSelected: boolean) => (
    <BlessingCard 
      item={item} 
      isSelected={isSelected}
    />
  )

  const renderReligionDetailPanel = (item: PlayerCreationItem) => {
    const religionName = item.id.replace('follower-', '').replace('blessing-', '')
    const originalReligion = religions.find(religion => 
      religion.name.toLowerCase().replace(/\s+/g, '-') === religionName
    )
    
    return (
      <ReligionDetailPanel 
        item={item}
        originalReligion={originalReligion}
      />
    )
  }

  const renderBlessingDetailPanel = (item: PlayerCreationItem) => {
    const religionName = item.id.replace('blessing-', '')
    const originalReligion = religions.find(religion => 
      religion.name.toLowerCase().replace(/\s+/g, '-') === religionName
    )
    
    return (
      <BlessingDetailPanel 
        item={item}
        originalReligion={originalReligion}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading religions...</p>
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
    <PlayerCreationLayout
      title="Religions"
      description="Choose your character's religion. Each deity offers unique blessings, tenets, and powers that will guide your spiritual journey through Tamriel."
    >
      <PlayerCreationFilters
        searchCategories={searchCategories}
        selectedTags={currentFilters.selectedTags}
        viewMode={viewMode}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
        onViewModeChange={handleViewModeChange}
      >
        {/* Custom content after filters - Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'follower' | 'blessing')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="follower" className="flex items-center gap-2">
                🙏 Follower
              </TabsTrigger>
              <TabsTrigger value="blessing" className="flex items-center gap-2">
                ✨ Blessing
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </PlayerCreationFilters>

      <PlayerCreationContent>
        <PlayerCreationItemsSection>
          <ItemGrid
            items={filteredItems}
            viewMode={viewMode}
            onItemSelect={handleItemSelect}
            selectedItem={selectedItem}
            renderItemCard={activeTab === 'follower' ? renderReligionCard : renderBlessingCard}
          />
        </PlayerCreationItemsSection>

        <PlayerCreationDetailSection>
          {selectedItem ? (
            activeTab === 'follower' ? renderReligionDetailPanel(selectedItem) : renderBlessingDetailPanel(selectedItem)
          ) : (
            <PlayerCreationEmptyDetail />
          )}
        </PlayerCreationDetailSection>
      </PlayerCreationContent>
    </PlayerCreationLayout>
  )
} 