import { BuildPageShell } from '@/shared/components/playerCreation'
import type {
  PlayerCreationItem,
  SearchCategory,
  SearchOption,
  SelectedTag,
} from '@/shared/components/playerCreation/types'
import { AccordionGrid } from '@/shared/components/ui'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/ui/accordion'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { Label } from '@/shared/ui/ui/label'
import { Switch } from '@/shared/ui/ui/switch'
import {
  ChevronDown,
  Grid3X3,
  List,
  Maximize2,
  Minimize2,
  Settings,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { CustomMultiAutocompleteSearch, SkillAccordion } from '../components'
import { useFuzzySearch } from '../hooks'
import type { Skill } from '../types'
import {
  getAllCategories,
  getAllMetaTags,
  getCategoryPriority,
  transformSkillToPlayerCreationItem,
} from '../utils'

type SortOption = 'alphabetical' | 'category' | 'ability-count'
type ViewMode = 'list' | 'grid'

export function AccordionSkillsPage() {
  // Load skills data from public/data/skills.json at runtime
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Data visibility controls
  const [showScaling, setShowScaling] = useState(true)
  const [showAbilities, setShowAbilities] = useState(true)
  const [showTags, setShowTags] = useState(true)

  useEffect(() => {
    async function fetchSkills() {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
        if (!res.ok) throw new Error('Failed to fetch skills data')
        const data = await res.json()
        setSkills(data.skills || [])
      } catch (err) {
        setError('Failed to load skills data')
        console.error('Error loading skills:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSkills()
  }, [])

  // Convert skills to PlayerCreationItem format for consolidated view
  const skillItems: PlayerCreationItem[] = useMemo(() => {
    return skills.map(transformSkillToPlayerCreationItem)
  }, [skills])

  // Generate enhanced search categories for autocomplete
  const generateSearchCategories = (): SearchCategory[] => {
    const categories = getAllCategories(skills)
    const metaTags = getAllMetaTags(skills)

    return [
      {
        id: 'fuzzy-search',
        name: 'Fuzzy Search',
        placeholder: 'Search by name, description, or abilities...',
        options: [], // Fuzzy search doesn't need predefined options
      },
      {
        id: 'categories',
        name: 'Skill Categories',
        placeholder: 'Search by skill category...',
        options: categories.map(category => ({
          id: `category-${category}`,
          label: category,
          value: category,
          category: 'Skill Categories',
          description: `Skills from ${category} category`,
        })),
      },
      {
        id: 'meta-tags',
        name: 'Meta Tags',
        placeholder: 'Search by meta tags...',
        options: metaTags.map(tag => ({
          id: `tag-${tag}`,
          label: tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value: tag,
          category: 'Meta Tags',
          description: `Skills tagged with ${tag}`,
        })),
      },
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
        category: 'Fuzzy Search',
      }
    } else {
      tag = {
        id: `${optionOrTag.category}-${optionOrTag.id}`,
        label: optionOrTag.label,
        value: optionOrTag.value,
        category: optionOrTag.category,
      }
    }
    // Prevent duplicate tags
    if (
      !selectedTags.some(
        t => t.value === tag.value && t.category === tag.category
      )
    ) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  // Remove a tag
  const handleTagRemove = (tagId: string) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagId))
  }

  // Apply all filters to skills
  const filteredSkills = skills.filter(skill => {
    // If no tags are selected, show all skills
    if (selectedTags.length === 0) return true

    // Check each selected tag
    return selectedTags.every(tag => {
      switch (tag.category) {
        case 'Fuzzy Search':
          // For fuzzy search, we'll handle this separately
          return true

        case 'Skill Categories':
          // Filter by skill category
          return skill.category === tag.value

        case 'Meta Tags':
          // Filter by meta tags
          return skill.metaTags.some(metaTag => metaTag === tag.value)

        default:
          return true
      }
    })
  })

  // Apply fuzzy search to the filtered skills
  const fuzzySearchQuery = selectedTags
    .filter(tag => tag.category === 'Fuzzy Search')
    .map(tag => tag.value)
    .join(' ')

  const { filteredSkills: fuzzyFilteredSkills } = useFuzzySearch(
    filteredSkills,
    fuzzySearchQuery
  )

  // Convert to PlayerCreationItem format
  const displayItems: PlayerCreationItem[] = fuzzyFilteredSkills.map(
    transformSkillToPlayerCreationItem
  )

  // Sort the display items
  const sortedDisplayItems = [...displayItems].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name)
      case 'category':
        // Sort by category priority, then alphabetically within each category
        const aPriority = getCategoryPriority(a.category || '')
        const bPriority = getCategoryPriority(b.category || '')

        if (aPriority !== bPriority) return aPriority - bPriority
        return a.name.localeCompare(b.name)
      case 'ability-count':
        // Sort by number of key abilities (descending), then alphabetically
        const originalSkillA = skills.find(skill => skill.name === a.name)
        const originalSkillB = skills.find(skill => skill.name === b.name)
        const aAbilityCount = originalSkillA?.keyAbilities.length || 0
        const bAbilityCount = originalSkillB?.keyAbilities.length || 0
        if (aAbilityCount !== bAbilityCount)
          return bAbilityCount - aAbilityCount
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  // Handle accordion expansion
  const handleSkillToggle = (skillId: string) => {
    const newExpanded = new Set(expandedSkills)

    if (viewMode === 'grid') {
      // In grid mode, expand/collapse all items in the same row
      const columns = 3 // Match the AccordionGrid columns prop
      const itemIndex = sortedDisplayItems.findIndex(
        item => item.id === skillId
      )
      const rowIndex = Math.floor(itemIndex / columns)
      const rowStartIndex = rowIndex * columns
      const rowEndIndex = Math.min(
        rowStartIndex + columns,
        sortedDisplayItems.length
      )

      // Check if any item in the row is currently expanded
      const isRowExpanded = sortedDisplayItems
        .slice(rowStartIndex, rowEndIndex)
        .some(item => newExpanded.has(item.id))

      if (isRowExpanded) {
        // Collapse all items in the row
        sortedDisplayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.delete(item.id)
        })
      } else {
        // Expand all items in the row
        sortedDisplayItems.slice(rowStartIndex, rowEndIndex).forEach(item => {
          newExpanded.add(item.id)
        })
      }
    } else {
      // In list mode, toggle individual items
      if (newExpanded.has(skillId)) {
        newExpanded.delete(skillId)
      } else {
        newExpanded.add(skillId)
      }
    }

    setExpandedSkills(newExpanded)
  }

  // Handle expand all accordions
  const handleExpandAll = () => {
    const allSkillIds = sortedDisplayItems.map(item => item.id)
    setExpandedSkills(new Set(allSkillIds))
  }

  // Handle collapse all accordions
  const handleCollapseAll = () => {
    setExpandedSkills(new Set())
  }

  // Check if all accordions are expanded
  const allExpanded =
    sortedDisplayItems.length > 0 &&
    sortedDisplayItems.every(item => expandedSkills.has(item.id))

  // Check if any accordions are expanded
  const anyExpanded = sortedDisplayItems.some(item =>
    expandedSkills.has(item.id)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading skills...</p>
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
    <BuildPageShell
      title="Skills"
      description="Master the various skills of Skyrim to enhance your character's abilities and unlock new gameplay options."
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
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              {sortBy === 'alphabetical'
                ? 'A-Z'
                : sortBy === 'category'
                  ? 'Type'
                  : 'Count'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
              Alphabetical
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('category')}>
              Skill Category
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('ability-count')}>
              Ability Count
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <div className="flex border rounded-lg p-1 bg-muted">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 px-3"
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 px-3"
            title="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Expand/Collapse All Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={allExpanded ? handleCollapseAll : handleExpandAll}
          className="flex items-center justify-center"
          title={
            allExpanded ? 'Collapse all accordions' : 'Expand all accordions'
          }
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
                    checked={showScaling && showAbilities && showTags}
                    onCheckedChange={checked => {
                      setShowScaling(checked)
                      setShowAbilities(checked)
                      setShowTags(checked)
                    }}
                  />
                  <span className="text-sm font-medium">Toggle All</span>
                </div>

                {/* Data Visibility Controls */}
                <div className="flex items-stretch gap-3 w-full">
                  {/* Scaling Card */}
                  <div
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setShowScaling(!showScaling)}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Scaling</Label>
                      <p className="text-sm text-muted-foreground">
                        How skills improve with level
                      </p>
                    </div>
                    <Switch
                      checked={showScaling}
                      onCheckedChange={setShowScaling}
                    />
                  </div>

                  {/* Abilities Card */}
                  <div
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setShowAbilities(!showAbilities)}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">
                        Key Abilities
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Main capabilities and features
                      </p>
                    </div>
                    <Switch
                      checked={showAbilities}
                      onCheckedChange={setShowAbilities}
                    />
                  </div>

                  {/* Tags Card */}
                  <div
                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1 min-h-[80px] cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setShowTags(!showTags)}
                  >
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Tags</Label>
                      <p className="text-sm text-muted-foreground">
                        Skill categories and keywords
                      </p>
                    </div>
                    <Switch checked={showTags} onCheckedChange={setShowTags} />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {viewMode === 'grid' ? (
        <AccordionGrid columns={3} gap="md" className="w-full mt-6">
          {sortedDisplayItems.map(item => {
            const originalSkill = skills.find(skill => {
              const skillName = item.id
              return skill.name.toLowerCase().replace(/\s+/g, '-') === skillName
            })
            const isExpanded = expandedSkills.has(item.id)

            return (
              <SkillAccordion
                key={item.id}
                item={item}
                originalSkill={originalSkill}
                isExpanded={isExpanded}
                onToggle={() => handleSkillToggle(item.id)}
                className="w-full"
                showScaling={showScaling}
                showAbilities={showAbilities}
                showTags={showTags}
              />
            )
          })}
        </AccordionGrid>
      ) : (
        <div className="flex flex-col gap-2 w-full mt-6">
          {sortedDisplayItems.map(item => {
            const originalSkill = skills.find(skill => {
              const skillName = item.id
              return skill.name.toLowerCase().replace(/\s+/g, '-') === skillName
            })
            const isExpanded = expandedSkills.has(item.id)

            return (
              <SkillAccordion
                key={item.id}
                item={item}
                originalSkill={originalSkill}
                isExpanded={isExpanded}
                onToggle={() => handleSkillToggle(item.id)}
                className="w-full"
                showScaling={showScaling}
                showAbilities={showAbilities}
                showTags={showTags}
              />
            )
          })}
        </div>
      )}

      {sortedDisplayItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No skills found matching your criteria.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </BuildPageShell>
  )
}
