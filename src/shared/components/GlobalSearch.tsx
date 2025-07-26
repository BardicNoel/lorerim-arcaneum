import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowUp, ArrowDown, Command } from 'lucide-react'
import { useGlobalSearch, useDataCache, type SearchResult } from '@/shared/data/DataProvider'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { ScrollArea } from '@/shared/ui/ui/scroll-area'
import { cn } from '@/lib/utils'

interface GlobalSearchProps {
  className?: string
  placeholder?: string
}

export function GlobalSearch({ 
  className, 
  placeholder = "Search skills, races, traits, religions..." 
}: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  const { searchAll } = useGlobalSearch()
  const { loadAllData } = useDataCache()
  const navigate = useNavigate()
  
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Load all data when search is opened
  useEffect(() => {
    if (isOpen) {
      loadAllData()
    }
  }, [isOpen, loadAllData])

  // Debounced search
  useEffect(() => {
    if (!isOpen) return

    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true)
        const searchResults = searchAll(query)
        setResults(searchResults)
        setSelectedIndex(0)
        setIsLoading(false)
      } else {
        setResults([])
        setSelectedIndex(0)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, isOpen, searchAll])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setQuery('')
        break
    }
  }, [isOpen, results, selectedIndex])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Search input keyboard events
  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const handleInputKeyDown = (e: KeyboardEvent) => {
      handleKeyDown(e)
    }

    input.addEventListener('keydown', handleInputKeyDown)
    return () => input.removeEventListener('keydown', handleInputKeyDown)
  }, [handleKeyDown])

  // Scroll selected result into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [selectedIndex])

  const handleResultClick = (result: SearchResult) => {
    // Navigate based on result type
    switch (result.type) {
      case 'skill':
        navigate(`/build/perks?skill=${result.id}`)
        break
      case 'race':
        navigate(`/races`)
        break
      case 'trait':
        navigate(`/traits`)
        break
      case 'religion':
        navigate(`/religions`)
        break
      case 'birthsign':
        navigate(`/birthsigns`)
        break
      case 'destiny':
        navigate(`/destiny`)
        break
    }
    
    setIsOpen(false)
    setQuery('')
  }

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'skill':
        return '⚔️'
      case 'race':
        return '👤'
      case 'trait':
        return '🎯'
      case 'religion':
        return '⛪'
      case 'birthsign':
        return '⭐'
      case 'destiny':
        return '🌟'
      default:
        return '📄'
    }
  }

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'skill':
        return 'Skill'
      case 'race':
        return 'Race'
      case 'trait':
        return 'Trait'
      case 'religion':
        return 'Religion'
      case 'birthsign':
        return 'Birthsign'
      case 'destiny':
        return 'Destiny'
      default:
        return 'Item'
    }
  }

  return (
    <div className={cn('relative', className)}>
      {/* Search Trigger Button */}
      <Button
        variant="outline"
        className="w-full justify-start text-sm text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        {placeholder}
        <div className="ml-auto flex items-center gap-1">
          <Command className="h-3 w-3" />
          <span className="text-xs">K</span>
        </div>
      </Button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            {/* Search Input */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results */}
            <div className="max-h-[400px] overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                </div>
              ) : results.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <div ref={resultsRef} className="space-y-1">
                    {results.map((result, index) => (
                      <Card
                        key={`${result.type}-${result.id}`}
                        className={cn(
                          'cursor-pointer transition-colors hover:bg-accent',
                          selectedIndex === index && 'bg-accent border-primary'
                        )}
                        onClick={() => handleResultClick(result)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 text-lg">
                              {getTypeIcon(result.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm truncate">
                                  {result.name}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                  {getTypeLabel(result.type)}
                                </Badge>
                                {result.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.category}
                                  </Badge>
                                )}
                              </div>
                              {result.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {result.description}
                                </p>
                              )}
                              {result.highlights.length > 0 && (
                                <div className="mt-2">
                                  {result.highlights.slice(0, 2).map((highlight, i) => (
                                    <p key={i} className="text-xs text-muted-foreground">
                                      <span className="font-medium">{highlight.field}:</span>{' '}
                                      {highlight.snippet}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex-shrink-0 text-xs text-muted-foreground">
                              {selectedIndex === index && (
                                <div className="flex items-center gap-1">
                                  <ArrowUp className="h-3 w-3" />
                                  <ArrowDown className="h-3 w-3" />
                                  <span>Enter</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              ) : query.trim() ? (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">No results found for "{query}"</p>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">Start typing to search...</p>
                </div>
              )}
            </div>

            {/* Keyboard Shortcuts Help */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <ArrowDown className="h-3 w-3" />
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-muted px-1 rounded">Enter</span>
                  Select
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-muted px-1 rounded">Esc</span>
                  Close
                </span>
              </div>
              <span className="text-xs">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 