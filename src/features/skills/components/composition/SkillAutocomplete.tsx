import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
  MobileAutocompleteDrawer,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { Skill } from '../../types'
import { SkillAvatar } from '../atomic/SkillAvatar'

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 640px)')
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const handleSkillSelect = useCallback((skill: Skill) => {
    onSelect(skill)
    setSearchQuery(skill.name) // Update search query to show selected skill name
  }, [onSelect])

  const handleDesktopSkillSelect = useCallback((option: AutocompleteOption) => {
    const selectedSkill = skills.find(skill => skill.edid === option.id)
    if (selectedSkill) {
      onSelect(selectedSkill)
      setSearchQuery(selectedSkill.name)
    }
  }, [skills, onSelect])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Removed the problematic setTimeout focus call that was causing keyboard flashing
  }

  // Custom renderer for skill options
  const renderSkillOption = useMemo(() => (option: AutocompleteOption, isActive: boolean) => (
    <div className="flex items-start gap-3">
      <SkillAvatar
        skillName={option.label}
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
  ), [])

  // Create a store-like object for the drawer
  const skillStore = useMemo(() => ({
    data: skills,
    search: (query: string) => {
      const lowerQuery = query.toLowerCase()
      return skills.filter(skill =>
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.description?.toLowerCase().includes(lowerQuery)
      )
    }
  }), [skills])

  // Render function for complete skill list items in the drawer - using desktop layout
  const renderSkillListItem = useCallback((skill: Skill, isSelected: boolean, onSelect: () => void) => (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-5 text-left hover:bg-muted/60 rounded-lg"
      onClick={onSelect}
    >
      <div className="flex items-start gap-3 w-full">
        <SkillAvatar
          skillName={skill.name}
          size="sm"
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{skill.name}</div>
          <div className="flex items-center gap-2 mt-1">
            {skill.category && (
              <Badge
                variant="outline"
                className={cn(
                  'bg-skyrim-gold/10 text-skyrim-gold border-skyrim-gold/30 hover:bg-skyrim-gold/20',
                  'text-xs font-medium transition-colors'
                )}
              >
                {skill.category}
              </Badge>
            )}
            {skill.keyAbilities && skill.keyAbilities.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {skill.keyAbilities.length} ability{skill.keyAbilities.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          {skill.description && (
            <FormattedText
              text={skill.description}
              className="text-sm text-muted-foreground mt-1 line-clamp-2"
            />
          )}
          {skill.scaling && (
            <div className="text-xs text-muted-foreground mt-1">
              <strong>Scaling:</strong> {skill.scaling}
            </div>
          )}
        </div>
      </div>
    </Button>
  ), [])

  // Render mobile drawer
  if (isMobile) {
    return (
      <MobileAutocompleteDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onSelect={handleSkillSelect}
        searchPlaceholder="Search skills..."
        title="Select Skill"
        description="Choose a skill from the options below"
        triggerText={searchQuery}
        triggerPlaceholder={placeholder}
        store={skillStore}
        renderListItem={renderSkillListItem}
        emptyMessage="No skills found"
        className={className}
        disabled={disabled}
      />
    )
  }

  // Render desktop autocomplete
  return (
    <GenericAutocomplete
      options={autocompleteOptions}
      onSelect={handleDesktopSkillSelect}
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
