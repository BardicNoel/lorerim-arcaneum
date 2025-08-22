import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { Label } from '@/shared/ui/ui/label'
import { Badge } from '@/shared/ui/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui/ui/dropdown-menu'
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react'
import { useEnchantmentsStore } from '@/shared/stores'
import { EnchantmentBadge } from '../atomic/EnchantmentBadge'
import { useDebounce } from '../../hooks/useDebounce'

interface FilterControlsProps {
  className?: string
  showAdvanced?: boolean
}

export const FilterControls = React.memo<FilterControlsProps>(({
  className,
  showAdvanced = false
}) => {
  const { data: enchantments, filters, setFilters } = useEnchantmentsStore()
  const [isExpanded, setIsExpanded] = useState(showAdvanced)
  const [searchInput, setSearchInput] = useState(filters.searchTerm || '')
  const debouncedSearchTerm = useDebounce(searchInput, 300)
  
  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(enchantments.map(e => e.category))]
    const plugins = [...new Set(enchantments.map(e => e.plugin))]
    const targetTypes = [...new Set(enchantments.map(e => e.targetType))]
    const itemTypes = [...new Set(enchantments.flatMap(e => e.foundOnItems.map(item => item.type)))]
    
    return {
      categories: categories.sort(),
      plugins: plugins.sort(),
      targetTypes: targetTypes.sort(),
      itemTypes: itemTypes.sort()
    }
  }, [enchantments])
  
  // Update search term when debounced value changes
  React.useEffect(() => {
    setFilters({ searchTerm: debouncedSearchTerm })
  }, [debouncedSearchTerm, setFilters])

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
  }
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.categories || []
    const newCategories = checked 
      ? [...currentCategories, category]
      : currentCategories.filter(c => c !== category)
    
    setFilters({ categories: newCategories })
  }
  
  const handleTargetTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.targetTypes || []
    const newTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type)
    
    setFilters({ targetTypes: newTypes })
  }
  
  const handlePluginChange = (plugin: string, checked: boolean) => {
    const currentPlugins = filters.plugins || []
    const newPlugins = checked 
      ? [...currentPlugins, plugin]
      : currentPlugins.filter(p => p !== plugin)
    
    setFilters({ plugins: newPlugins })
  }
  
  const handleItemTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.itemTypes || []
    const newTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type)
    
    setFilters({ itemTypes: newTypes })
  }
  
  const handleHasEffectsChange = (checked: boolean) => {
    setFilters({ hasEffects: checked })
  }
  
  const handleHasWornRestrictionsChange = (checked: boolean) => {
    setFilters({ hasWornRestrictions: checked })
  }
  
  const clearAllFilters = () => {
    setFilters({
      categories: [],
      targetTypes: [],
      itemTypes: [],
      plugins: [],
      searchTerm: '',
      hasEffects: null,
      hasWornRestrictions: null,
      minItemCount: null,
      maxItemCount: null
    })
  }
  
  const removeFilter = (filterType: string, value?: string) => {
    switch (filterType) {
      case 'searchTerm':
        setFilters({ searchTerm: '' })
        break
      case 'categories':
        setFilters({ categories: [] })
        break
      case 'targetTypes':
        setFilters({ targetTypes: [] })
        break
      case 'plugins':
        setFilters({ plugins: [] })
        break
      case 'itemTypes':
        setFilters({ itemTypes: [] })
        break
      case 'hasEffects':
        setFilters({ hasEffects: null })
        break
      case 'hasWornRestrictions':
        setFilters({ hasWornRestrictions: null })
        break
    }
  }
  
  const hasActiveFilters = 
    filters.searchTerm ||
    filters.categories.length > 0 ||
    filters.targetTypes.length > 0 ||
    filters.plugins.length > 0 ||
    filters.itemTypes.length > 0 ||
    filters.hasEffects !== null ||
    filters.hasWornRestrictions !== null
  
  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search enchantments..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.searchTerm}"
              <button
                onClick={() => removeFilter('searchTerm')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="gap-1">
              Category: {category}
              <button
                onClick={() => removeFilter('categories')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.targetTypes.map(type => (
            <Badge key={type} variant="secondary" className="gap-1">
              <EnchantmentBadge type="targetType" value={type} size="sm" />
              <button
                onClick={() => removeFilter('targetTypes')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.plugins.map(plugin => (
            <Badge key={plugin} variant="secondary" className="gap-1">
              Plugin: {plugin}
              <button
                onClick={() => removeFilter('plugins')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.itemTypes.map(type => (
            <Badge key={type} variant="secondary" className="gap-1">
              <EnchantmentBadge type="itemType" value={type} size="sm" />
              <button
                onClick={() => removeFilter('itemTypes')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {filters.hasEffects !== null && (
            <Badge variant="secondary" className="gap-1">
              Has Effects: {filters.hasEffects ? 'Yes' : 'No'}
              <button
                onClick={() => removeFilter('hasEffects')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.hasWornRestrictions !== null && (
            <Badge variant="secondary" className="gap-1">
              Has Restrictions: {filters.hasWornRestrictions ? 'Yes' : 'No'}
              <button
                onClick={() => removeFilter('hasWornRestrictions')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs"
          >
            Clear All
          </Button>
        </div>
      )}
      
      {/* Filter Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onChange={(e) => handleCategoryChange(category, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Target Type Filter */}
          <div className="space-y-2">
            <Label>Target Type</Label>
            <div className="space-y-2">
              {filterOptions.targetTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`target-${type}`}
                    checked={filters.targetTypes.includes(type)}
                    onChange={(e) => handleTargetTypeChange(type, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`target-${type}`} className="text-sm">
                    <EnchantmentBadge type="targetType" value={type} size="sm" />
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Plugin Filter */}
          <div className="space-y-2">
            <Label>Plugin</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filterOptions.plugins.map(plugin => (
                <div key={plugin} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`plugin-${plugin}`}
                    checked={filters.plugins.includes(plugin)}
                    onChange={(e) => handlePluginChange(plugin, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`plugin-${plugin}`} className="text-sm">
                    {plugin}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Item Type Filter */}
          <div className="space-y-2">
            <Label>Item Type</Label>
            <div className="space-y-2">
              {filterOptions.itemTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`item-${type}`}
                    checked={filters.itemTypes.includes(type)}
                    onChange={(e) => handleItemTypeChange(type, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`item-${type}`} className="text-sm">
                    <EnchantmentBadge type="itemType" value={type} size="sm" />
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Has Effects Filter */}
          <div className="space-y-2">
            <Label>Has Effects</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="has-effects"
                  checked={filters.hasEffects === true}
                  onChange={(e) => handleHasEffectsChange(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="has-effects" className="text-sm">
                  Has Effects
                </Label>
              </div>
            </div>
          </div>
          
          {/* Has Worn Restrictions Filter */}
          <div className="space-y-2">
            <Label>Has Worn Restrictions</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="has-restrictions"
                  checked={filters.hasWornRestrictions === true}
                  onChange={(e) => handleHasWornRestrictionsChange(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="has-restrictions" className="text-sm">
                  Has Restrictions
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
