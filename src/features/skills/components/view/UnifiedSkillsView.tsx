import { BuildPageShell } from '@/shared/components/playerCreation'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PerkTreeView } from './PerkTreeView'
import { SkillGrid } from '../composition/SkillGrid'
import { useSkillsDetail } from '../../adapters'

function UnifiedSkillsView() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Get skills data and perk trees
  const { 
    skills, 
    loading, 
    error, 
    selectedSkillId,
    selectedSkill,
    drawerOpen,
    handleSkillSelect,
    handleAssignMajor,
    handleAssignMinor,
    handleRemoveAssignment,
    handleDrawerOpenChange,
    handleResetPerks,
    selectedPerkTree
  } = useSkillsDetail()

  // Sync selected skill with URL
  useEffect(() => {
    const skillFromUrl = searchParams.get('skill')
    if (skillFromUrl && skillFromUrl !== selectedSkillId) {
      handleSkillSelect(skillFromUrl)
    }
  }, [searchParams, selectedSkillId, handleSkillSelect])

  // Update URL when selected skill changes
  useEffect(() => {
    if (selectedSkillId) {
      searchParams.set('skill', selectedSkillId)
    } else {
      searchParams.delete('skill')
    }
    setSearchParams(searchParams, { replace: true })
  }, [selectedSkillId, searchParams, setSearchParams])

  // Map skills to SkillGrid format
  const gridSkills = skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    assignmentType: skill.isMajor ? 'major' as const : skill.isMinor ? 'minor' as const : 'none' as const,
    perkCount: `${skill.selectedPerksCount}/${skill.totalPerks}`,
    canAssignMajor: skill.canAssignMajor,
    canAssignMinor: skill.canAssignMinor,
  }))

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
          <SkillGrid
            skills={gridSkills}
            onSkillSelect={handleSkillSelect}
            onAssignMajor={handleAssignMajor}
            onAssignMinor={handleAssignMinor}
            onRemoveAssignment={handleRemoveAssignment}
          />
        </div>

        {/* Perk Tree View Section */}
        <PerkTreeView
          selectedSkill={selectedSkillId}
          skillName={selectedSkill?.name}
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

export { UnifiedSkillsView }; 