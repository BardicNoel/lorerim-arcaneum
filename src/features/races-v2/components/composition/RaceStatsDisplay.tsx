import React from 'react'
import { cn } from '@/lib/utils'
import { H5 } from '@/shared/ui/ui/typography'
import type { Race } from '../../types'
import { StatBar } from '../atomic'

interface RaceStatsDisplayProps {
  stats: Race['startingStats']
  regeneration?: Race['regeneration']
  title?: string
  className?: string
  showRegeneration?: boolean
  compact?: boolean
}

export function RaceStatsDisplay({
  stats,
  regeneration,
  title = 'Stats',
  className,
  showRegeneration = true,
  compact = false,
}: RaceStatsDisplayProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <H5 className="text-lg font-medium text-foreground">{title}</H5>
      
      {/* Starting Stats - Grid Layout (Compact Mode) */}
      {compact && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">Health</span>
              <span className="font-medium">{stats.health}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">Magicka</span>
              <span className="font-medium">{stats.magicka}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">Stamina</span>
              <span className="font-medium">{stats.stamina}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <span className="text-sm text-muted-foreground">Carry Weight</span>
              <span className="font-medium">{stats.carryWeight}</span>
            </div>
          </div>
          {/* Regeneration Stats (Compact Mode) */}
          {showRegeneration && regeneration && (
            <div className="space-y-2 mt-3">
              <H5 className="text-lg font-medium text-foreground">Regeneration</H5>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">Health</div>
                  <div className="text-muted-foreground">
                    {regeneration.health.base.toFixed(2)}/s
                  </div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">Magicka</div>
                  <div className="text-muted-foreground">
                    {regeneration.magicka.base.toFixed(2)}/s
                  </div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">Stamina</div>
                  <div className="text-muted-foreground">
                    {regeneration.stamina.base.toFixed(2)}/s
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Progress Bars (Alternative View) */}
      {!compact && (
        <>
          <div className="space-y-3">
            <StatBar 
              value={stats.health} 
              maxValue={200} 
              label="Health" 
              color="red" 
              size="sm" 
            />
            <StatBar 
              value={stats.magicka} 
              maxValue={200} 
              label="Magicka" 
              color="blue" 
              size="sm" 
            />
            <StatBar 
              value={stats.stamina} 
              maxValue={200} 
              label="Stamina" 
              color="green" 
              size="sm" 
            />
          </div>
          {/* Regeneration Stats (Below Progress Bars) */}
          {showRegeneration && regeneration && (
            <div className="space-y-2 mt-3">
              <H5 className="text-lg font-medium text-foreground">Regeneration</H5>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">Health</div>
                  <div className="text-muted-foreground">
                    {regeneration.health.base.toFixed(2)}/s
                  </div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">Magicka</div>
                  <div className="text-muted-foreground">
                    {regeneration.magicka.base.toFixed(2)}/s
                  </div>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <div className="font-medium">Stamina</div>
                  <div className="text-muted-foreground">
                    {regeneration.stamina.base.toFixed(2)}/s
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
} 