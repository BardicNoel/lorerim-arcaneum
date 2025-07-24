import type {
  PerkNode as PerkNodeType,
  PerkTree,
} from '@/features/skills/types'
import { cn } from '@/lib/utils'
import React from 'react'
import { PerkTreeCanvas } from '../view/PerkTreeCanvas'

// Component that uses the existing PerkTreeCanvas for proper perk tree visualization
interface PerkTreeGridProps {
  perkTree: PerkTree | null
  selectedPerks: string[]
  perkRanks: Record<string, number>
  availablePerks: string[]
  onPerkSelect: (perkId: string) => void
  onPerkRankChange: (perkId: string, newRank: number) => void
  className?: string
}

export function PerkTreeGrid({
  perkTree,
  selectedPerks,
  perkRanks,
  availablePerks,
  onPerkSelect,
  onPerkRankChange,
  className,
}: PerkTreeGridProps) {
  // Transform selected perk IDs to PerkNode objects for the canvas
  const selectedPerkNodes: PerkNodeType[] = React.useMemo(() => {
    if (!perkTree) return []

    return selectedPerks
      .map(perkId => {
        const perk = perkTree.perks.find(p => p.edid === perkId)
        if (!perk) return null

        // Return the original perk node - the canvas will handle currentRank separately
        return perk
      })
      .filter((perk): perk is PerkNodeType => perk !== null)
  }, [perkTree, selectedPerks])

  // Handle perk toggle (select/deselect)
  const handleTogglePerk = (perkId: string) => {
    onPerkSelect(perkId)
  }

  // Handle rank changes
  const handleRankChange = (perkId: string, newRank: number) => {
    onPerkRankChange(perkId, newRank)
  }

  if (!perkTree) {
    return (
      <div
        className={cn(
          'flex items-center justify-center p-8 text-muted-foreground',
          className
        )}
      >
        <p>No perk tree available for this skill.</p>
      </div>
    )
  }

  return (
    <div className={cn('w-full h-full min-h-[400px] bg-background', className)}>
      <PerkTreeCanvas
        tree={perkTree}
        onTogglePerk={handleTogglePerk}
        onRankChange={handleRankChange}
        selectedPerks={selectedPerkNodes}
      />
    </div>
  )
}
