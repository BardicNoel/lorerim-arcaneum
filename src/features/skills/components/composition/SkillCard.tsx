import type { Skill } from '@/features/skills/types'
import { cn } from '@/lib/utils'
import {
  SelectionCard,
  type SelectionOption,
} from '@/shared/components/ui/SelectionCard'

export type SkillLevel = 'major' | 'minor' | 'none'

interface SkillCardProps {
  skill: Skill
  skillLevel: SkillLevel
  onSkillLevelChange: (skillId: string, level: SkillLevel) => void
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

  return (
    <SelectionCard
      title={skill.name}
      description={skill.description}
      options={options}
      selectedValue={currentSkillLevel}
      onValueChange={handleLevelChange}
      className={cn('transition-all duration-200', className)}
      showCategory={showCategory}
      category={skill.category}
    />
  )
}
