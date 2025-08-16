import {
  GenericAutocomplete,
  type AutocompleteOption,
} from '@/shared/components/generic'
import { EntityAvatar } from '@/shared/components/generic/EntityAvatar'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { Badge } from '@/shared/ui/ui/badge'
import { useMemo, useState } from 'react'
import type { Skill } from '../../types'

interface SkillAutocompleteProps {
  skills: Skill[]
  onSelect: (skill: Skill) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function SkillAutocomplete({
  skills,
  onSelect,
  placeholder = 'Search skills...',
  className = '',
  disabled = false,
}: SkillAutocompleteProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) {
      return skills
    }

    const query = searchQuery.toLowerCase()
    return skills.filter(skill => {
      return (
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.category.toLowerCase().includes(query) ||
        skill.keyAbilities.some(ability =>
          ability.toLowerCase().includes(query)
        ) ||
        skill.metaTags.some(tag => tag.toLowerCase().includes(query))
      )
    })
  }, [skills, searchQuery])

  // Convert filtered skills to AutocompleteOption format
  const autocompleteOptions: AutocompleteOption[] = useMemo(() => {
    return filteredSkills.map(skill => ({
      id: skill.edid,
      label: skill.name,
      description: skill.description,
      category: skill.category,
      badge: skill.category && (
        <Badge variant="outline" className="text-xs">
          {skill.category}
        </Badge>
      ),
      metadata: {
        originalSkill: skill,
        keyAbilitiesCount: skill.keyAbilities?.length || 0,
        scaling: skill.scaling,
      },
    }))
  }, [filteredSkills])

  const handleSkillSelect = (option: AutocompleteOption) => {
    const selectedSkill = skills.find(skill => skill.edid === option.id)
    if (selectedSkill) {
      onSelect(selectedSkill)
    }
  }

  // Custom renderer for skill options
  const renderSkillOption = (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-start gap-3">
      <EntityAvatar
        entityName={option.label}
        entityType="skill"
        size="sm"
        className="flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{option.label}</div>
        <div className="flex items-center gap-2 mt-1">
          {option.badge && <div className="flex-shrink-0">{option.badge}</div>}
          {option.metadata?.keyAbilitiesCount &&
            option.metadata.keyAbilitiesCount > 0 && (
              <div className="text-xs text-muted-foreground">
                {option.metadata.keyAbilitiesCount} ability
                {option.metadata.keyAbilitiesCount !== 1 ? 's' : ''}
              </div>
            )}
        </div>
        {option.description && (
          <FormattedText
            text={option.description}
            className="text-sm text-muted-foreground mt-1 line-clamp-2"
          />
        )}
        {option.metadata?.scaling && (
          <div className="text-xs text-muted-foreground mt-1">
            <strong>Scaling:</strong> {option.metadata.scaling}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleSkillSelect}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      renderOption={renderSkillOption}
      emptyMessage="No skills found"
      searchQuery={searchQuery}
      onSearchQueryChange={setSearchQuery}
    />
  )
}
