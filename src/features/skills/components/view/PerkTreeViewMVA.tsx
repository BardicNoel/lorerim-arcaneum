import React from 'react'
import { Card, CardContent } from '@/shared/ui/ui/card'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { LoadingView, ErrorView } from '../atomic'
import { PerkTreeGrid } from '../composition'
import { usePerkData } from '../../adapters'
import { cn } from '@/lib/utils'

// High-level view component for perk tree display
interface PerkTreeViewMVAProps {
  skillId: string | null
  skillName: string
  skillCategory: string
  onClose: () => void
  className?: string
}

export function PerkTreeViewMVA({
  skillId,
  skillName,
  skillCategory,
  onClose,
  className,
}: PerkTreeViewMVAProps) {
  // Use perk data adapter
  const {
    selectedPerkTree,
    selectedPerks,
    perkRanks,
    availablePerks,
    loading,
    error,
    handlePerkSelect,
    handlePerkRankChange,
    handleResetPerks,
  } = usePerkData(skillId)

  if (loading) {
    return <LoadingView />
  }

  if (error) {
    return <ErrorView error={error} />
  }

  if (!selectedPerkTree) {
    return (
      <div className={cn("flex items-center justify-center p-8 text-muted-foreground bg-background", className)}>
        <p>No perk tree found for this skill.</p>
      </div>
    )
  }

  return (
    <div className={cn("bg-background", className)}>
      {/* Perk Tree Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">{skillName}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {skillCategory}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {selectedPerks.length}/{selectedPerkTree.perks.length} Perks
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetPerks}
            className="text-xs"
          >
            Reset Perks
          </Button>
        </div>
      </div>
      
      <div className="bg-background">
        <PerkTreeGrid
          perkTree={selectedPerkTree}
          selectedPerks={selectedPerks}
          perkRanks={perkRanks}
          availablePerks={availablePerks}
          onPerkSelect={handlePerkSelect}
          onPerkRankChange={handlePerkRankChange}
        />
      </div>
    </div>
  )
} 