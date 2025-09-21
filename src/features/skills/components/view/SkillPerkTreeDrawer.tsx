import { PerkTreeCanvasII } from '@/features/skills/components/view/PerkTreeCanvasII'
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
import React from 'react'
import * as DrawerPrimitive from 'vaul'
import type { DetailSkill } from '../../adapters'
import { usePerkData } from '../../adapters'
import type { PerkTree } from '../../types'
import { SkillAvatar } from '../atomic/SkillAvatar'

export interface SkillPerkTreeDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSkill: string | null
  skillName?: string
  perkTree?: PerkTree
  skills: DetailSkill[]
  onSkillSelect: (skillId: string) => void
  onReset: () => void
}

export function SkillPerkTreeDrawer({
  open,
  onOpenChange,
  selectedSkill,
  skillName,
  perkTree,
  skills,
  onSkillSelect,
  onReset,
}: SkillPerkTreeDrawerProps) {
  // Use perk data adapter
  const {
    selectedPerks,
    perkRanks,
    handlePerkSelect,
    handlePerkRankChange,
    handleResetPerks,
  } = usePerkData(selectedSkill)

  // Get current skill level from character build
  const { getSkillLevel } = useCharacterBuild()
  const currentSkillLevel = selectedSkill
    ? getSkillLevel(selectedSkill)
    : undefined

  // Convert all perks to PerkNode objects for the canvas (both selected and deselected)
  const allPerkNodes = React.useMemo(() => {
    if (!perkTree) return []

    return perkTree.perks.map(perk => ({
      ...perk,
      selected: selectedPerks.includes(perk.edid),
      currentRank: perkRanks[perk.edid] || 0, // Use actual rank from store, default to 0
    }))
  }, [perkTree, selectedPerks, perkRanks])

  const handleTogglePerk = React.useCallback(
    (perkId: string) => {
      handlePerkSelect(perkId)
    },
    [handlePerkSelect]
  )

  const handleRankChange = React.useCallback(
    (perkId: string, newRank: number) => {
      handlePerkRankChange(perkId, newRank)
    },
    [handlePerkRankChange]
  )

  const handleReset = () => {
    handleResetPerks()
    onReset()
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Create search categories for skills
  const searchCategories: SearchCategory[] = [
    {
      id: 'skills',
      name: 'Skills',
      placeholder: 'Search skills...',
      options: skills.map(skill => ({
        id: skill.id,
        label: skill.name,
        value: skill.id,
        category: 'Skills',
        description: `${skill.selectedPerks}/${skill.totalPerks} perks selected`,
      })),
    },
  ]

  const handleSkillSelect = (option: SearchOption) => {
    onSkillSelect(option.value)
  }

  if (!selectedSkill) {
    return null
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
      dismissible={true}
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          className="fixed inset-x-0 bottom-0 z-50 mt-24 flex flex-col rounded-t-[10px] border bg-background h-[85vh] bg-card border-t shadow-lg !bg-card"
          data-vaul-no-drag
          style={{
            backgroundColor: 'hsl(var(--card))',
            zIndex: Z_INDEX.DRAWER,
          }}
        >
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-64">
                  <AutocompleteSearch
                    categories={searchCategories}
                    onSelect={handleSkillSelect}
                    placeholder="Search skills..."
                  />
                </div>
                <div className="flex items-center gap-3">
                  {skillName && (
                    <SkillAvatar
                      skillName={skillName}
                      size="lg"
                      className="flex-shrink-0"
                    />
                  )}
                  <div>
                    <DrawerTitle className="text-xl">
                      {skillName || perkTree?.treeName || 'Skill Perks'}
                    </DrawerTitle>
                    <DrawerDescription className="flex items-center gap-2">
                      <span>{selectedPerks.length} perks selected</span>
                      {skills.find(s => s.id === selectedSkill)?.minLevel >
                        0 && (
                        <span className="text-blue-600 font-medium">
                          • Min: Level{' '}
                          {skills.find(s => s.id === selectedSkill)?.minLevel}
                        </span>
                      )}
                    </DrawerDescription>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Perks
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-hidden" style={{ height: '400px' }}>
            <div className="h-full w-full bg-muted/20 rounded">
              {perkTree ? (
                <PerkTreeCanvasII
                  tree={perkTree}
                  onTogglePerk={handleTogglePerk}
                  onRankChange={handleRankChange}
                  selectedPerks={allPerkNodes}
                  currentSkillLevel={currentSkillLevel}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    {selectedSkill
                      ? 'Loading perk tree...'
                      : 'No skill selected'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DrawerFooter className="border-t">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Click on perk nodes to select/deselect them
              </p>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </DrawerFooter>
        </DrawerPrimitive.Content>
      </DrawerPortal>
    </Drawer>
  )
}
