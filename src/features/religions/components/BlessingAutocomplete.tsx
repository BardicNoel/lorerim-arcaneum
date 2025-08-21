import { Z_INDEX } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { BlessingData } from '@/shared/stores/blessingsStore'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { ChevronDown, Search, X, Zap } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface BlessingAutocompleteProps {
  blessings: BlessingData[] | undefined | null
  selectedBlessingId: string | null
  onBlessingSelect: (blessingId: string | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function BlessingAutocomplete({
  blessings,
  selectedBlessingId,
  onBlessingSelect,
  placeholder = 'Search for a blessing source...',
  className,
  disabled = false,
}: BlessingAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter blessings based on search query
  const filteredBlessings = useMemo(() => {
    if (!blessings || !searchQuery.trim()) {
      return blessings || []
    }

    const lowerQuery = searchQuery.toLowerCase()
    return blessings.filter(
      blessing =>
        blessing.name.toLowerCase().includes(lowerQuery) ||
        blessing.blessingName.toLowerCase().includes(lowerQuery) ||
        blessing.blessingDescription.toLowerCase().includes(lowerQuery) ||
        blessing.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }, [blessings, searchQuery])

  // Find selected blessing
  const selectedBlessing = useMemo(() => {
    if (!selectedBlessingId || !blessings) return null
    return blessings.find(blessing => blessing.id === selectedBlessingId)
  }, [selectedBlessingId, blessings])

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

  const handleBlessingSelect = (blessingId: string) => {
    onBlessingSelect(blessingId)
    setSearchQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleClear = () => {
    onBlessingSelect(null)
    setSearchQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, filteredBlessings.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && filteredBlessings[activeIndex]) {
        handleBlessingSelect(filteredBlessings[activeIndex].id)
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

  const getDeityTypeBadge = (type: string) => {
    const typeStyles = {
      Divine: 'bg-blue-100 text-blue-800 border-blue-200',
      'Daedric Prince': 'bg-red-100 text-red-800 border-red-200',
      Tribunal: 'bg-purple-100 text-purple-800 border-purple-200',
      Ancestor: 'bg-green-100 text-green-800 border-green-200',
      'Nordic Deity': 'bg-orange-100 text-orange-800 border-orange-200',
      'Yokudan Deity': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Khajiiti Deity': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      Deity: 'bg-gray-100 text-gray-800 border-gray-200',
    }

    return (
      <Badge
        variant="outline"
        className={cn(
          'text-xs font-medium',
          typeStyles[type as keyof typeof typeStyles] || typeStyles['Deity']
        )}
      >
        {type}
      </Badge>
    )
  }

  const formatDuration = (durationSeconds: number): string => {
    if (durationSeconds === 0) return 'Permanent'
    const hours = Math.floor(durationSeconds / 3600)
    const minutes = Math.floor((durationSeconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`
    }
    return `${minutes}m`
  }

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
          disabled={disabled}
          className="pl-10 pr-20"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
        >
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full left-0 right-0 mt-1 dropdown-enhanced rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30 max-h-60'
          )}
          style={{ zIndex: Z_INDEX.AUTOCOMPLETE + 10 }}
        >
          <div className="p-2">
            {filteredBlessings.length === 0 ? (
              <div className="px-2 py-4 text-center text-muted-foreground text-sm">
                No blessing found.
              </div>
            ) : (
              filteredBlessings.map((blessing, index) => (
                <button
                  key={blessing.id}
                  onClick={() => handleBlessingSelect(blessing.id)}
                  className={cn(
                    'w-full text-left px-3 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer',
                    index === activeIndex
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-muted/60 hover:shadow-sm active:bg-muted/80 active:scale-[0.98]'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{blessing.name}</span>
                    {getDeityTypeBadge(blessing.type)}
                  </div>
                  {blessing.blessingName && (
                    <p className="text-sm font-medium text-primary mb-1">
                      {blessing.blessingName}
                    </p>
                  )}
                  {blessing.effects.length > 0 && (
                    <div className="space-y-1">
                      {blessing.effects
                        .slice(0, 2)
                        .map((effect, effectIndex) => (
                          <div
                            key={effectIndex}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Zap className="h-3 w-3 text-skyrim-gold" />
                            <span className="font-medium">{effect.name}</span>
                            {effect.magnitude > 0 && (
                              <span className="text-xs">
                                +{effect.magnitude}
                              </span>
                            )}
                            {effect.duration > 0 && (
                              <span className="text-xs">
                                ({formatDuration(effect.duration)})
                              </span>
                            )}
                          </div>
                        ))}
                      {blessing.effects.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{blessing.effects.length - 2} more effects
                        </span>
                      )}
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
