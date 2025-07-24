import React, { useMemo } from 'react'
import { Badge } from '@/shared/ui/ui/badge'
import {
  GenericAutocomplete,
  type AutocompleteOption,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import type { Trait } from '../types'

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
  // Convert traits to AutocompleteOption format
  const autocompleteOptions: AutocompleteOption[] = useMemo(() => {
    return traits.map(trait => ({
      id: trait.edid,
      label: trait.name,
      description: trait.description,
      category: trait.category,
      badge: trait.category && (
        <Badge variant="outline" className="text-xs">
          {trait.category}
        </Badge>
      ),
      metadata: {
        originalTrait: trait,
        effectsCount: trait.effects.length,
      },
    }))
  }, [traits])

  const handleTraitSelect = (option: AutocompleteOption) => {
    const selectedTrait = traits.find(trait => trait.edid === option.id)
    if (selectedTrait) {
      onSelect(selectedTrait)
    }
  }

  // Custom renderer for trait options
  const renderTraitOption = (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{option.label}</div>
        <div className="flex items-center gap-2 mt-1">
          {option.badge && <div className="flex-shrink-0">{option.badge}</div>}
          {option.metadata?.effectsCount &&
            option.metadata.effectsCount > 0 && (
              <div className="text-xs text-muted-foreground">
                {option.metadata.effectsCount} effect
                {option.metadata.effectsCount !== 1 ? 's' : ''}
              </div>
            )}
        </div>
        {option.description && (
          <FormattedText
            text={option.description}
            className="text-sm text-muted-foreground mt-1 line-clamp-2"
          />
        )}
      </div>
    </div>
  )

  return (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleTraitSelect}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      renderOption={renderTraitOption}
      emptyMessage="No traits found"
    />
  )
}
