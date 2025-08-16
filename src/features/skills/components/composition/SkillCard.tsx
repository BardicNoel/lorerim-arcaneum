import type { Skill } from '@/features/skills/types'
import { cn } from '@/lib/utils'
import { EntityAvatar } from '@/shared/components/generic/EntityAvatar'
import {
  SelectionCard,
  type SelectionOption,
} from '@/shared/components/ui/SelectionCard'

export type SkillLevel = 'major' | 'minor' | 'none'

interface SkillCardProps {
  skill: Skill
  skillLevel: SkillLevel
  onSkillLevelChange: (skillId: string, level: SkillLevel) => void
  compact?: boolean
  showCategory?: boolean
  className?: string
  majorCount?: number
  minorCount?: number
  maxMajors?: number
  maxMinors?: number
}

export function SkillCard({
  skill,
  skillLevel,
  onSkillLevelChange,
  compact = false,
  showCategory = true,
  className,
  majorCount = 0,
  minorCount = 0,
  maxMajors = 3,
  maxMinors = 3,
}: SkillCardProps) {
  const isMajorLimitReached = majorCount >= maxMajors
  const isMinorLimitReached = minorCount >= maxMinors

  // Map skill level to primary/secondary/none
  const getSkillLevel = (): 'primary' | 'secondary' | 'none' => {
    if (skillLevel === 'major') return 'primary'
    if (skillLevel === 'minor') return 'secondary'
    return 'none'
  }

  const currentSkillLevel = getSkillLevel()

  const handleLevelChange = (value: string | undefined) => {
    if (!value) {
      // Clear the skill
      onSkillLevelChange(skill.edid, 'none')
    } else if (value === 'primary') {
      if (currentSkillLevel === 'primary') {
        // Toggle off major skill
        onSkillLevelChange(skill.edid, 'none')
      } else {
        // Add major skill (this will automatically remove any existing skill)
        onSkillLevelChange(skill.edid, 'major')
      }
    } else if (value === 'secondary') {
      if (currentSkillLevel === 'secondary') {
        // Toggle off minor skill
        onSkillLevelChange(skill.edid, 'none')
      } else {
        // Add minor skill (this will automatically remove any existing skill)
        onSkillLevelChange(skill.edid, 'minor')
      }
    }
  }

  // Define selection options
  const options: SelectionOption[] = [
    {
      value: 'primary',
      label: '+ Major',
      color: {
        selected: 'skyrim-gold',
        hover: 'skyrim-gold/10',
        border: 'skyrim-gold',
      },
      disabled: currentSkillLevel !== 'primary' && isMajorLimitReached,
      tooltip:
        currentSkillLevel !== 'primary' && isMajorLimitReached
          ? `Maximum ${maxMajors} major skills reached`
          : undefined,
    },
    {
      value: 'secondary',
      label: '+ Minor',
      color: {
        selected: 'skyrim-gold',
        hover: 'skyrim-gold/10',
        border: 'skyrim-gold',
      },
      disabled: currentSkillLevel !== 'secondary' && isMinorLimitReached,
      tooltip:
        currentSkillLevel !== 'secondary' && isMinorLimitReached
          ? `Maximum ${maxMinors} minor skills reached`
          : undefined,
    },
  ]

  const getCardTheming = (selectedValue: string | undefined) => {
    if (selectedValue === 'primary') {
      return {
        card: 'border-skyrim-gold bg-skyrim-gold/5',
        title: 'text-skyrim-dark',
        description: 'text-skyrim-dark/70',
      }
    }
    if (selectedValue === 'secondary') {
      return {
        card: 'border-gray-500 bg-gray-500/5',
        title: 'text-gray-700',
        description: 'text-gray-600',
      }
    }
    return {
      card: 'border-gray-200 hover:border-gray-300',
      title: 'text-gray-900',
      description: 'text-gray-600',
    }
  }

  const theming = getCardTheming(currentSkillLevel)

  return (
    <SelectionCard
      options={options}
      value={currentSkillLevel}
      onValueChange={handleLevelChange}
      className={cn('transition-all duration-200', theming.card, className)}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <EntityAvatar
                entityName={skill.name}
                entityType="skill"
                size="2xl"
                className="flex-shrink-0"
              />
              <h3
                className={cn(
                  'font-semibold text-sm leading-tight',
                  theming.title
                )}
              >
                {skill.name}
              </h3>
            </div>
            {!compact && (
              <p
                className={cn('text-xs mt-1 line-clamp-2', theming.description)}
              >
                {skill.description}
              </p>
            )}
          </div>
          {showCategory && skill.category && (
            <span className="text-xs text-gray-500 flex-shrink-0">
              {skill.category}
            </span>
          )}
        </div>

        {!compact && skill.keyAbilities && skill.keyAbilities.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Key abilities:</span>{' '}
            {skill.keyAbilities.slice(0, 2).join(', ')}
            {skill.keyAbilities.length > 2 && '...'}
          </div>
        )}
      </div>
    </SelectionCard>
  )
}
