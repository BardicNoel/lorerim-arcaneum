import { Z_INDEX } from '@/lib/constants'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { ChevronDown, Search, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface AutocompleteOption {
  id: string
  label: string
  description?: string
  category?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  metadata?: Record<string, any>
}

interface GenericAutocompleteProps {
  options: AutocompleteOption[]
  onSelect: (option: AutocompleteOption) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
  renderOption?: (option: AutocompleteOption, isActive: boolean) => React.ReactNode
  emptyMessage?: string
  maxHeight?: string
  showClearButton?: boolean
  showToggleButton?: boolean
}

export function GenericAutocomplete({
  options,
  onSelect,
  placeholder = 'Search...',
  className = '',
  disabled = false,
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
  renderOption,
  emptyMessage = 'No options found',
  maxHeight = 'max-h-96',
  showClearButton = true,
  showToggleButton = true,
}: GenericAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Use external or internal search query
  const searchQuery = externalSearchQuery ?? internalSearchQuery
  const setSearchQuery = onSearchQueryChange ?? setInternalSearchQuery

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleOptionSelect = (option: AutocompleteOption) => {
    onSelect(option)
    setSearchQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && options[activeIndex]) {
        handleOptionSelect(options[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const clearSearch = () => {
    setSearchQuery('')
    inputRef.current?.focus()
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      inputRef.current?.focus()
    }
  }

  // Default option renderer
  const defaultRenderOption = (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-center gap-3">
      {option.icon && <div className="flex-shrink-0">{option.icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{option.label}</span>
          {option.badge && <div className="flex-shrink-0">{option.badge}</div>}
        </div>
        {option.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {option.description}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20"
          disabled={disabled}
        />
        {showClearButton && searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            onClick={clearSearch}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {showToggleButton && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={toggleDropdown}
            disabled={disabled}
          >
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
            />
          </Button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-1 dropdown-enhanced rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30',
            maxHeight
          )}
          style={{ zIndex: Z_INDEX.AUTOCOMPLETE + 10 }}
        >
          <div className="p-2">
            {options.length === 0 ? (
              <div className="px-2 py-4 text-center text-muted-foreground text-sm">
                {emptyMessage}
              </div>
            ) : (
              options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    'w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer',
                    index === activeIndex
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-muted/60 hover:shadow-sm active:bg-muted/80 active:scale-[0.98]'
                  )}
                  disabled={disabled}
                >
                  {renderOption ? renderOption(option, index === activeIndex) : defaultRenderOption(option, index === activeIndex)}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 