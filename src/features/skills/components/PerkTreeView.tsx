import React, { useCallback, useMemo } from 'react'
import { Button } from '@/shared/ui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/ui/drawer'
import { AutocompleteSearch } from '@/shared/components/playerCreation/AutocompleteSearch'
import { RotateCcw, X } from 'lucide-react'
import { PerkTreeCanvasII } from '@/features/perks/components/PerkTreeCanvasII'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { Z_INDEX } from '@/lib/constants'
import { DrawerPortal, DrawerOverlay } from '@/shared/ui/ui/drawer'
import * as DrawerPrimitive from 'vaul'
import type { PerkTree } from '@/features/perks/types'
import type { SkillWithPerks } from '../hooks/useUnifiedSkills'
import type { SearchCategory, SearchOption } from '@/shared/components/playerCreation/types'

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
    getPerkRank 
  } = useCharacterBuild()

  // Get selected perks for the current skill from global state
  const selectedPerks = selectedSkill ? getSkillPerks(selectedSkill) : []

  // Convert selected perk IDs to PerkNode objects for the canvas
  const selectedPerkNodes = useMemo(() => {
    if (!perkTree) return []
    
    return perkTree.perks.filter(perk => 
      selectedPerks.includes(perk.edid)
    ).map(perk => ({
      ...perk,
      selected: true,
      currentRank: getPerkRank(perk.edid),
    }))
  }, [perkTree, selectedPerks, getPerkRank])

  const handleTogglePerk = useCallback((perkId: string) => {
    if (!selectedSkill || !perkTree) return

    const isSelected = selectedPerks.includes(perkId)
    if (isSelected) {
      removePerk(selectedSkill, perkId)
    } else {
      addPerk(selectedSkill, perkId)
    }
  }, [selectedSkill, perkTree, selectedPerks, removePerk, addPerk])

  const handleRankChange = useCallback((perkId: string, newRank: number) => {
    setPerkRank(perkId, newRank)
  }, [setPerkRank])

  const handleReset = () => {
    if (selectedSkill) {
      clearSkillPerks(selectedSkill)
    }
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
        id: skill.edid,
        label: skill.name,
        value: skill.edid,
        category: 'Skills',
        description: `${skill.selectedPerks}/${skill.totalPerks} perks selected`,
      })),
    },
  ]

  const handleSkillSelect = (option: SearchOption) => {
    onSkillSelect(option.value)
  }

  if (!selectedSkill || !perkTree) {
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
            zIndex: Z_INDEX.DRAWER
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
              <div>
                <DrawerTitle className="text-xl">{skillName || perkTree.treeName}</DrawerTitle>
                <DrawerDescription>
                  {selectedPerks.length} perks selected
                </DrawerDescription>
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
                selectedPerks={selectedPerkNodes}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading perk tree...</p>
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