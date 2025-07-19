import React, { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp, ArrowUpDown, ArrowDownUp, Settings, Maximize2, Minimize2 } from 'lucide-react'
import { 
  PlayerCreationLayout,
} from '@/shared/components/playerCreation'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/ui/accordion'
import { ReligionAccordion } from '../components/ReligionAccordion'
import { CustomMultiAutocompleteSearch } from '../components/CustomMultiAutocompleteSearch'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import { Button } from '@/shared/ui/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { Switch } from '@/shared/ui/ui/switch'
import { Label } from '@/shared/ui/ui/label'
import { SwitchCard, DisplayCustomizeTools, ControlGrid } from '@/shared/components/ui'
import type { PlayerCreationItem, SearchCategory, SelectedTag, SearchOption } from '@/shared/components/playerCreation/types'
import type { Religion, ReligionPantheon } from '../types'

type SortOption = 'alphabetical' | 'divine-type'

export function AccordionReligionsPage() {
  // Load religion data from public/data/wintersun-religion-docs.json at runtime
  const [religions, setReligions] = useState<Religion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedReligions, setExpandedReligions] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  
  // Data visibility controls
  const [showBlessings, setShowBlessings] = useState(true)
  const [showTenets, setShowTenets] = useState(true)
  const [showBoons, setShowBoons] = useState(true)
  const [showFavoredRaces, setShowFavoredRaces] = useState(true)

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

  // Convert religions to PlayerCreationItem format for consolidated view
  const religionItems: PlayerCreationItem[] = religions.map(religion => ({
    id: `religion-${religion.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: religion.name,
    description: religion.tenet?.description || '',
    tags: religion.favoredRaces || [],
    summary: religion.tenet?.description || '',
    effects: [
      // Include tenet effects
      ...(religion.tenet?.effects?.map(effect => ({
        type: 'positive' as const,
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || ''
      })) || []),
      // Include blessing effects if available
      ...(religion.blessing?.effects?.map(effect => ({
        type: 'positive' as const,
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || ''
      })) || [])
    ],
    associatedItems: [],
    imageUrl: undefined,
    category: religion.type
  }))

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const pantheons = [...new Set(religions.map(religion => religion.type))]
    const allTags = [...new Set(religionItems.flatMap(item => item.tags))]

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: [] // Fuzzy search doesn't need predefined options
      },
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
        id: 'favored-races',
        name: 'Favored Races',
        placeholder: 'Search by favored race...',
        options: allTags.map(tag => ({
          id: `race-${tag}`,
          label: tag,
          value: tag,
          category: 'Favored Races',
          description: `Religions that favor ${tag}`
        }))
      }
    ]
  }

  const searchCategories = generateSearchCategories()

  // --- Custom tag/filter state for fuzzy search ---
  const [selectedTags, setSelectedTags] = useState<SelectedTag[]>([])

  // Add a tag (from autocomplete or custom input)
  const handleTagSelect = (optionOrTag: SearchOption | string) => {
    let tag: SelectedTag
    if (typeof optionOrTag === 'string') {
      tag = {
        id: `custom-${optionOrTag}`,
        label: optionOrTag,
        value: optionOrTag,
        category: 'Fuzzy Search'
      }
    } else {
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category
      }
    }
    // Prevent duplicate tags
    if (!selectedTags.some(t => t.value === tag.value && t.category === tag.category)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  // Apply all filters to religions
  const filteredReligions = religions.filter(religion => {
    // If no tags are selected, show all religions
    if (selectedTags.length === 0) return true

    // Check each selected tag
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Fuzzy Search':
          // For fuzzy search, we'll handle this separately
          return true
        
        case 'Pantheons':
          // Filter by pantheon type
          return religion.type === tag.value
        
        case 'Favored Races':
          // Filter by favored races
          return religion.favoredRaces.some(race => race === tag.value)
        
        default:
          return true
      }
    })
  })

  // Apply fuzzy search to the filtered religions
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  const { filteredReligions: fuzzyFilteredReligions } = useFuzzySearch(filteredReligions, fuzzySearchQuery)

  // Convert to PlayerCreationItem format
  const displayItems: PlayerCreationItem[] = fuzzyFilteredReligions.map((religion: Religion) => ({
    id: `religion-${religion.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: religion.name,
    description: religion.tenet?.description || '',
    tags: religion.favoredRaces || [],
    summary: religion.tenet?.description || '',
    effects: [
      // Include tenet effects
      ...(religion.tenet?.effects?.map((effect: any) => ({
        type: 'positive' as const,
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || ''
      })) || []),
      // Include blessing effects if available
      ...(religion.blessing?.effects?.map((effect: any) => ({
        type: 'positive' as const,
        name: effect.effectName,
        description: effect.effectDescription,
        value: effect.magnitude,
        target: effect.targetAttribute || ''
      })) || [])
    ],
    associatedItems: [],
    imageUrl: undefined,
    category: religion.type
  }))

  // Sort the display items
  const sortedDisplayItems = [...displayItems].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name)
      case 'divine-type':
        // Define priority order for divine types based on actual data
        const getTypePriority = (type: string | undefined) => {
          switch (type) {
            case 'Divine': return 1
            case 'Daedric Prince': return 2
            case 'Tribunal': return 3
            case 'Ancestor': return 4
            case 'Nordic Deity': return 5
            case 'Yokudan Deity': return 6
            case 'Khajiiti Deity': return 7
            case 'Deity': return 8
            default: return 9
          }
        }
        
        const aPriority = getTypePriority(a.category)
        const bPriority = getTypePriority(b.category)
        
        // First sort by priority, then alphabetically within each category
        if (aPriority !== bPriority) return aPriority - bPriority
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Handle accordion expansion
  const handleReligionToggle = (religionId: string) => {
    const newExpanded = new Set(expandedReligions)
    if (newExpanded.has(religionId)) {
      newExpanded.delete(religionId)
    } else {
      newExpanded.add(religionId)
    }
    setExpandedReligions(newExpanded)
  }

  // Handle expand all accordions
  const handleExpandAll = () => {
    const allReligionIds = sortedDisplayItems.map(item => item.id)
    setExpandedReligions(new Set(allReligionIds))
  }

  // Handle collapse all accordions
  const handleCollapseAll = () => {
    setExpandedReligions(new Set())
  }

  // Check if all accordions are expanded
  const allExpanded = sortedDisplayItems.length > 0 && 
    sortedDisplayItems.every(item => expandedReligions.has(item.id))

  // Check if any accordions are expanded
  const anyExpanded = sortedDisplayItems.some(item => expandedReligions.has(item.id))

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
      {/* Custom MultiAutocompleteSearch with FuzzySearchBox for keywords */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <CustomMultiAutocompleteSearch
            categories={searchCategories}
            onSelect={handleTagSelect}
            onCustomSearch={handleTagSelect}
          />
        </div>
        
        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ChevronDown className="h-4 w-4" />
              {sortBy === 'alphabetical' ? 'A-Z' : 'Type'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
              Alphabetical
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('divine-type')}>
              Divine Type
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Expand/Collapse All Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={allExpanded ? handleCollapseAll : handleExpandAll}
          className="flex items-center justify-center"
          title={allExpanded ? "Collapse all accordions" : "Expand all accordions"}
        >
          {allExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Selected Tags */}
      <div className="my-4">
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {/* Clear All Button */}
            <button
              onClick={() => setSelectedTags([])}
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
      </div>

      {/* Controls Section */}
      {sortedDisplayItems.length > 0 && (
        <DisplayCustomizeTools>
          {/* Toggle All Control */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30 border-border">
            <Switch
              checked={showBlessings && showTenets && showBoons && showFavoredRaces}
              onCheckedChange={(checked) => {
                setShowBlessings(checked)
                setShowTenets(checked)
                setShowBoons(checked)
                setShowFavoredRaces(checked)
              }}
            />
            <span className="text-sm font-medium">Toggle All</span>
          </div>

          {/* Data Visibility Controls */}
          <ControlGrid columns={4}>
            <SwitchCard
              title="Blessings"
              description="Deity blessings and effects"
              checked={showBlessings}
              onCheckedChange={setShowBlessings}
            />
            
            <SwitchCard
              title="Tenets"
              description="Religious tenets and rules"
              checked={showTenets}
              onCheckedChange={setShowTenets}
            />
            
            <SwitchCard
              title="Boons"
              description="Follower and devotee powers"
              checked={showBoons}
              onCheckedChange={setShowBoons}
            />
            
            <SwitchCard
              title="Favored Races"
              description="Races favored by this deity"
              checked={showFavoredRaces}
              onCheckedChange={setShowFavoredRaces}
            />
          </ControlGrid>
        </DisplayCustomizeTools>
      )}

      <div className="flex flex-col gap-4 w-full mt-6">
        {sortedDisplayItems.map((item) => {
          const originalReligion = religions.find(religion => {
            const religionName = item.id.replace('religion-', '')
            return religion.name.toLowerCase().replace(/\s+/g, '-') === religionName
          })
          const isExpanded = expandedReligions.has(item.id)
          
          return (
            <ReligionAccordion
              key={item.id}
              item={item}
              originalReligion={originalReligion}
              isExpanded={isExpanded}
              onToggle={() => handleReligionToggle(item.id)}
              className="w-full"
              showBlessings={showBlessings}
              showTenets={showTenets}
              showBoons={showBoons}
              showFavoredRaces={showFavoredRaces}
            />
          )
        })}
        
        {sortedDisplayItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No religions found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </PlayerCreationLayout>
  )
} 