import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Badge } from '@/shared/ui/ui/badge'
import { useMemo, useState } from 'react'
import { useFuzzySearch } from '../hooks/useFuzzySearch'
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
  const [searchQuery, setSearchQuery] = useState('')
  const { filteredBirthsigns } = useFuzzySearch(birthsigns, searchQuery)

  // Convert filtered birthsigns to AutocompleteOption format
  const autocompleteOptions: AutocompleteOption[] = useMemo(() => {
    return filteredBirthsigns.map(birthsign => ({
      id: birthsign.edid,
      label: birthsign.name,
      description: birthsign.description,
      category: birthsign.group,
      icon: <BirthsignAvatar birthsignName={birthsign.name} size="sm" />,
      badge: birthsign.group && (
        <Badge
          variant="outline"
          className={cn(
            'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
            'text-xs font-medium transition-colors'
          )}
        >
          {birthsign.group}
        </Badge>
      ),
      metadata: {
        originalBirthsign: birthsign,
      },
    }))
  }, [filteredBirthsigns])

  const handleBirthsignSelect = (option: AutocompleteOption) => {
    const selectedBirthsign = birthsigns.find(
      birthsign => birthsign.edid === option.id
    )
    if (selectedBirthsign) {
      onSelect(selectedBirthsign)
    }
  }

  // Custom renderer for birthsign options
  const renderBirthsignOption = (
    option: AutocompleteOption,
    isActive: boolean
  ) => (
    <div className="flex items-center gap-3">
      {option.icon && <div className="flex-shrink-0">{option.icon}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{option.label}</span>
          {option.badge && <div className="flex-shrink-0">{option.badge}</div>}
        </div>
        {option.description && (
          <FormattedText
            text={option.description}
            className="text-sm text-muted-foreground line-clamp-2 mt-1"
          />
        )}
      </div>
    </div>
  )

  return (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleBirthsignSelect}
      placeholder={placeholder}
      className={className}
      renderOption={renderBirthsignOption}
      emptyMessage="No birthsigns found"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )
}
