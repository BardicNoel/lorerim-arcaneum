import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/ui/ui/button'
import { Badge } from '@/shared/ui/ui/badge'
import { RotateCcw, X } from 'lucide-react'

// Pure presentational component for perk tree header
interface PerkTreeHeaderProps {
  skillName: string
  skillCategory: string
  selectedPerksCount: number
  totalPerksCount: number
  onReset: () => void
  onClose: () => void
  className?: string
}

export function PerkTreeHeader({
  skillName,
  skillCategory,
  selectedPerksCount,
  totalPerksCount,
  onReset,
  onClose,
  className,
}: PerkTreeHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between p-4 border-b", className)}>
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">{skillName}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {skillCategory}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {selectedPerksCount}/{totalPerksCount} Perks
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="text-xs"
        >
          <X className="w-3 h-3 mr-1" />
          Close
        </Button>
      </div>
    </div>
  )
} 