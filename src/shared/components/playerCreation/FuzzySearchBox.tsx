// Shared FuzzySearchBox component for all features (migrated from features/religions/components/FuzzySearchBox.tsx)
import React, { useState, useRef, useEffect } from 'react'
import { Search, Plus, ChevronDown, X } from 'lucide-react'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { Z_INDEX } from '@/lib/constants'
import type { SearchCategory, SearchOption } from './types'

interface FuzzySearchBoxProps {
  categories: SearchCategory[]
  onSelect: (option: SearchOption) => void
  onCustomSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function FuzzySearchBox({
  categories,
  onSelect,
  onCustomSearch,
  placeholder = 'Search by name, description, or abilities...',
  className = '',
}: FuzzySearchBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] =
    useState<SearchCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // If only one category, auto-select it
  const singleCategory = categories.length === 1 ? categories[0] : null

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedCategory(null)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter options based on search query
  const filteredOptions =
    selectedCategory || singleCategory
      ? (selectedCategory || singleCategory)!.options.filter(
          option =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            option.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
      : categories.flatMap(category =>
          category.options.filter(
            option =>
              option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              option.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        )

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleCategorySelect = (category: SearchCategory) => {
    setSelectedCategory(category)
    setSearchQuery('')
    inputRef.current?.focus()
  }

  const handleOptionSelect = (option: SearchOption) => {
    onSelect(option)
    setSearchQuery('')
    setSelectedCategory(null)
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleCustomSearch = () => {
    if (searchQuery.trim()) {
      onCustomSearch(searchQuery.trim())
      setSearchQuery('')
      setSelectedCategory(null)
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, filteredOptions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        handleOptionSelect(filteredOptions[activeIndex])
      } else if (searchQuery.trim()) {
        // If no option is selected but there's a search query, add it as custom search
        handleCustomSearch()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedCategory(null)
      setActiveIndex(-1)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const currentCategory = selectedCategory || singleCategory
  const showCategorySelection = !singleCategory && !selectedCategory
  const hasCustomQuery =
    searchQuery.trim() &&
    !filteredOptions.some(
      option => option.label.toLowerCase() === searchQuery.toLowerCase()
    )

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={
            currentCategory ? currentCategory.placeholder : placeholder
          }
          value={searchQuery}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20"
        />

        {/* Custom Search Button */}
        {hasCustomQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={handleCustomSearch}
            title="Add custom search term"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}

        {/* Dropdown Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 dropdown-enhanced rounded-lg max-h-96 overflow-y-auto"
          style={{ zIndex: Z_INDEX.AUTOCOMPLETE }}
        >
          {/* Category Selection - only show if multiple categories and no category selected */}
          {showCategorySelection && (
            <div className="p-2 border-b border-border">
              <div className="text-sm font-medium text-muted-foreground mb-2 px-2">
                Categories
              </div>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-2 py-2 hover:bg-muted rounded text-sm flex items-center justify-between"
                >
                  <span>{category.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}

          {/* Custom Search Option */}
          {hasCustomQuery && (
            <div className="p-2 border-b border-border">
              <button
                onClick={handleCustomSearch}
                className="w-full text-left px-2 py-2 hover:bg-muted rounded text-sm flex items-center gap-2"
              >
                <Plus className="h-4 w-4 text-primary" />
                <span className="font-medium">Search for "{searchQuery}"</span>
                <span className="text-xs text-muted-foreground">
                  (Custom search)
                </span>
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="p-2">
            {filteredOptions.length === 0 && !hasCustomQuery ? (
              <div className="px-2 py-4 text-center text-muted-foreground text-sm">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left px-2 py-2 rounded text-sm ${
                    index === activeIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
