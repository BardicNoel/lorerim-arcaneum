import { SkillCard } from '@/features/skills/components/composition/SkillCard'
import { useSkillsStore } from '@/shared/stores/skillsStore'
import type { SearchableItem } from '../../model/SearchModel'

interface SkillSearchCardProps {
  item: SearchableItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function SkillSearchCard({
  item,
  isSelected = false,
  onClick,
  className,
}: SkillSearchCardProps) {
  const skills = useSkillsStore(state => state.data)

  // Find the full skill record from the store
  const fullSkill = skills?.find(skill => skill.id === item.originalData.id)

  if (!fullSkill) {
    // Fallback to default card if skill not found
    return (
      <div
        className={`p-4 border rounded-lg bg-muted cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''} ${className}`}
        onClick={onClick}
      >
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Skill not found in store
        </p>
      </div>
    )
  }

  // Render the existing SkillCard with the full skill data
  return (
    <div className={className} onClick={onClick}>
      <SkillCard
        skill={fullSkill}
        skillLevel="none"
        onSkillLevelChange={() => {}} // No-op for search results
        compact={true}
        showCategory={true}
        className={isSelected ? 'ring-2 ring-primary' : ''}
      />
    </div>
  )
}
