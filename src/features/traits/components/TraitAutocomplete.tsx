import { Z_INDEX } from '@/lib/constants'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { ChevronDown, Search, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import type { Trait } from '../types'
import { FormattedText } from '@/shared/components/generic/FormattedText'

interface TraitAutocompleteProps {
  traits: Trait[]
  onSelect: (trait: Trait) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TraitAutocomplete({
  traits,
  onSelect,
  placeholder = 'Search traits...',
  className = '',
  disabled = false,
}: TraitAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

  // Filter traits based on search query
  const filteredTraits = traits.filter(
    trait =>
      trait.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trait.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trait.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trait.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleTraitSelect = (trait: Trait) => {
    onSelect(trait)
    setSearchQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, filteredTraits.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && filteredTraits[activeIndex]) {
        handleTraitSelect(filteredTraits[activeIndex])
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

  return (
    <div ref={containerRef} className={`relative ${className}`}>
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
        {searchQuery && (
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
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 dropdown-enhanced rounded-lg max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30"
          style={{ zIndex: Z_INDEX.AUTOCOMPLETE + 10 }}
        >
          <div className="p-2">
            {filteredTraits.length === 0 ? (
              <div className="px-2 py-4 text-center text-muted-foreground text-sm">
                No traits found
              </div>
            ) : (
              filteredTraits.map((trait, index) => (
                <button
                  key={trait.edid}
                  onClick={() => handleTraitSelect(trait)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                    index === activeIndex
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-muted/60 hover:shadow-sm active:bg-muted/80 active:scale-[0.98]'
                  }`}
                  disabled={disabled}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{trait.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {trait.category && (
                          <Badge variant="outline" className="text-xs">
                            {trait.category}
                          </Badge>
                        )}
                        {trait.effects.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {trait.effects.length} effect
                            {trait.effects.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <FormattedText
                        text={trait.description}
                        className="text-sm text-muted-foreground mt-1 line-clamp-2"
                      />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
