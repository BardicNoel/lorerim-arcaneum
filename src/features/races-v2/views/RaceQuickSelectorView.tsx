import React from 'react'
import { cn } from '@/lib/utils'
import { useRaceData, useRaceFilters, useRaceComputed } from '../adapters'
import { RaceAutocomplete, RaceAccordion } from '../components/composition'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { H3, P } from '@/shared/ui/ui/typography'
import { ChevronDown, X } from 'lucide-react'
import type { Race } from '../types'

interface RaceQuickSelectorViewProps {
  className?: string
  selectedRace?: Race
  onRaceSelect?: (race: Race) => void
  onRaceClear?: () => void
  showSearch?: boolean
  showComparison?: boolean
  maxDisplayRaces?: number
}

export function RaceQuickSelectorView({ 
  className,
  selectedRace,
  onRaceSelect,
  onRaceClear,
  showSearch = true,
  showComparison = false,
  maxDisplayRaces = 3
}: RaceQuickSelectorViewProps) {
  const { races, isLoading, error } = useRaceData()
  const { 
    searchQuery, 
    setSearchQuery, 
    activeFilters, 
    setActiveFilters,
    clearFilters,
    filteredRaces 
  } = useRaceFilters({ races })
  const { 
    transformedRaces, 
    searchCategories, 
    categoriesWithCounts,
    tagsWithCounts 
  } = useRaceComputed({ races, selectedRaceId: selectedRace?.edid || null })

  const [isExpanded, setIsExpanded] = React.useState(false)

  if (isLoading) {
    return (
      <div className={cn('p-4 border rounded-lg', className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('p-4 border rounded-lg', className)}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          <strong>Error:</strong> {error}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="p-4 bg-muted/50 border-b">
        <div className="flex items-center justify-between">
          <H3 className="text-lg font-semibold">Race Selection</H3>
          {selectedRace && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRaceClear}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {selectedRace && (
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">{selectedRace.category}</Badge>
            <P className="text-sm text-muted-foreground">
              {selectedRace.startingStats.health} HP, {selectedRace.startingStats.magicka} MP, {selectedRace.startingStats.stamina} SP
            </P>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {!selectedRace ? (
          <div className="space-y-4">
            {/* Search */}
            {showSearch && (
              <div>
                <P className="text-sm font-medium mb-2">Search for a race:</P>
                <RaceAutocomplete
                  races={filteredRaces}
                  onSelect={onRaceSelect}
                  placeholder="Type to search races..."
                  className="w-full"
                />
              </div>
            )}

            {/* Quick Selection */}
            <div>
              <P className="text-sm font-medium mb-2">Quick select:</P>
              <div className="grid grid-cols-2 gap-2">
                {races.slice(0, maxDisplayRaces).map((race) => (
                  <Button
                    key={race.edid}
                    variant="outline"
                    size="sm"
                    onClick={() => onRaceSelect?.(race)}
                    className="justify-start text-left h-auto p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-xs font-medium">
                        {race.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-xs">{race.name}</div>
                        <div className="text-xs text-muted-foreground">{race.category}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              
              {races.length > maxDisplayRaces && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 w-full"
                >
                  <ChevronDown className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-180')} />
                  Show {races.length - maxDisplayRaces} more races
                </Button>
              )}
            </div>

            {/* Expanded Race List */}
            {isExpanded && (
              <div className="space-y-2">
                {races.slice(maxDisplayRaces).map((race) => (
                  <Button
                    key={race.edid}
                    variant="ghost"
                    size="sm"
                    onClick={() => onRaceSelect?.(race)}
                    className="w-full justify-start text-left h-auto p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-xs font-medium">
                        {race.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-xs">{race.name}</div>
                        <div className="text-xs text-muted-foreground">{race.category}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Selected Race Details */
          <div className="space-y-4">
            <RaceAccordion
              item={{
                id: selectedRace.edid,
                name: selectedRace.name,
                description: selectedRace.description,
                summary: selectedRace.description,
                category: selectedRace.category,
                effects: [],
                tags: [],
                originalRace: selectedRace
              }}
              isExpanded={true}
              showToggle={false}
              className="border-0 shadow-none"
            />
            
            {showComparison && (
              <div className="pt-4 border-t">
                <P className="text-sm font-medium mb-2">Compare with:</P>
                <div className="grid grid-cols-2 gap-2">
                  {races
                    .filter(r => r.edid !== selectedRace.edid)
                    .slice(0, 4)
                    .map((race) => (
                      <Button
                        key={race.edid}
                        variant="outline"
                        size="sm"
                        onClick={() => onRaceSelect?.(race)}
                        className="justify-start text-left h-auto p-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-muted rounded flex items-center justify-center text-xs font-medium">
                            {race.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-xs">{race.name}</div>
                            <div className="text-xs text-muted-foreground">{race.category}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 