import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/ui/drawer'
import { ChevronDown, Search, X } from 'lucide-react'
import React, { useCallback, useMemo, useState } from 'react'

export interface MobileAutocompleteDrawerProps<T> {
  // Drawer state
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  
  // Selection callback
  onSelect: (item: T) => void
  
  // Search functionality
  searchPlaceholder: string
  
  // Content
  title: string
  description: string
  triggerText: string
  triggerPlaceholder: string
  
  // Data source - store with search capability
  store: {
    data: T[]
    search: (query: string) => T[]
  }
  
  // Item rendering
  renderItem: (item: T, isSelected: boolean) => React.ReactNode
  
  // Empty state
  emptyMessage: string
  emptySubMessage?: string
  
  // Styling
  className?: string
  disabled?: boolean
}

const MobileAutocompleteDrawerComponent = <T,>({
  isOpen,
  onOpenChange,
  onSelect,
  searchPlaceholder,
  title,
  description,
  triggerText,
  triggerPlaceholder,
  store,
  renderItem,
  emptyMessage,
  emptySubMessage = 'Try adjusting your search',
  className = '',
  disabled = false,
}: MobileAutocompleteDrawerProps<T>) => {
  // Internal search state - completely contained within drawer
  const [searchQuery, setSearchQuery] = useState('')
  
  // Filtered data based on search - memoized for performance
  const filteredData = useMemo(() => {
    if (!store?.data) {
      return []
    }
    if (!searchQuery.trim()) {
      return store.data
    }
    return store.search(searchQuery)
  }, [store, searchQuery])
  
  // Stable search change handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])
  
  // Stable clear handler
  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])
  
  // Stable item selection handler
  const handleItemSelect = useCallback((item: T) => {
    onSelect(item)
    onOpenChange(false) // Close drawer after selection
  }, [onSelect, onOpenChange])
  
  // Reset search when drawer closes
  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
    }
  }, [isOpen])

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal',
            !triggerText && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <span>{triggerText || triggerPlaceholder}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen max-h-screen p-0 flex flex-col">
        <DrawerHeader className="p-4 border-b flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="text-left flex-1">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </div>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-11 w-11 p-0 hover:bg-muted/60 -mr-2 -mt-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DrawerHeader>

        {/* Search Input */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
              autoFocus
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Options List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {filteredData.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-muted-foreground">{emptyMessage}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {emptySubMessage}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemSelect(item)}
                  className="cursor-pointer"
                >
                  {renderItem(item, false)}
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

MobileAutocompleteDrawerComponent.displayName = 'MobileAutocompleteDrawer'

// Memoize the component to prevent unnecessary re-renders
export const MobileAutocompleteDrawer = React.memo(MobileAutocompleteDrawerComponent) as <T>(
  props: MobileAutocompleteDrawerProps<T>
) => React.ReactElement