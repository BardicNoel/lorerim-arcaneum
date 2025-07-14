import React, { useState } from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { H4, P } from '@/shared/ui/ui/typography'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import type { FilterGroup, PlayerCreationFilters } from './types'

interface FilterSidebarProps {
  filters: FilterGroup[]
  selectedFilters: PlayerCreationFilters['selectedFilters']
  onFilterChange: (filters: PlayerCreationFilters['selectedFilters']) => void
  className?: string
}

export function FilterSidebar({ 
  filters, 
  selectedFilters, 
  onFilterChange, 
  className 
}: FilterSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const handleFilterToggle = (groupId: string, value: string, multiSelect?: boolean) => {
    const currentValues = selectedFilters[groupId] || []
    
    if (multiSelect) {
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      onFilterChange({
        ...selectedFilters,
        [groupId]: newValues
      })
    } else {
      // Single select - replace the value
      onFilterChange({
        ...selectedFilters,
        [groupId]: currentValues.includes(value) ? [] : [value]
      })
    }
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const hasActiveFilters = Object.values(selectedFilters).some(values => values.length > 0)

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <H4 className="text-lg">Filters</H4>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {filters.map((filterGroup) => {
        const isExpanded = expandedGroups.has(filterGroup.id)
        const selectedCount = (selectedFilters[filterGroup.id] || []).length
        const hasSelections = selectedCount > 0

        return (
          <div key={filterGroup.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleGroup(filterGroup.id)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <P className="font-medium text-sm">{filterGroup.name}</P>
                {hasSelections && (
                  <Badge variant="default" className="text-xs">
                    {selectedCount}
                  </Badge>
                )}
              </div>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            
            {isExpanded && (
              <div className="px-4 pb-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {filterGroup.options.map((option) => {
                    const isSelected = (selectedFilters[filterGroup.id] || []).includes(option.value)
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleFilterToggle(filterGroup.id, option.value, filterGroup.multiSelect)}
                        className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted/50 hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{option.label}</span>
                          {option.count !== undefined && (
                            <span className="text-xs opacity-70 ml-2">({option.count})</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 