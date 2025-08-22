import { cn } from '@/lib/utils'
import { SkillItem } from '../atomic/SkillItem'

// Component that composes multiple SkillItem components
interface Skill {
  id: string
  name: string
  description: string
  category: string
  assignmentType: 'major' | 'minor' | 'none'
  perkCount: string
  minLevel?: number
  startingLevel?: number
  canAssignMajor: boolean
  canAssignMinor: boolean
}

interface SkillGridProps {
  skills: Skill[]
  onSkillSelect: (skillId: string) => void
  onAssignMajor: (skillId: string) => void
  onAssignMinor: (skillId: string) => void
  onRemoveAssignment: (skillId: string) => void
  selectedSkillId?: string
  className?: string
}

export function SkillGrid({
  skills,
  onSkillSelect,
  onAssignMajor,
  onAssignMinor,
  onRemoveAssignment,
  selectedSkillId,
  className,
}: SkillGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )}
    >
      {skills.map(skill => (
        <SkillItem
          key={skill.id}
          name={skill.name}
          description={skill.description}
          category={skill.category}
          assignmentType={skill.assignmentType}
          perkCount={skill.perkCount}
          minLevel={skill.minLevel}
          startingLevel={skill.startingLevel}
          canAssignMajor={skill.canAssignMajor}
          canAssignMinor={skill.canAssignMinor}
          onSelect={() => onSkillSelect(skill.id)}
          onMajorClick={e => {
            e.preventDefault()
            onAssignMajor(skill.id)
          }}
          onMinorClick={e => {
            e.preventDefault()
            onAssignMinor(skill.id)
          }}
          className={
            selectedSkillId === skill.id
              ? 'ring-2 ring-primary bg-primary/5'
              : ''
          }
        />
      ))}
    </div>
  )
}
