import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import {
  SkillAssignmentBadge,
  SkillCategoryBadge,
  SkillPerkCountBadge,
} from './index'
import { SkillLevelBadge } from './SkillLevelBadge'

// Pure presentational component for individual skill display
interface SkillItemProps {
  name: string
  description: string
  category: string
  assignmentType: 'major' | 'minor' | 'none'
  perkCount: string
  level?: number
  onSelect: () => void
  onMajorClick: (e: React.MouseEvent) => void
  onMinorClick: (e: React.MouseEvent) => void
  canAssignMajor: boolean
  canAssignMinor: boolean
  className?: string
}

export function SkillItem({
  name,
  description,
  category,
  assignmentType,
  perkCount,
  level,
  onSelect,
  onMajorClick,
  onMinorClick,
  canAssignMajor,
  canAssignMinor,
  className,
}: SkillItemProps) {
  // Prevent bubbling to card click when clicking assignment buttons
  const handleMajorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMajorClick(e)
  }
  const handleMinorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMinorClick(e)
  }

  return (
    <div
      className={cn(
        'p-4 border rounded-lg hover:bg-muted/50 transition-colors',
        className
      )}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg cursor-pointer">{name}</h3>
        <SkillAssignmentBadge type={assignmentType} />
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {description}
      </p>
      <div className="flex gap-2 flex-wrap mb-4">
        <SkillCategoryBadge category={category} />
        <SkillPerkCountBadge count={perkCount} />
        {typeof level === 'number' && level > 0 && <SkillLevelBadge level={level} />}
      </div>

      {/* Assignment Controls */}
      <div className="flex gap-2" data-assignment-control>
        <Button
          size="sm"
          variant={assignmentType === 'major' ? 'default' : 'outline'}
          onClick={handleMajorClick}
          disabled={!canAssignMajor && assignmentType !== 'major'}
          className={cn(
            'flex-1 text-xs',
            assignmentType === 'major' &&
              'bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-500'
          )}
        >
          {assignmentType === 'major' ? 'Remove Major' : 'Major'}
        </Button>
        <Button
          size="sm"
          variant={assignmentType === 'minor' ? 'default' : 'outline'}
          onClick={handleMinorClick}
          disabled={!canAssignMinor && assignmentType !== 'minor'}
          className={cn(
            'flex-1 text-xs',
            assignmentType === 'minor' &&
              'bg-gray-500 hover:bg-gray-600 text-white border-gray-400'
          )}
        >
          {assignmentType === 'minor' ? 'Remove Minor' : 'Minor'}
        </Button>
      </div>
    </div>
  )
}
