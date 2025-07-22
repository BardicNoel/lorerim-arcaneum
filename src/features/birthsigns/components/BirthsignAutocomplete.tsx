import { Z_INDEX } from '@/lib/constants'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { ChevronDown, Search, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import type { Birthsign } from '../types'
import { BirthsignAvatar } from './BirthsignAvatar'

interface BirthsignAutocompleteProps {
  birthsigns: Birthsign[]
  onSelect: (birthsign: Birthsign) => void
  placeholder?: string
  className?: string
}

export function BirthsignAutocomplete({
  birthsigns,
  onSelect,
  placeholder = 'Search birthsigns...',
  className = '',
}: BirthsignAutocompleteProps) {
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

  // Filter birthsigns based on search query
  const filteredBirthsigns = birthsigns.filter(
    birthsign =>
      birthsign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      birthsign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      birthsign.group.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInputChange = (value: string) => {
    setSearchQuery(value)
    setIsOpen(true)
    setActiveIndex(-1)
  }

  const handleBirthsignSelect = (birthsign: Birthsign) => {
    onSelect(birthsign)
    setSearchQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, filteredBirthsigns.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && filteredBirthsigns[activeIndex]) {
        handleBirthsignSelect(filteredBirthsigns[activeIndex])
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
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
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
          className="absolute top-full left-0 right-0 mt-1 dropdown-enhanced rounded-lg max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30"
          style={{ zIndex: Z_INDEX.AUTOCOMPLETE + 10 }}
        >
          <div className="p-2">
            {filteredBirthsigns.length === 0 ? (
              <div className="px-2 py-4 text-center text-muted-foreground text-sm">
                No birthsigns found
              </div>
            ) : (
              filteredBirthsigns.map((birthsign, index) => (
                <button
                  key={birthsign.edid}
                  onClick={() => handleBirthsignSelect(birthsign)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer ${
                    index === activeIndex
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-muted/60 hover:shadow-sm active:bg-muted/80 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BirthsignAvatar birthsignName={birthsign.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {birthsign.name}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="text-xs text-muted-foreground truncate">
                          {birthsign.group}
                        </div>
                        {/* Powers count indicator */}
                        {birthsign.powers.length > 0 && (
                          <div className="flex items-center gap-1 text-xs">
                            <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                            <span className="text-muted-foreground">
                              {birthsign.powers.length} power
                              {birthsign.powers.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
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
