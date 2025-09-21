import { Z_INDEX } from '@/lib/constants'
import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from '@/shared/ui/ui/hover-card'
import React, { memo, useRef, useState } from 'react'
import { Handle, Position } from 'reactflow'
import type { PerkNode as PerkNodeType } from '../../types'

// Utility function to get minimum required skill level for a specific rank
const getMinLevelForRank = (
  perk: PerkNodeType,
  rank: number
): number | null => {
  const rankData = perk.ranks.find(r => r.rank === rank)
  if (!rankData?.prerequisites?.skillLevel) {
    return null
  }
  return rankData.prerequisites.skillLevel.level
}

interface PerkNodeProps {
  data: PerkNodeType & {
    hasChildren?: boolean
    isRoot?: boolean
    selected?: boolean
    currentRank?: number
    hasNoPosition?: boolean
    currentSkillLevel?: number // Current total skill level
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
  // State to control hovercard visibility
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(false)
  const isClickingRef = useRef(false)

  // For multi-rank perks, consider them selected if rank > 0
  // For single-rank perks, use the boolean selected state
  const totalRanks = data.totalRanks
  const isSelected =
    totalRanks > 1 ? (data.currentRank || 0) > 0 : data.selected || selected

  const handleNodeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Mark that we're clicking to prevent hovercard from closing
    isClickingRef.current = true

    // Keep the hovercard open during clicks
    setIsHoverCardOpen(true)

    const totalRanks = data.totalRanks || 1

    if (totalRanks > 1) {
      // Multi-rank perk: cycle through ranks
      const currentRank = data.currentRank || 0
      const maxRank = data.totalRanks || 1
      // Cycle: 0 (unselected) -> 1 -> ... -> maxRank -> 0
      const nextRank = currentRank >= maxRank ? 0 : currentRank + 1

      console.log('🔄 PerkNode cycling:', {
        perkId: data.edid,
        currentRank,
        maxRank,
        nextRank,
        totalRanks,
      })

      // Update the rank (this will also handle perk selection in the adapter)
      if (onRankChange) {
        onRankChange(data.edid, nextRank)
      }
    } else {
      // Single-rank perk: toggle selection
      if (onTogglePerk) {
        onTogglePerk(data.edid)
      }
    }

    // Reset clicking flag after a short delay
    setTimeout(() => {
      isClickingRef.current = false
    }, 200)
  }

  const handleMouseEnter = () => {
    setIsHoverCardOpen(true)
  }

  const handleMouseLeave = () => {
    // Only close if we're not in the middle of a click interaction
    if (!isClickingRef.current) {
      setIsHoverCardOpen(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    // Prevent closing if we're in the middle of a click
    if (!open && isClickingRef.current) {
      return
    }
    setIsHoverCardOpen(open)
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

    // Special styling for perks without position data (default positioned)
    if (data.hasNoPosition) {
      return {
        ...baseStyle,
        borderColor: '#ef4444', // Red border for default positioned perks
        borderStyle: 'dashed',
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Light red background
        color: 'hsl(var(--foreground))',
        boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.3)',
      }
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
      backgroundColor: 'hsl(var(--background))',
      color: 'hsl(var(--muted-foreground))',
    }
  }

  // Get the description from the current rank (or first rank if not selected)
  const currentRank = data.currentRank || 0
  const displayRank = currentRank > 0 ? currentRank : 1
  const description =
    data.ranks.find(r => r.rank === displayRank)?.description?.base ||
    data.ranks[0]?.description?.base ||
    ''

  // For subtext, show current rank benefits and next rank benefits
  let subtextContent: React.ReactNode = null
  if (totalRanks > 1) {
    const subtextElements: React.ReactNode[] = []

    // Rule 1: If a rank is currently selected, show the current rank subtext
    if (currentRank > 0) {
      const currentRankSubtext = data.ranks.find(r => r.rank === currentRank)
        ?.description?.subtext
      if (currentRankSubtext) {
        subtextElements.push(
          <div key="current" className="mb-2">
            <span className="text-green-600 dark:text-green-400 font-medium">
              Current:
            </span>{' '}
            {currentRankSubtext}
          </div>
        )
      }
    }

    // Rule 2: If there is a higher rank than the current, show what the next rank gives
    if (currentRank < totalRanks) {
      const nextRank = currentRank + 1
      const nextRankSubtext = data.ranks.find(r => r.rank === nextRank)
        ?.description?.subtext
      if (nextRankSubtext) {
        subtextElements.push(
          <div key="next">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              Next:
            </span>{' '}
            {nextRankSubtext}
          </div>
        )
      }
    }

    subtextContent = subtextElements.length > 0 ? <>{subtextElements}</> : null
  } else {
    // Single rank perk
    const singleRankSubtext = data.ranks[0]?.description?.subtext || ''
    subtextContent = singleRankSubtext ? <div>{singleRankSubtext}</div> : null
  }

  return (
    <HoverCard open={isHoverCardOpen} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <div
          style={getNodeStyle()}
          onClick={handleNodeClick}
          onMouseDown={e => e.stopPropagation()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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

      <HoverCardPortal>
        <HoverCardContent
          className="w-80"
          style={{
            zIndex: Z_INDEX.TOOLTIP,
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{data.name}</h4>
            <div className="text-sm text-muted-foreground">{description}</div>

            {/* Subtext as secondary section */}
            {subtextContent && (
              <div className="text-xs text-muted-foreground/80 italic border-l-2 border-muted pl-2">
                {subtextContent}
              </div>
            )}

            {/* Level requirements for all ranks */}
            {totalRanks > 1 ? (
              <div className="text-xs pt-2 border-t">
                <div className="font-medium mb-1">Level Requirements:</div>
                {Array.from({ length: totalRanks }, (_, i) => i + 1).map(
                  rank => {
                    const requiredLevel = getMinLevelForRank(data, rank)
                    const currentSkillLevel = data.currentSkillLevel || 0

                    return (
                      <div
                        key={rank}
                        className="flex justify-between items-center py-1"
                      >
                        <span>Rank {rank}:</span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {requiredLevel
                            ? `Level ${requiredLevel}`
                            : 'No requirement'}
                        </span>
                      </div>
                    )
                  }
                )}
                <div className="text-muted-foreground mt-2 italic">
                  Current: Level {data.currentSkillLevel || 0}
                </div>
              </div>
            ) : (
              // Single rank perk level requirement
              (() => {
                const requiredLevel = getMinLevelForRank(data, 1)
                const currentSkillLevel = data.currentSkillLevel || 0

                return requiredLevel ? (
                  <div className="text-xs font-medium pt-1 text-blue-600 dark:text-blue-400">
                    Required Level: {requiredLevel}
                    <br />
                    <span className="text-muted-foreground">
                      Current: Level {currentSkillLevel}
                    </span>
                  </div>
                ) : null
              })()
            )}

            {totalRanks > 1 && (
              <div className="text-xs text-muted-foreground pt-2 border-t">
                <strong>Current:</strong> {data.currentRank || 0}/{totalRanks}{' '}
                ranks
                <br />
                <em>Click to cycle through available ranks</em>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  )
}
export const PerkNode = memo(PerkNodeComponent)
