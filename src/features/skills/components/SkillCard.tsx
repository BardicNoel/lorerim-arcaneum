import type { Skill } from '@/features/skills/types'
import { cn } from '@/lib/utils'
import {
  SelectionCard,
  type SelectionOption,
} from '@/shared/components/ui/SelectionCard'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/ui/drawer'
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/ui/toggle-group'

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

  // Define card theming based on selection state
  const getCardTheming = (selectedValue: string | undefined) => {
    if (selectedValue === 'primary') {
      return 'border-yellow-500 bg-yellow-50/50 shadow-yellow-500/20'
    }
    if (selectedValue === 'secondary') {
      return 'border-gray-400 bg-gray-50/50 shadow-gray-400/20'
    }
    return ''
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <SelectionCard
          title={skill.name}
          options={options}
          selectedValue={currentSkillLevel}
          onValueChange={handleLevelChange}
          minWidth="min-w-[240px]"
          className={cn(compact && 'p-2', className)}
          showCategory={showCategory}
          category={skill.category}
          cardClassName={getCardTheming}
          showCardTheming={true}
          mutuallyExclusive={true}
        />
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle className="text-xl">{skill.name}</DrawerTitle>
            <DrawerDescription className="text-base">
              {skill.category} •{' '}
              {skill.abbreviation && `${skill.abbreviation} • `}Skill
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0 space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Description
              </h3>
              <p className="text-sm leading-relaxed">{skill.description}</p>
            </div>

            {/* Scaling */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Scaling
              </h3>
              <p className="text-sm leading-relaxed">{skill.scaling}</p>
            </div>

            {/* Key Abilities */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Key Abilities
              </h3>
              <ul className="space-y-1">
                {skill.keyAbilities.map((ability, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-skyrim-gold mt-1">•</span>
                    <span>{ability}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Meta Tags */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.metaTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DrawerFooter>
            <div className="w-full">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                Assign Skill
              </h3>
              <ToggleGroup
                type="single"
                value={skillLevel}
                onValueChange={handleLevelChange}
                className="flex gap-2"
              >
                <ToggleGroupItem
                  value="major"
                  disabled={isMajorLimitReached && skillLevel !== 'major'}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium border transition-colors',
                    'data-[state=on]:bg-yellow-500 data-[state=on]:text-white data-[state=on]:border-yellow-600',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    'hover:bg-yellow-50 hover:border-yellow-300'
                  )}
                >
                  + Major Skill
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="minor"
                  disabled={isMinorLimitReached && skillLevel !== 'minor'}
                  className={cn(
                    'flex-1 px-4 py-2 text-sm font-medium border transition-colors',
                    'data-[state=on]:bg-gray-400 data-[state=on]:text-white data-[state=on]:border-gray-500',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    'hover:bg-gray-50 hover:border-gray-300'
                  )}
                >
                  + Minor Skill
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="none"
                  className={cn(
                    'px-4 py-2 text-sm font-medium border border-muted-foreground/30 transition-colors',
                    'data-[state=on]:bg-muted data-[state=on]:text-muted-foreground',
                    'hover:bg-muted/50'
                  )}
                >
                  Clear
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
