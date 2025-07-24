import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import React from 'react'
import {
  SkillAssignmentBadge,
  SkillCategoryBadge,
  SkillPerkCountBadge,
} from './index'

// Pure presentational component for individual skill display
interface SkillItemProps {
  name: string
  description: string
  category: string
  assignmentType: 'major' | 'minor' | 'none'
  perkCount: string
  onSelect: () => void
  onAssignMajor: () => void
  onAssignMinor: () => void
  onRemoveAssignment: () => void
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
  onSelect,
  onAssignMajor,
  onAssignMinor,
  onRemoveAssignment,
  canAssignMajor,
  canAssignMinor,
  className,
}: SkillItemProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card selection if clicking on assignment buttons
    if ((e.target as HTMLElement).closest('[data-assignment-control]')) {
      return
    }
    // console.log('SkillItem clicked:', name) // Debug logging
    onSelect()
  }

  const handleMajorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(
      'Major button clicked for skill:',
      name,
      'Current assignment:',
      assignmentType
    )
    if (assignmentType === 'major') {
      console.log('Removing major assignment')
      onRemoveAssignment()
    } else {
      console.log('Assigning as major')
      onAssignMajor()
    }
  }

  const handleMinorClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(
      'Minor button clicked for skill:',
      name,
      'Current assignment:',
      assignmentType
    )
    if (assignmentType === 'minor') {
      console.log('Removing minor assignment')
      onRemoveAssignment()
    } else {
      console.log('Assigning as minor')
      onAssignMinor()
    }
  }

  return (
    <div
      className={cn(
        'p-4 border rounded-lg hover:bg-muted/50 transition-colors',
        className
      )}
      onClick={handleCardClick}
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
