import React, { useMemo } from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import { cn } from '@/lib/utils'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
import { getDeityOptions } from '../utils/religionFilters'
import { GenericAutocomplete, type AutocompleteOption } from '@/shared/components/generic'
import { Star } from 'lucide-react'
import type { Religion } from '../types'

interface DeityAutocompleteProps {
  religions: Religion[]
  selectedDeityId: string | null
  onDeitySelect: (deityId: string | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DeityAutocomplete({
  religions,
  selectedDeityId,
  onDeitySelect,
  placeholder = "Search for a deity to follow...",
  className,
  disabled = false,
}: DeityAutocompleteProps) {
  // Get deity options
  const deityOptions = useMemo(() => getDeityOptions(religions), [religions])

  // Use fuzzy search
  const { filteredReligions } = useFuzzySearch(religions, '')
  const filteredDeityOptions = useMemo(() => {
    return getDeityOptions(filteredReligions)
  }, [filteredReligions])

  const getDeityTypeBadge = (type: string) => {
    const typeStyles = {
      'Divine': 'bg-blue-100 text-blue-800 border-blue-200',
      'Daedric Prince': 'bg-red-100 text-red-800 border-red-200',
      'Tribunal': 'bg-purple-100 text-purple-800 border-purple-200',
      'Ancestor': 'bg-green-100 text-green-800 border-green-200',
      'Nordic Deity': 'bg-orange-100 text-orange-800 border-orange-200',
      'Yokudan Deity': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Khajiiti Deity': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Deity': 'bg-gray-100 text-gray-800 border-gray-200',
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

  // Convert deity options to AutocompleteOption format
  const autocompleteOptions: AutocompleteOption[] = useMemo(() => {
    return filteredDeityOptions.map(deity => ({
      id: deity.id,
      label: deity.name,
      description: deity.tenetDescription,
      category: deity.type,
      badge: getDeityTypeBadge(deity.type),
      metadata: {
        originalReligion: deity.originalReligion,
        favoredRaces: deity.favoredRaces,
      }
    }))
  }, [filteredDeityOptions])

  const handleDeitySelect = (option: AutocompleteOption) => {
    onDeitySelect(option.id)
  }

  // Custom renderer for deity options
  const renderDeityOption = (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium">{option.label}</span>
          {option.badge}
        </div>
        {option.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
            {option.description}
          </p>
        )}
        {option.metadata?.favoredRaces && option.metadata.favoredRaces.length > 0 && (
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-skyrim-gold" />
            <span className="text-xs text-muted-foreground">
              Favors: {option.metadata.favoredRaces.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleDeitySelect}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      renderOption={renderDeityOption}
      emptyMessage="No deity found."
    />
  )
} 