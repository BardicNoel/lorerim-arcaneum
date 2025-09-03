import { cn } from '@/lib/utils'
import {
  GenericAutocomplete,
  type AutocompleteOption,
} from '@/shared/components/generic'
import { FormattedText } from '@/shared/components/generic/FormattedText'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
import { Badge } from '@/shared/ui/ui/badge'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/ui/sheet'
import { ChevronDown, Search, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
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

  const handleSkillSelect = (option: AutocompleteOption) => {
    const selectedSkill = skills.find(skill => skill.edid === option.id)
    if (selectedSkill) {
      onSelect(selectedSkill)
      setIsDrawerOpen(false)
      setSearchQuery('')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Maintain focus on the input
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 0)
  }

  // Custom renderer for skill options
  const renderSkillOption = (option: AutocompleteOption, isActive: boolean) => (
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
  )

  // Mobile drawer content
  const MobileSkillDrawer = () => (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-between text-left font-normal',
            !searchQuery && 'text-muted-foreground',
            className
          )}
          disabled={disabled}
        >
          <span>{searchQuery || placeholder}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="h-[85vh] max-h-[85vh] p-0 flex flex-col"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <SheetHeader className="p-4 border-b flex-shrink-0">
          <SheetTitle>Select Skill</SheetTitle>
          <SheetDescription>
            Choose a skill from the options below
          </SheetDescription>
        </SheetHeader>

        {/* Search Input */}
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search skills..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Skill List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {autocompleteOptions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-muted-foreground">No skills found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {autocompleteOptions.map(option => (
                <Button
                  key={option.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-5 text-left hover:bg-muted/60 rounded-lg"
                  onClick={() => handleSkillSelect(option)}
                >
                  <div className="w-full">
                    {renderSkillOption(option, false)}
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )

  // Desktop autocomplete
  const DesktopSkillAutocomplete = () => (
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

  return isMobile ? <MobileSkillDrawer /> : <DesktopSkillAutocomplete />
}
