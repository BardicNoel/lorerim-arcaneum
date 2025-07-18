import { useState, useEffect, useMemo } from 'react'
import { PlayerCreationPage } from '@/shared/components/playerCreation/PlayerCreationPage'
import type { PlayerCreationItem, SearchCategory } from '@/shared/components/playerCreation/types'
import { BirthsignCard, BirthsignDetailPanel } from '../components'
import type { Birthsign } from '../types'
import { transformBirthsignToPlayerCreationItem, getAllGroups, getAllStats } from '../utils'

export function UnifiedBirthsignsPage() {
  const [birthsigns, setBirthsigns] = useState<Birthsign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<PlayerCreationItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState({
    search: '',
    selectedFilters: {} as Record<string, any>,
    selectedTags: [] as Array<{ id: string; label: string; value: string; category: string }>
  })

  useEffect(() => {
    async function fetchBirthsigns() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/birthsigns.json`)
        if (!res.ok) throw new Error('Failed to fetch birthsign data')
        const data = await res.json()
        setBirthsigns(data)
      } catch (err) {
        setError('Failed to load birthsign data')
        console.error('Error loading birthsigns:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBirthsigns()
  }, [])

  // Transform birthsigns to PlayerCreationItem format
  const transformedBirthsigns: PlayerCreationItem[] = useMemo(() => {
    return birthsigns.map(transformBirthsignToPlayerCreationItem)
  }, [birthsigns])

  // Generate search categories
  const searchCategories: SearchCategory[] = useMemo(() => {
    const groups = getAllGroups(birthsigns)
    const stats = getAllStats(birthsigns)
    
    return [
      {
        id: 'group',
        name: 'Birthsign Group',
        placeholder: 'Search by birthsign group...',
        options: groups.map((g: string) => ({ 
          id: g.toLowerCase(), 
          label: g, 
          value: g, 
          category: 'group' 
        }))
      },
      {
        id: 'stats',
        name: 'Stats & Skills',
        placeholder: 'Search by stats and skills...',
        options: stats.map((s: string) => ({ 
          id: s.toLowerCase(), 
          label: s.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()), 
          value: s, 
          category: 'stats' 
        }))
      }
    ]
  }, [birthsigns])

  const handleItemSelect = (item: PlayerCreationItem) => {
    setSelectedItem(item)
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }))
  }

  const handleTagSelect = (tag: any) => {
    // Handle tag selection
  }

  const handleTagRemove = (tagId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.filter(tag => tag.id !== tagId)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading birthsigns...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <PlayerCreationPage
      title="Birth Signs"
      description="Choose your character's birthsign to gain unique abilities and bonuses based on the celestial constellations."
      items={transformedBirthsigns}
      searchCategories={searchCategories}
      selectedItem={selectedItem}
      onItemSelect={handleItemSelect}
      onFiltersChange={handleFiltersChange}
      onSearch={handleSearch}
      onTagSelect={handleTagSelect}
      onTagRemove={handleTagRemove}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      renderItemCard={(item: PlayerCreationItem) => (
        <BirthsignCard 
          birthsign={birthsigns.find(b => b.name.toLowerCase().replace(/\s+/g, '-') === item.id)!}
          item={item}
        />
      )}
      renderDetailPanel={(item: PlayerCreationItem) => (
        <BirthsignDetailPanel 
          birthsign={birthsigns.find(b => b.name.toLowerCase().replace(/\s+/g, '-') === item.id)!}
          item={item}
        />
      )}
    />
  )
} 