import React, { memo } from 'react'
import { Handle, Position } from 'reactflow'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/ui/hover-card'
import type { PerkNode as PerkNodeType } from '../types'

interface PerkNodeProps {
  data: PerkNodeType & {
    hasChildren?: boolean
    isRoot?: boolean
    selected?: boolean
    currentRank?: number
  }
  selected?: boolean
  onTogglePerk?: (perkId: string) => void
  onRankChange?: (perkId: string, newRank: number) => void
}

const PerkNodeComponent: React.FC<PerkNodeProps> = ({
  data,
  selected,
  onTogglePerk,
  onRankChange,
}) => {
  
  // For multi-rank perks, consider them selected if rank > 0
  // For single-rank perks, use the boolean selected state
  const totalRanks = data.totalRanks
  const isSelected =
    totalRanks > 1 ? (data.currentRank || 0) > 0 : data.selected || selected

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const perkId = data.edid
    const perkName = data.name
    console.log(
      `Toggling perk: ${perkName} (${perkId}), currently selected: ${isSelected}, current rank: ${data.currentRank}`
    )

    if (onTogglePerk) {
      onTogglePerk(perkId)
    }
  }

  const handleRankCycle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If the perk isn't selected yet, select it with rank 1
    if (!isSelected) {
      const perkName = data.name
      const perkId = data.edid
      console.log(`Selecting multi-rank perk: ${perkName} with rank 1`)
      
      // Add the perk and set initial rank to 1
      if (onTogglePerk) {
        onTogglePerk(perkId)
      }
      if (onRankChange) {
        onRankChange(perkId, 1)
      }
      return
    }

    // If already selected, cycle through ranks
    if (!onRankChange) return

    const currentRank = data.currentRank || 0
    const nextRank = (currentRank + 1) % (totalRanks + 1) // 0 -> 1 -> 2 -> 3 -> 0

    const perkName = data.name
    console.log(`Cycling rank for ${perkName}: ${currentRank} -> ${nextRank}`)
    const perkId = data.edid
    onRankChange(perkId, nextRank)
  }

  const getNodeStyle = () => {
    const baseStyle = {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '2px solid',
      fontSize: '12px',
      fontWeight: '500',
      minWidth: '140px',
      textAlign: 'center' as const,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    }

    if (isSelected) {
      return {
        ...baseStyle,
        borderColor: '#d4af37', // Skyrim gold
        backgroundColor: 'rgba(212, 175, 55, 0.15)', // Muted transparent gold
        color: 'hsl(var(--foreground))',
        boxShadow:
          '0 0 0 2px rgba(212, 175, 55, 0.4), 0 2px 4px rgba(212, 175, 55, 0.2)',
        transform: 'scale(1.02)',
      }
    }

    // Don't make root nodes transparent - they should be fully visible
    if (data.isRoot) {
      return {
        ...baseStyle,
        borderColor: 'hsl(var(--border))',
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
      }
    }

    return {
      ...baseStyle,
      borderColor: 'hsl(var(--border))',
    }
  }

  // Get the description from the first rank
  const description = data.ranks[0]?.description?.base || ''

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          style={getNodeStyle()}
          onClick={totalRanks > 1 ? handleRankCycle : handleToggle}
          onMouseDown={e => e.stopPropagation()}
        >
          {/* Only show target handle if this node is not a root (has prerequisites) */}
          {!data.isRoot && <Handle type="target" position={Position.Bottom} />}

          <div className="font-medium">{data.name}</div>

          {/* Show rank info for multi-rank perks */}
          {totalRanks > 1 && (
            <div className="text-xs text-muted-foreground mt-1">
              {data.currentRank || 0}/{totalRanks} ranks
            </div>
          )}

          {/* Only show source handle if this node has children (is not terminal) */}
          {data.hasChildren && <Handle type="source" position={Position.Top} />}
        </div>
      </HoverCardTrigger>

      <HoverCardContent
        className="w-80 bg-background border border-border shadow-lg"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">{data.name}</h4>
          <div className="text-sm text-muted-foreground">{description}</div>
          {totalRanks > 1 && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <strong>Ranks:</strong> {data.currentRank || 0}/{totalRanks}
              <br />
              <em>Click to cycle through ranks</em>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
export const PerkNode = memo(PerkNodeComponent)