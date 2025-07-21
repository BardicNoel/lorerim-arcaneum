import { PlayerCreationPage } from '@/shared/components/playerCreation'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { ErrorBoundary } from '@/shared/components/generic'
import { useDataFetching } from '@/shared/hooks/useDataFetching'
import { errorReporting } from '@/shared/services/errorReporting'
import { useEffect, useMemo, useState } from 'react'
import { BirthsignCard, BirthsignDetailPanel, BirthsignErrorFallback } from '../components'
import { useFuzzySearch } from '../hooks'
import type { Birthsign } from '../types'
import { getAllGroups, getAllStats, transformBirthsignToPlayerCreationItem } from '../utils'

export function UnifiedBirthsignsPage() {
  const [selectedItem, setSelectedItem] = useState<PlayerCreationItem | null>(null)

  // Data fetching with error handling
  const {
    data: birthsigns = [],
    loading,
    error,
    retry,
  } = useDataFetching<Birthsign[]>({
    url: `${import.meta.env.BASE_URL}data/birthsigns.json`,
    retryCount: 3,
    retryDelay: 1000,
    onError: (error) => {
      errorReporting.reportError(error)
    },
  })

  // Transform birthsigns to PlayerCreationItem format
  const birthsignItems: PlayerCreationItem[] = useMemo(() => {
    return birthsigns?.map(transformBirthsignToPlayerCreationItem) || []
  }, [birthsigns])

  // Generate search categories
  const searchCategories = useMemo(() => {
    const groups = getAllGroups(birthsigns || [])
    const stats = getAllStats(birthsigns || [])

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: [],
      },
      {
        id: 'groups',
        name: 'Birthsign Groups',
        placeholder: 'Search by birthsign group...',
        options: groups.map(group => ({
          id: `group-${group}`,
          label: group,
          value: group,
          category: 'Birthsign Groups',
          description: `Birthsigns from ${group} group`,
        })),
      },
      {
        id: 'stats',
        name: 'Stats & Skills',
        placeholder: 'Search by stats and skills...',
        options: stats.map(stat => ({
          id: `stat-${stat}`,
          label: stat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: stat,
          category: 'Stats & Skills',
          description: `Birthsigns that affect ${stat}`,
        })),
      },
    ]
  }, [birthsigns])

  // Handle item selection
  const handleItemSelect = (item: PlayerCreationItem) => {
    setSelectedItem(item)
  }

  // Handle filters change
  const handleFiltersChange = (filters: any) => {
    // Implement filter logic
    console.log('Filters changed:', filters)
  }

  // Handle search
  const handleSearch = (query: string) => {
    // Implement search logic
    console.log('Search query:', query)
  }

  // Handle tag selection
  const handleTagSelect = (tag: any) => {
    // Implement tag selection logic
    console.log('Tag selected:', tag)
  }

  // Handle tag removal
  const handleTagRemove = (tagId: string) => {
    // Implement tag removal logic
    console.log('Tag removed:', tagId)
  }

  // Render birthsign card
  const renderBirthsignCard = (item: PlayerCreationItem, isSelected: boolean) => {
    const originalBirthsign = birthsigns?.find(birthsign =>
      birthsign.name.toLowerCase().replace(/\s+/g, '-') === item.id
    )

    if (!originalBirthsign) return null

    return (
      <BirthsignCard
        birthsign={originalBirthsign}
        item={item}
        isSelected={isSelected}
        onClick={() => handleItemSelect(item)}
      />
    )
  }

  // Render birthsign detail panel
  const renderBirthsignDetailPanel = (item: PlayerCreationItem) => {
    const originalBirthsign = birthsigns?.find(birthsign =>
      birthsign.name.toLowerCase().replace(/\s+/g, '-') === item.id
    )

    if (!originalBirthsign) return null

    return (
      <BirthsignDetailPanel
        birthsign={originalBirthsign}
        item={item}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading birthsigns...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <BirthsignErrorFallback
        error={error}
        retry={retry}
        title="Failed to load birthsigns"
        message="There was a problem loading the birthsign data. Please try again."
      />
    )
  }

  return (
    <ErrorBoundary
      fallback={<BirthsignErrorFallback />}
      onError={(error, errorInfo) => {
        errorReporting.reportError(error, errorInfo)
      }}
    >
      <PlayerCreationPage
        title="Birth Signs"
        description="Choose your character's birthsign to gain unique abilities and bonuses based on the celestial constellations."
        items={birthsignItems}
        searchCategories={searchCategories}
        selectedItem={selectedItem}
        onItemSelect={handleItemSelect}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        onTagSelect={handleTagSelect}
        onTagRemove={handleTagRemove}
        renderItemCard={renderBirthsignCard}
        renderDetailPanel={renderBirthsignDetailPanel}
        searchPlaceholder="Search birthsigns..."
      />
    </ErrorBoundary>
  )
} 