import { useState } from 'react'
import type { SkillsPageSkill, SkillSummary } from '../../adapters'
import { ErrorView, LoadingView } from '../atomic'
import { SkillGrid } from '../composition'
import { SkillPerkTreeDrawer } from './SkillPerkTreeDrawer'

// High-level view component that consumes adapters
interface SkillsPageViewProps {
  skills: SkillsPageSkill[]
  loading: boolean
  error: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string | null
  onCategorySelect: (category: string | null) => void
  categories: string[]
  selectedSkillId: string | null
  onSkillSelect: (skillId: string) => void
  onAssignMajor: (skillId: string) => void
  onAssignMinor: (skillId: string) => void
  onRemoveAssignment: (skillId: string) => void
  onResetPerks: () => void
  perkTree?: any
  skillSummary: SkillSummary
}

export function SkillsPageView({
  skills,
  loading,
  error,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  categories,
  selectedSkillId,
  onSkillSelect,
  onAssignMajor,
  onAssignMinor,
  onRemoveAssignment,
  onResetPerks,
  perkTree,
  skillSummary,
}: SkillsPageViewProps) {
  // Local state for perk tree drawer
  const [perkTreeOpen, setPerkTreeOpen] = useState(false)

  if (loading) {
    return <LoadingView />
  }

  if (error) {
    return <ErrorView error={error} />
  }

  // Transform skills to the format expected by SkillPerkTreeDrawer
  const drawerSkills = skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    category: skill.category,
    description: skill.description,
    keyAbilities: skill.keyAbilities || [],
    metaTags: skill.metaTags || [],
    assignmentType: skill.assignmentType,
    canAssignMajor: skill.canAssignMajor,
    canAssignMinor: skill.canAssignMinor,
    minLevel: skill.minLevel,
    startingLevel: skill.startingLevel,
    totalPerks: skill.totalPerks,
    selectedPerksCount: skill.selectedPerksCount,
    selectedPerks: skill.selectedPerks || [],
    isSelected: skill.isSelected || false,
    isMajor: skill.assignmentType === 'major',
    isMinor: skill.assignmentType === 'minor',
  }))

  return (
    <div className="space-y-6">
      {/* Skills Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Available Skills</h2>
          <p className="text-sm text-muted-foreground">
            {skills.length} skills found
          </p>
        </div>

        <SkillGrid
          skills={skills}
          onSkillSelect={skillId => {
            onSkillSelect(skillId)
            setPerkTreeOpen(true)
          }}
          onAssignMajor={onAssignMajor}
          onAssignMinor={onAssignMinor}
          onRemoveAssignment={onRemoveAssignment}
          selectedSkillId={selectedSkillId || undefined}
        />
      </div>

      {/* Perk Tree Drawer */}
      <SkillPerkTreeDrawer
        open={perkTreeOpen}
        onOpenChange={setPerkTreeOpen}
        selectedSkill={selectedSkillId}
        skillName={
          selectedSkillId
            ? skills.find(s => s.id === selectedSkillId)?.name
            : undefined
        }
        perkTree={perkTree || undefined}
        skills={drawerSkills}
        onSkillSelect={onSkillSelect}
        onReset={onResetPerks}
      />

      {/* Assignment Instructions */}
      <div className="p-6 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">How to Assign Skills</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Major Skills (0-3)</p>
            <p>Your primary skills that start at a higher level boost.</p>
          </div>
          <div>
            <p className="text-muted-foreground">Minor Skills (0-6)</p>
            <p>Secondary skills that start with a smaller level boost</p>
          </div>
        </div>
      </div>
    </div>
  )
}
