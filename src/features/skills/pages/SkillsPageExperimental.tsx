import { useMemo } from 'react'
import { useSkillsPage } from '../adapters/useSkillsPage'
import { SkillsList } from '../components/composition/SkillsList'
import { PerkTreeCanvasExperimental } from '../components/view/PerkTreeCanvasExperimental'
import { skillsToPlayerCreationItems } from '../utils/skillToPlayerCreationItem'

export function SkillsPageExperimental() {
  const {
    skills,
    selectedSkill,
    perkTree,
    selectedPerks,
    perkRanks,
    availablePerks,
    onSkillSelect,
    onPerkSelect,
    onPerkRankChange,
    isLoading,
    error,
  } = useSkillsPage()

  // Transform skills to PlayerCreationItem format for SkillAccordion
  const playerCreationSkills = useMemo(() => {
    return skillsToPlayerCreationItems(skills)
  }, [skills])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading skills...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-destructive">Error loading skills: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Skills - Experimental AVIF Grid
          </h1>
          <p className="text-muted-foreground">
            Experimental perk tree visualization using AVIF coordinate system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skills List */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-3">Skills</h2>
                <SkillsList
                  skills={playerCreationSkills}
                  originalSkills={skills}
                  selectedSkill={
                    selectedSkill
                      ? skillsToPlayerCreationItems([selectedSkill])[0]
                      : undefined
                  }
                  onSkillSelect={onSkillSelect}
                />
              </div>
            </div>
          </div>

          {/* Perk Tree Canvas */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  {selectedSkill
                    ? `${selectedSkill.name} Perk Tree`
                    : 'Perk Tree'}
                </h2>

                <div className="bg-background border rounded-lg h-[600px]">
                  <PerkTreeCanvasExperimental
                    tree={perkTree}
                    selectedPerks={selectedPerks}
                    perkRanks={perkRanks}
                    availablePerks={availablePerks}
                    onPerkSelect={onPerkSelect}
                    onPerkRankChange={onPerkRankChange}
                    className="h-full"
                  />
                </div>
              </div>

              {/* Debug Information */}
              {selectedSkill && perkTree && (
                <div className="bg-muted/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">
                    Debug Information
                  </h3>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>Selected Skill: {selectedSkill.name}</p>
                    <p>Perk Tree: {perkTree.treeName}</p>
                    <p>Total Perks: {perkTree.perks.length}</p>
                    <p>Selected Perks: {selectedPerks.length}</p>
                    <p>Available Perks: {availablePerks.length}</p>
                    {perkTree.perks.length > 0 &&
                      perkTree.perks[0].position && (
                        <p>
                          Sample Position: X={perkTree.perks[0].position.x}, Y=
                          {perkTree.perks[0].position.y}, H=
                          {perkTree.perks[0].position.horizontal}, V=
                          {perkTree.perks[0].position.vertical}
                        </p>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
