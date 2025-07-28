import { useState } from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/ui/tabs'
import { Badge } from '@/shared/ui/ui/badge'
import { Separator } from '@/shared/ui/ui/separator'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useSpellData } from '../adapters/useSpellData'
import { useSpellFilters } from '../adapters/useSpellFilters'
import { useSpellComputed } from '../adapters/useSpellComputed'
import { SpellGrid, SpellList, SpellAccordion } from '../components'
import { SpellBadge } from '../components/atomic'

export function SpellReferenceView() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'accordion'>('grid')
  const [groupBy, setGroupBy] = useState<'school' | 'level' | 'none'>('school')

  // Data adapters
  const { spells, loading, error, schools, levels } = useSpellData()
  
  // Filter adapters
  const {
    filters,
    filteredSpells,
    hasActiveFilters,
    filterCount,
    setSearchTerm,
    setSchools: setFilterSchools,
    setLevels: setFilterLevels,
    setHasEffects,
    setIsAreaSpell,
    setIsDurationSpell,
    clearFilters,
    clearSearch,
    sortBy,
    sortOrder,
    setSortBy,
    toggleSortOrder
  } = useSpellFilters(spells)

  // Computed adapters
  const { statistics } = useSpellComputed(spells)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading spells...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading spells: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.totalSpells}</div>
          <div className="text-sm text-muted-foreground">Total Spells</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.schools.length}</div>
          <div className="text-sm text-muted-foreground">Schools</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.levels.length}</div>
          <div className="text-sm text-muted-foreground">Levels</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.avgMagickaCost}</div>
          <div className="text-sm text-muted-foreground">Avg Cost</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.areaSpells}</div>
          <div className="text-sm text-muted-foreground">Area Spells</div>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <div className="text-2xl font-bold">{statistics.freeSpells}</div>
          <div className="text-sm text-muted-foreground">Free Spells</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search spells by name, school, level, or effects..."
            value={filters.searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {filters.searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* School Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Schools</Label>
            <div className="flex flex-wrap gap-2">
              {schools.map((school) => (
                <SpellBadge
                  key={school}
                  variant={filters.schools.includes(school) ? 'school' : 'outline'}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    const newSchools = filters.schools.includes(school)
                      ? filters.schools.filter(s => s !== school)
                      : [...filters.schools, school]
                    setFilterSchools(newSchools)
                  }}
                >
                  {school}
                </SpellBadge>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Levels</Label>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <SpellBadge
                  key={level}
                  variant={filters.levels.includes(level) ? 'level' : 'outline'}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    const newLevels = filters.levels.includes(level)
                      ? filters.levels.filter(l => l !== level)
                      : [...filters.levels, level]
                    setFilterLevels(newLevels)
                  }}
                >
                  {level}
                </SpellBadge>
              ))}
            </div>
          </div>

          {/* Effect Type Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Effect Types</Label>
            <div className="flex flex-wrap gap-2">
              <SpellBadge
                variant={filters.hasEffects === true ? 'effect' : 'outline'}
                size="sm"
                className="cursor-pointer"
                onClick={() => setHasEffects(filters.hasEffects === true ? null : true)}
              >
                Has Effects
              </SpellBadge>
              <SpellBadge
                variant={filters.isAreaSpell === true ? 'effect' : 'outline'}
                size="sm"
                className="cursor-pointer"
                onClick={() => setIsAreaSpell(filters.isAreaSpell === true ? null : true)}
              >
                Area Spells
              </SpellBadge>
              <SpellBadge
                variant={filters.isDurationSpell === true ? 'effect' : 'outline'}
                size="sm"
                className="cursor-pointer"
                onClick={() => setIsDurationSpell(filters.isDurationSpell === true ? null : true)}
              >
                Duration Spells
              </SpellBadge>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters ({filterCount})
            </Button>
          )}
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'accordion' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('accordion')}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-32 flex items-center gap-2">
                  <ChevronDown className="h-4 w-4" />
                  {sortBy === 'name' ? 'Name' : 
                   sortBy === 'school' ? 'School' : 
                   sortBy === 'level' ? 'Level' : 
                   sortBy === 'magickaCost' ? 'Cost' : 
                   sortBy === 'magnitude' ? 'Magnitude' : 
                   sortBy === 'duration' ? 'Duration' : 'Sort By'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('school')}>
                  School
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('level')}>
                  Level
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('magickaCost')}>
                  Cost
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('magnitude')}>
                  Magnitude
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('duration')}>
                  Duration
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Group By (for accordion) */}
          {viewMode === 'accordion' && (
            <div className="flex items-center gap-2">
              <Label className="text-sm">Group by:</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-24 flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    {groupBy === 'school' ? 'School' : 
                     groupBy === 'level' ? 'Level' : 
                     groupBy === 'none' ? 'None' : 'Group By'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setGroupBy('school')}>
                    School
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGroupBy('level')}>
                    Level
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGroupBy('none')}>
                    None
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {filteredSpells.length} of {spells.length} spells
        </div>
      </div>

      <Separator />

      {/* Spell Display */}
      <div>
        {viewMode === 'grid' && (
          <SpellGrid 
            spells={filteredSpells} 
            variant="default"
            showEffects={true}
            showTags={true}
            columns={3}
          />
        )}
        
        {viewMode === 'list' && (
          <SpellList 
            spells={filteredSpells} 
            variant="default"
            showEffects={true}
            showTags={true}
          />
        )}
        
        {viewMode === 'accordion' && (
          <SpellAccordion 
            spells={filteredSpells} 
            groupBy={groupBy}
            variant="default"
            showEffects={true}
            showTags={true}
          />
        )}
      </div>
    </div>
  )
} 