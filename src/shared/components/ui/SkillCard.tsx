import type { Skill } from '@/features/skills/types'
import { cn } from '@/lib/utils'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/ui/tooltip'

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

  const handleLevelChange = (value: string | undefined) => {
    const newLevel = (value as SkillLevel) || 'none'
    onSkillLevelChange(skill.edid, newLevel)
  }

  const getCardStyling = () => {
    switch (skillLevel) {
      case 'major':
        return 'border-yellow-500 bg-yellow-50/50 shadow-yellow-200/50'
      case 'minor':
        return 'border-gray-400 bg-gray-50/50 shadow-gray-200/50'
      default:
        return 'border-border bg-background hover:border-muted-foreground/30'
    }
  }

  return (
    <TooltipProvider>
      <Drawer>
        <DrawerTrigger asChild>
          <div
            className={cn(
              'flex flex-col rounded-lg border p-3 shadow-sm transition-all duration-200 min-w-[240px] cursor-pointer hover:shadow-md',
              getCardStyling(),
              compact ? 'p-2' : 'p-3',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight mb-1">
                  {skill.name}
                </h3>
                {showCategory && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {skill.category}
                  </p>
                )}
              </div>
            </div>

            {/* Skill Controls */}
            <div className="mt-auto">
              <ToggleGroup
                type="single"
                value={skillLevel}
                onValueChange={handleLevelChange}
                className="flex gap-1"
              >
                {/* Major */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="major"
                      disabled={isMajorLimitReached && skillLevel !== 'major'}
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium border transition-colors flex-1',
                        'data-[state=on]:bg-yellow-500 data-[state=on]:text-white data-[state=on]:border-yellow-600',
                        'disabled:opacity-50 disabled:pointer-events-none',
                        'hover:bg-yellow-50 hover:border-yellow-300'
                      )}
                      onClick={e => e.stopPropagation()}
                    >
                      + Major
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  {isMajorLimitReached && skillLevel !== 'major' && (
                    <TooltipContent>
                      <p>Maximum {maxMajors} major skills reached</p>
                    </TooltipContent>
                  )}
                </Tooltip>

                {/* Minor */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="minor"
                      disabled={isMinorLimitReached && skillLevel !== 'minor'}
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium border transition-colors flex-1',
                        'data-[state=on]:bg-gray-400 data-[state=on]:text-white data-[state=on]:border-gray-500',
                        'disabled:opacity-50 disabled:pointer-events-none',
                        'hover:bg-gray-50 hover:border-gray-300'
                      )}
                      onClick={e => e.stopPropagation()}
                    >
                      + Minor
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  {isMinorLimitReached && skillLevel !== 'minor' && (
                    <TooltipContent>
                      <p>Maximum {maxMinors} minor skills reached</p>
                    </TooltipContent>
                  )}
                </Tooltip>

                {/* Clear */}
                <ToggleGroupItem
                  value="none"
                  className={cn(
                    'rounded-full px-2 py-1 text-xs font-medium border border-muted-foreground/30 transition-colors',
                    'data-[state=on]:bg-muted data-[state=on]:text-muted-foreground',
                    'hover:bg-muted/50'
                  )}
                  onClick={e => e.stopPropagation()}
                >
                  ⨉ Clear
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
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
    </TooltipProvider>
  )
}
