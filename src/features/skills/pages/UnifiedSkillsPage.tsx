import { BuildPageShell } from '@/shared/components/playerCreation'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PerkTreeView, SkillsGrid } from '../components'
import { useUnifiedSkills } from '../hooks/useUnifiedSkills'

export function UnifiedSkillsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Get skills data and perk trees
  const { skills, loading, error, perkTrees } = useUnifiedSkills()

  // Get skills management from character build
  const { addMajorSkill, removeMajorSkill, addMinorSkill, removeMinorSkill } =
    useCharacterBuild()

  // Sync selected skill with URL
  useEffect(() => {
    const skillFromUrl = searchParams.get('skill')
    setSelectedSkill(skillFromUrl)
    // Open drawer if skill is selected from URL
    if (skillFromUrl) {
      setDrawerOpen(true)
    }
  }, [searchParams])

  // Update URL when selected skill changes
  useEffect(() => {
    if (selectedSkill) {
      searchParams.set('skill', selectedSkill)
    } else {
      searchParams.delete('skill')
    }
    setSearchParams(searchParams, { replace: true })
  }, [selectedSkill, searchParams, setSearchParams])

  // Handle skill selection
  const handleSkillSelect = (skillId: string) => {
    setSelectedSkill(skillId)
    setDrawerOpen(true)
  }

  // Handle skill assignment changes
  const handleAssignmentChange = (
    skillId: string,
    type: 'major' | 'minor' | 'none'
  ) => {
    if (type === 'major') {
      addMajorSkill(skillId)
    } else if (type === 'minor') {
      addMinorSkill(skillId)
    } else {
      // Remove from both major and minor
      removeMajorSkill(skillId)
      removeMinorSkill(skillId)
    }
  }

  // Handle back to skills grid
  const handleBackToSkills = () => {
    setSelectedSkill(null)
    setDrawerOpen(false)
  }

  // Handle drawer open change
  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      // Clear selected skill when drawer closes
      setSelectedSkill(null)
    }
  }

  // Handle reset perks
  const handleResetPerks = () => {
    // The PerkTreeView component handles the actual reset
    console.log('Reset perks for skill:', selectedSkill)
  }

  // Get the selected perk tree
  const selectedPerkTree = perkTrees.find(tree => tree.treeId === selectedSkill)
  const selectedSkillData = skills.find(skill => skill.edid === selectedSkill)

  if (loading) {
    return (
      <BuildPageShell
        title="Skills & Perks"
        description="Choose your character's skills and plan your perk progression through skill trees."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading skills and perks...</p>
          </div>
        </div>
      </BuildPageShell>
    )
  }

  if (error) {
    return (
      <BuildPageShell
        title="Skills & Perks"
        description="Choose your character's skills and plan your perk progression through skill trees."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </BuildPageShell>
    )
  }

  return (
    <BuildPageShell
      title="Skills & Perks"
      description="Choose your character's skills and plan your perk progression through skill trees."
    >
      <div className="space-y-8">
        {/* Skills Grid Section */}
        <div className="space-y-4">
          <SkillsGrid
            skills={skills}
            onSkillSelect={handleSkillSelect}
            onAssignmentChange={handleAssignmentChange}
          />
        </div>

        {/* Perk Tree View Section */}
        <PerkTreeView
          selectedSkill={selectedSkill}
          skillName={selectedSkillData?.name}
          perkTree={selectedPerkTree}
          skills={skills}
          onSkillSelect={handleSkillSelect}
          onReset={handleResetPerks}
          open={drawerOpen}
          onOpenChange={handleDrawerOpenChange}
        />
      </div>
    </BuildPageShell>
  )
}
