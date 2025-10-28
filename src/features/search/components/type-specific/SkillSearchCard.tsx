import { SkillAccordion } from '@/features/skills/components/composition/SkillAccordion'
import { transformSkillToPlayerCreationItem } from '@/features/skills/utils/dataTransform'
import { useSkillsStore } from '@/shared/stores/skillsStore'
import type { SearchableItem } from '../../model/SearchModel'
import { findItemInStore } from '../../utils/storeLookup'

interface SkillSearchCardProps {
  item: SearchableItem
  className?: string
  isExpanded?: boolean
  onToggle?: () => void
  viewMode?: 'list' | 'grid'
}

export function SkillSearchCard({
  item,
  className,
  isExpanded = false,
  onToggle,
  viewMode = 'grid',
}: SkillSearchCardProps) {
  const skills = useSkillsStore(state => state.data)

  // Find the full skill record from the store
  const fullSkill = findItemInStore(skills, item.originalData)

  if (!fullSkill) {
    // Log error for debugging but don't show a card
    console.error('Skill not found in store:', {
      searchItemName: item.name,
      searchItemId: item.id,
      searchItemOriginalData: item.originalData,
      totalSkillsInStore: skills.length,
      firstFewSkills: skills.slice(0, 3).map(skill => ({
        id: skill.id,
        name: skill.name,
      })),
    })
    return null
  }

  // Convert skill to PlayerCreationItem format and use the feature's SkillAccordion
  const skillAsPlayerCreationItem =
    transformSkillToPlayerCreationItem(fullSkill)

  return (
    <SkillAccordion
      item={skillAsPlayerCreationItem}
      originalSkill={fullSkill}
      className={className}
      isExpanded={isExpanded}
      onToggle={onToggle}
      showScaling={true}
      showAbilities={true}
      showTags={true}
      showBuildControls={false}
    />
  )
}
