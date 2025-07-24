import { UnifiedSkillCard } from './UnifiedSkillCard'
import type { SkillWithPerks } from '../../hooks/useUnifiedSkills'

export interface SkillsGridProps {
  skills: SkillWithPerks[]
  onSkillSelect: (skillId: string) => void
  onAssignmentChange: (
    skillId: string,
    type: 'major' | 'minor' | 'none'
  ) => void
}

export function SkillsGrid({
  skills,
  onSkillSelect,
  onAssignmentChange,
}: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map(skill => (
        <UnifiedSkillCard
          key={skill.edid}
          skill={skill}
          onSkillSelect={() => onSkillSelect(skill.edid)}
          onAssignmentChange={type => onAssignmentChange(skill.edid, type)}
        />
      ))}
    </div>
  )
} 