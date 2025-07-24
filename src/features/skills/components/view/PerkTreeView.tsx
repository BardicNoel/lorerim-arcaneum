import { PerkTreeCanvasII } from './PerkTreeCanvasII'
import type { PerkTree } from '../../types'
import { Z_INDEX } from '@/lib/constants'
import { AutocompleteSearch } from '@/shared/components/playerCreation/AutocompleteSearch'
import type {
  SearchCategory,
  SearchOption,
} from '@/shared/components/playerCreation/types'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Button } from '@/shared/ui/ui/button'
import {
  Drawer,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
} from '@/shared/ui/ui/drawer'
import { RotateCcw, X } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import * as DrawerPrimitive from 'vaul'
import type { SkillWithPerks } from '../../hooks/useUnifiedSkills'

export interface PerkTreeViewProps {
  selectedSkill: string | null
  skillName?: string
  perkTree?: PerkTree
  skills: SkillWithPerks[]
  onSkillSelect: (skillId: string) => void
  onReset: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PerkTreeView({
  selectedSkill,
  skillName,
  perkTree,
  skills,
  onSkillSelect,
  onReset,
  open,
  onOpenChange,
}: PerkTreeViewProps) {
  // Use global build state for perks
  const {
    addPerk,
    removePerk,
    setPerkRank,
    clearSkillPerks,
    getSkillPerks,
    getPerkRank,
  } = useCharacterBuild()

  // Get selected perks for the current skill from global state
  const selectedPerks = selectedSkill ? getSkillPerks(selectedSkill) : []

  // Convert selected perk IDs to PerkNode objects for the canvas
  const selectedPerkNodes = useMemo(() => {
    if (!perkTree) return []

    return perkTree.perks
      .filter(perk => selectedPerks.includes(perk.edid))
      .map(perk => ({
        ...perk,
        selected: true,
        currentRank: getPerkRank(perk.edid),
      }))
  }, [perkTree, selectedPerks, getPerkRank])

  const handleTogglePerk = useCallback(
    (perkId: string) => {
      if (!selectedSkill || !perkTree) return

      const isSelected = selectedPerks.includes(perkId)
      if (isSelected) {
        removePerk(selectedSkill, perkId)
      } else {
        addPerk(selectedSkill, perkId)
      }
    },
    [selectedSkill, perkTree, selectedPerks, removePerk, addPerk]
  )

  const handleRankChange = useCallback(
    (perkId: string, newRank: number) => {
      setPerkRank(perkId, newRank)
    },
    [setPerkRank]
  )

  const handleReset = () => {
    if (selectedSkill) {
      clearSkillPerks(selectedSkill)
    }
    onReset()
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Convert skills to search options for the autocomplete
  const skillSearchOptions: SearchOption[] = useMemo(() => {
    return skills.map(skill => ({
      id: skill.edid,
      label: skill.name,
      description: skill.description,
      category: skill.category as SearchCategory,
      metadata: {
        originalSkill: skill,
      },
    }))
  }, [skills])

  const handleSkillSelect = (option: SearchOption) => {
    onSkillSelect(option.id)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40" />
        <DrawerPrimitive.Content
          className="bg-background flex flex-col fixed bottom-0 left-0 right-0 h-[96%] rounded-t-[10px] border-t"
          style={{ zIndex: Z_INDEX.DRAWER }}
        >
          <div className="flex-1 overflow-hidden">
            {/* Header */}
            <DrawerHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <DrawerTitle className="text-lg font-semibold">
                    {skillName ? `${skillName} Perk Tree` : 'Perk Tree'}
                  </DrawerTitle>
                  <DrawerDescription>
                    Select perks to add to your character build
                  </DrawerDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Skill Selection */}
              <div className="mt-4">
                <AutocompleteSearch
                  options={skillSearchOptions}
                  onSelect={handleSkillSelect}
                  placeholder="Search skills..."
                  selectedOption={
                    skillSearchOptions.find(opt => opt.id === selectedSkill) ||
                    null
                  }
                />
              </div>
            </DrawerHeader>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {perkTree ? (
                <PerkTreeCanvasII
                  perkTree={perkTree}
                  selectedPerkNodes={selectedPerkNodes}
                  onTogglePerk={handleTogglePerk}
                  onRankChange={handleRankChange}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a skill to view its perk tree
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <DrawerFooter className="border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={!selectedSkill || selectedPerks.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Perks
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Done
              </Button>
            </div>
          </DrawerFooter>
        </DrawerPrimitive.Content>
      </DrawerPortal>
    </Drawer>
  )
} 