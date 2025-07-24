import React from 'react'
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
import { usePerkPlan } from '@/features/perks/hooks/usePerks'
import { Z_INDEX } from '@/lib/constants'
import type { PerkTree } from '@/features/perks/types'
import type { SkillWithPerks } from '../hooks/useUnifiedSkills'
import type {
  SearchCategory,
  SearchOption,
} from '@/shared/components/playerCreation/types'

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
  // Use perk plan for the selected tree
  const { perkPlan, togglePerk, updatePerkRank, clearSkill } =
    usePerkPlan(perkTree)

  // Get selected perks for the current tree
  const selectedPerks = perkTree
    ? perkPlan.selectedPerks[perkTree.treeName] || []
    : []

  const handleReset = () => {
    if (perkTree) {
      clearSkill()
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
        description: `${skill.perksCount} perks available`,
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="h-[85vh] bg-card border-t shadow-lg !bg-card"
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
              <div>
                <DrawerTitle className="text-xl">
                  {skillName || perkTree.treeName}
                </DrawerTitle>
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

        <div className="flex-1 overflow-hidden">
          <div className="h-full w-full">
            <PerkTreeCanvasII
              tree={perkTree}
              onTogglePerk={togglePerk}
              onRankChange={updatePerkRank}
              selectedPerks={selectedPerks}
            />
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
      </DrawerContent>
    </Drawer>
  )
}
