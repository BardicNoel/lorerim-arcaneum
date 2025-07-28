import { Badge } from '@/shared/ui/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Separator } from '@/shared/ui/ui/separator'
import { useState } from 'react'
import type { SkillsPageSkill, SkillSummary } from '../../adapters'
import { ErrorView, LoadingView } from '../atomic'
import { SkillFilters, SkillGrid, SkillSearch } from '../composition'
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
    edid: skill.id,
    name: skill.name,
    category: skill.category,
    description: skill.description,
    scaling: '', // Default value since SkillsPageSkill doesn't have this
    keyAbilities: [], // Default value since SkillsPageSkill doesn't have this
    metaTags: [], // Default value since SkillsPageSkill doesn't have this
    totalPerks: skill.totalPerks,
    selectedPerks: skill.selectedPerksCount,
    level: skill.level, // Add minimum skill level
    isMajor: skill.assignmentType === 'major',
    isMinor: skill.assignmentType === 'minor',
  }))

  return (
    <div className="space-y-6">

      {/* Build Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Build Summary</span>
            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-800 border-yellow-300"
              >
                {skillSummary.majorCount}/{skillSummary.majorLimit} Major
              </Badge>
              <Badge
                variant="outline"
                className="bg-gray-50 text-gray-800 border-gray-300"
              >
                {skillSummary.minorCount}/{skillSummary.minorLimit} Minor
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Skills</p>
              <p className="font-semibold">{skillSummary.totalSkills}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Selected Perks</p>
              <p className="font-semibold">{skillSummary.totalPerks}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Perk Ranks</p>
              <p className="font-semibold">{skillSummary.totalPerkRanks}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Available Major</p>
              <p className="font-semibold text-yellow-600">
                {skillSummary.majorLimit - skillSummary.majorCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SkillSearch query={searchQuery} onQueryChange={onSearchChange} />

        <SkillFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
        />
      </div>

      <Separator />

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
            console.log('Skill selected:', skillId) // Debug log
            console.log('Setting perkTreeOpen to true') // Debug log
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
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">How to Assign Skills</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Major Skills (0-3)</p>
              <p>
                Your primary skills that level up faster and start at a higher
                level.
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Minor Skills (0-6)</p>
              <p>
                Secondary skills that provide additional benefits and
                customization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
