import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import { useState } from 'react'
import type { SkillsPageSkill } from '../../adapters/useSkillsPage'
import { SkillAccordion } from './SkillAccordion'

interface SkillsListProps {
  skills: PlayerCreationItem[]
  originalSkills: SkillsPageSkill[]
  selectedSkill?: PlayerCreationItem
  onSkillSelect: (skillId: string) => void
  className?: string
}

export function SkillsList({
  skills,
  originalSkills,
  selectedSkill,
  onSkillSelect,
  className,
}: SkillsListProps) {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set())

  const handleToggleSkill = (skillId: string) => {
    setExpandedSkills(prev => {
      const newSet = new Set(prev)
      if (newSet.has(skillId)) {
        newSet.delete(skillId)
      } else {
        newSet.add(skillId)
      }
      return newSet
    })
  }

  const handleSkillClick = (skillId: string) => {
    onSkillSelect(skillId)
  }

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {skills.map(skill => {
        const isExpanded = expandedSkills.has(skill.id)
        const isSelected = selectedSkill?.id === skill.id
        const originalSkill = originalSkills.find(s => s.id === skill.id)

        return (
          <div
            key={skill.id}
            className={`transition-colors ${
              isSelected ? 'ring-2 ring-skyrim-gold bg-skyrim-gold/10' : ''
            }`}
          >
            <SkillAccordion
              item={skill}
              originalSkill={originalSkill}
              isExpanded={isExpanded}
              onToggle={() => handleToggleSkill(skill.id)}
              onSelect={() => handleSkillClick(skill.id)}
              showScaling={true}
              showAbilities={true}
              showTags={true}
            />
          </div>
        )
      })}
    </div>
  )
}
