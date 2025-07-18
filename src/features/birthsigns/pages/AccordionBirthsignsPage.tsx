import React, { useState, useEffect, useMemo } from 'react'
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
import { BirthsignAccordion, CustomMultiAutocompleteSearch } from '../components'
import { useFuzzySearch } from '../hooks'
import { Button } from '@/shared/ui/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { Switch } from '@/shared/ui/ui/switch'
import { Label } from '@/shared/ui/ui/label'
import type { PlayerCreationItem, SearchCategory, SelectedTag, SearchOption } from '@/shared/components/playerCreation/types'
import type { Birthsign } from '../types'
import { transformBirthsignToPlayerCreationItem, getAllGroups, getAllStats, getAllPowers } from '../utils'

type SortOption = 'alphabetical' | 'group' | 'power-count'

export function AccordionBirthsignsPage() {
  // Load birthsign data from public/data/birthsigns.json at runtime
  const [birthsigns, setBirthsigns] = useState<Birthsign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedBirthsigns, setExpandedBirthsigns] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  
  // Data visibility controls
  const [showStats, setShowStats] = useState(true)
  const [showPowers, setShowPowers] = useState(true)
  const [showSkills, setShowSkills] = useState(true)
  const [showEffects, setShowEffects] = useState(true)

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

  // Convert birthsigns to PlayerCreationItem format for consolidated view
  const birthsignItems: PlayerCreationItem[] = useMemo(() => {
    return birthsigns.map(transformBirthsignToPlayerCreationItem)
  }, [birthsigns])

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const groups = getAllGroups(birthsigns)
    const stats = getAllStats(birthsigns)
    const powers = getAllPowers(birthsigns)

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: [] // Fuzzy search doesn't need predefined options
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
          description: `Birthsigns from ${group} group`
        }))
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
          description: `Birthsigns that affect ${stat}`
        }))
      },
      {
        id: 'powers',
        name: 'Powers',
        placeholder: 'Search by powers...',
        options: powers.map(power => ({
          id: `power-${power}`,
          label: power,
          value: power,
          category: 'Powers',
          description: `Birthsigns with ${power} power`
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

  // Apply all filters to birthsigns
  const filteredBirthsigns = birthsigns.filter(birthsign => {
    // If no tags are selected, show all birthsigns
    if (selectedTags.length === 0) return true

    // Check each selected tag
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Fuzzy Search':
          // For fuzzy search, we'll handle this separately
          return true
        
        case 'Birthsign Groups':
          // Filter by birthsign group
          return birthsign.group === tag.value
        
        case 'Stats & Skills':
          // Filter by stats and skills
          const allStats = [
            ...birthsign.stat_modifications.map(stat => stat.stat),
            ...birthsign.skill_bonuses.map(skill => skill.stat)
          ]
          return allStats.some(stat => stat === tag.value)
        
        case 'Powers':
          // Filter by powers
          return birthsign.powers.some(power => power.name === tag.value)
        
        default:
          return true
      }
    })
  })

  // Apply fuzzy search to the filtered birthsigns
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  const { filteredBirthsigns: fuzzyFilteredBirthsigns } = useFuzzySearch(filteredBirthsigns, fuzzySearchQuery)

  // Convert to PlayerCreationItem format
  const displayItems: PlayerCreationItem[] = fuzzyFilteredBirthsigns.map(transformBirthsignToPlayerCreationItem)

  // Sort the display items
  const sortedDisplayItems = [...displayItems].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name)
      case 'group':
        // Define priority order for birthsign groups
        const getGroupPriority = (group: string | undefined) => {
          switch (group) {
            case 'Warrior': return 1
            case 'Mage': return 2
            case 'Thief': return 3
            case 'Serpent': return 4
            case 'Other': return 5
            default: return 6
          }
        }
        
        const aPriority = getGroupPriority(a.category)
        const bPriority = getGroupPriority(b.category)
        
        // First sort by priority, then alphabetically within each category
        if (aPriority !== bPriority) return aPriority - bPriority
        return a.name.localeCompare(b.name)
      case 'power-count':
        // Sort by number of powers (descending), then alphabetically
        const aPowerCount = a.effects?.filter(effect => effect.target === 'power').length || 0
        const bPowerCount = b.effects?.filter(effect => effect.target === 'power').length || 0
        if (aPowerCount !== bPowerCount) return bPowerCount - aPowerCount
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Handle accordion expansion
  const handleBirthsignToggle = (birthsignId: string) => {
    const newExpanded = new Set(expandedBirthsigns)
    if (newExpanded.has(birthsignId)) {
      newExpanded.delete(birthsignId)
    } else {
      newExpanded.add(birthsignId)
    }
    setExpandedBirthsigns(newExpanded)
  }

  // Handle expand all accordions
  const handleExpandAll = () => {
    const allBirthsignIds = sortedDisplayItems.map(item => item.id)
    setExpandedBirthsigns(new Set(allBirthsignIds))
  }

  // Handle collapse all accordions
  const handleCollapseAll = () => {
    setExpandedBirthsigns(new Set())
  }

  // Check if all accordions are expanded
  const allExpanded = sortedDisplayItems.length > 0 && 
    sortedDisplayItems.every(item => expandedBirthsigns.has(item.id))

  // Check if any accordions are expanded
  const anyExpanded = sortedDisplayItems.some(item => expandedBirthsigns.has(item.id))

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
      title="Birth Signs"
      description="Choose your character's birthsign to gain unique abilities and bonuses based on the celestial constellations."
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
              {sortBy === 'alphabetical' ? 'A-Z' : sortBy === 'group' ? 'Group' : 'Power Count'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
              Alphabetical
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('group')}>
              Birthsign Group
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('power-count')}>
              Power Count
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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="customize-display" className="border-none">
            <AccordionTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background hover:bg-muted/50 transition-colors data-[state=open]:rounded-b-none data-[state=open]:border-b-0 justify-start">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Customize Display</span>
            </AccordionTrigger>
            <AccordionContent className="px-3 py-3 rounded-b-lg border border-t-0 bg-background">
              <div className="flex flex-wrap items-center gap-4">
                {/* Toggle All Control */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30 border-border">
                  <Switch
                    checked={showStats && showPowers && showSkills && showEffects}
                    onCheckedChange={(checked) => {
                      setShowStats(checked)
                      setShowPowers(checked)
                      setShowSkills(checked)
                      setShowEffects(checked)
                    }}
                  />
                  <span className="text-sm font-medium">Toggle All</span>
                </div>

                {/* Data Visibility Controls */}
                <div className="flex items-stretch gap-3 w-full">
                  {/* Stats Card */}
                  <div 
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setShowStats(!showStats)}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Stats</Label>
                      <p className="text-sm text-muted-foreground">
                        Attribute modifications
                      </p>
                    </div>
                    <Switch
                      checked={showStats}
                      onCheckedChange={setShowStats}
                    />
                  </div>
                  
                  {/* Powers Card */}
                  <div 
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setShowPowers(!showPowers)}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Powers</Label>
                      <p className="text-sm text-muted-foreground">
                        Special abilities and spells
                      </p>
                    </div>
                    <Switch
                      checked={showPowers}
                      onCheckedChange={setShowPowers}
                    />
                  </div>
                  
                  {/* Skills Card */}
                  <div 
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setShowSkills(!showSkills)}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Skills</Label>
                      <p className="text-sm text-muted-foreground">
                        Skill bonuses and effects
                      </p>
                    </div>
                    <Switch
                      checked={showSkills}
                      onCheckedChange={setShowSkills}
                    />
                  </div>
                  
                  {/* Effects Card */}
                  <div 
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setShowEffects(!showEffects)}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Conditional and mastery effects
                      </p>
                    </div>
                    <Switch
                      checked={showEffects}
                      onCheckedChange={setShowEffects}
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <div className="flex flex-col gap-4 w-full mt-6">
        {sortedDisplayItems.map((item) => {
          const originalBirthsign = birthsigns.find(birthsign => {
            const birthsignName = item.id
            return birthsign.name.toLowerCase().replace(/\s+/g, '-') === birthsignName
          })
          const isExpanded = expandedBirthsigns.has(item.id)
          
          return (
            <BirthsignAccordion
              key={item.id}
              item={item}
              originalBirthsign={originalBirthsign}
              isExpanded={isExpanded}
              onToggle={() => handleBirthsignToggle(item.id)}
              className="w-full"
              showStats={showStats}
              showPowers={showPowers}
              showSkills={showSkills}
              showEffects={showEffects}
            />
          )
        })}
        
        {sortedDisplayItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No birthsigns found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </PlayerCreationLayout>
  )
} 