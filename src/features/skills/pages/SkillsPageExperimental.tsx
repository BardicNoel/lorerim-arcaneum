import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { useMemo } from 'react'
import { useSkillsPage } from '../adapters/useSkillsPage'
import { PerkTreeCanvasExperimental } from '../components/view/PerkTreeCanvasExperimental'

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
    loading,
    error,
  } = useSkillsPage()

  // Get character build for perk ranks
  const { build } = useCharacterBuild()

  // Transform selected perks to the format expected by the canvas
  const selectedPerkNodes = useMemo(() => {
    if (!perkTree || !selectedPerks.length) return []

    return selectedPerks
      .map(perkId => {
        const perk = perkTree.perks.find(p => p.edid === perkId)
        if (!perk) return null

        // Get the current rank for this perk
        const currentRank = build.perks?.ranks?.[perkId] || 0

        return {
          ...perk,
          selectedRank: currentRank,
        }
      })
      .filter(Boolean) as any[]
  }, [perkTree, selectedPerks, build.perks?.ranks])

  if (loading) {
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

        {/* Skill Selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Select Skill:</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-between">
                {selectedSkill
                  ? selectedSkill.name
                  : 'Choose a skill to view its perk tree'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px] max-h-[400px] overflow-y-auto">
              {skills.map(skill => (
                <DropdownMenuItem
                  key={skill.id}
                  onClick={() => onSkillSelect(skill.id)}
                  className="cursor-pointer"
                >
                  {skill.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Perk Tree Canvas */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {selectedSkill ? `${selectedSkill.name} Perk Tree` : 'Perk Tree'}
            </h2>

            <div className="bg-background border rounded-lg h-[600px]">
              <PerkTreeCanvasExperimental
                tree={(perkTree as any) || undefined}
                onTogglePerk={onPerkSelect}
                onRankChange={onPerkRankChange}
                selectedPerks={selectedPerkNodes}
                className="h-full"
              />
            </div>
          </div>

          {/* Debug Information */}
          {selectedSkill && perkTree && (
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Debug Information</h3>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Selected Skill: {selectedSkill.name}</p>
                <p>Perk Tree: {perkTree.treeName}</p>
                <p>Total Perks: {perkTree.perks.length}</p>
                <p>Selected Perks: {selectedPerks.length}</p>
                <p>Available Perks: {availablePerks.length}</p>
                <p>
                  Perks with Position Data:{' '}
                  {perkTree.perks.filter(p => p.position).length}
                </p>
                {perkTree.perks.length > 0 && perkTree.perks[0].position && (
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
  )
}
