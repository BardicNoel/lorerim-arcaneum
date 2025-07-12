import React from 'react'
import { Input } from '@/shared/ui/ui/input'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { Search, X } from 'lucide-react'
import type { RaceFilters } from '../types'

interface RaceListFilterProps {
  filters: RaceFilters
  onFilterChange: (filters: RaceFilters) => void
}

export function RaceListFilter({ filters, onFilterChange }: RaceListFilterProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value })
  }

  const handleTypeChange = (type: string) => {
    onFilterChange({ ...filters, type })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    onFilterChange({ ...filters, tags: newTags })
  }

  const clearAllFilters = () => {
    onFilterChange({ search: '', type: '', tags: [] })
  }

  const hasActiveFilters = filters.search || filters.type || filters.tags.length > 0

  return (
    <div className="bg-card border rounded-lg shadow-sm p-4">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search races..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Race Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Type:</span>
            <div className="flex gap-1">
              {['All', 'Human', 'Elf', 'Beast'].map((type) => (
                <Button
                  key={type}
                  variant={filters.type === type || (type === 'All' && !filters.type) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTypeChange(type === 'All' ? '' : type)}
                  className="h-7 px-2 text-xs"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Tags:</span>
            <div className="flex gap-1">
              {['Resistance', 'Ability', 'Passive'].map((tag) => (
                <Button
                  key={tag}
                  variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  className="h-7 px-2 text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="secondary" className="text-xs">
                Search: "{filters.search}"
              </Badge>
            )}
            {filters.type && (
              <Badge variant="secondary" className="text-xs">
                Type: {filters.type}
              </Badge>
            )}
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 