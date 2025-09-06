import { cn } from '@/lib/utils'
import { useTheme } from '@/shared/context/ThemeContext'
import { Button } from '@/shared/ui/ui/button'
import { Input } from '@/shared/ui/ui/input'
import { H5 } from '@/shared/ui/ui/typography'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import type { AttributeType } from '../../types'

interface AttributeAssignmentControlsProps {
  level: number
  assignments: {
    health: number
    stamina: number
    magicka: number
    level: number
  }
  onAttributeChange: (attribute: AttributeType, points: number) => void
  onClearAll: () => void
  onUpdateAttributeLevel: (level: number) => void
  getTotalAssignments: () => number
  getMaxPossibleAssignments: () => number
  getRemainingAssignments: () => number
  className?: string
}

export function AttributeAssignmentControls({
  level,
  assignments,
  onAttributeChange,
  onClearAll,
  onUpdateAttributeLevel,
  getTotalAssignments,
  getMaxPossibleAssignments,
  getRemainingAssignments,
  className,
}: AttributeAssignmentControlsProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const totalAssigned = getTotalAssignments()
  const maxPossible = getMaxPossibleAssignments()
  const remaining = getRemainingAssignments()

  const handleIncrement = (attribute: AttributeType) => {
    const currentValue = assignments[attribute]
    // No limit on attribute points - always allow increment
    onAttributeChange(attribute, currentValue + 1) // 1 point per increment
  }

  const handleDecrement = (attribute: AttributeType) => {
    const currentValue = assignments[attribute]
    if (currentValue > 0) {
      onAttributeChange(attribute, Math.max(0, currentValue - 1)) // 1 point per decrement
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <H5 className="text-lg font-medium text-foreground">
          Attribute Points
        </H5>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Level Display with Integrated Controls */}
      <div className="p-3 bg-muted/30 rounded-lg border">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-muted-foreground">
            Character Level: {level} • {totalAssigned} points assigned (
            {totalAssigned * 5} total attribute points)
            {maxPossible === Infinity ? '' : ` • ${remaining} remaining`}
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground">Level:</label>
            <Input
              type="number"
              value={level}
              onChange={e => {
                const newLevel = parseInt(e.target.value) || 1
                if (newLevel >= 1 && newLevel <= 100) {
                  onUpdateAttributeLevel(newLevel)
                }
              }}
              className="w-16 text-center text-sm"
              min={1}
              max={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Health */}
          <div
            className="flex flex-col items-center p-3 rounded-lg border border-red-200 dark:border-red-800"
            style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
          >
            <div
              className={cn(
                'font-medium mb-3',
                isDark ? 'text-red-200' : 'text-red-500'
              )}
            >
              Health
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecrement('health')}
                disabled={assignments.health <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={assignments.health}
                onChange={e => {
                  const newValue = parseInt(e.target.value) || 0
                  if (newValue >= 0) {
                    onAttributeChange('health', newValue)
                  }
                }}
                className={cn(
                  'w-16 text-center text-lg font-bold border-red-300 focus:border-red-500 focus:ring-red-500',
                  isDark ? 'text-red-300 border-red-600' : 'text-red-700'
                )}
                min={0}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleIncrement('health')}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stamina */}
          <div
            className="flex flex-col items-center p-3 rounded-lg border border-green-200 dark:border-green-800"
            style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
          >
            <div
              className={cn(
                'font-medium mb-3',
                isDark ? 'text-green-200' : 'text-green-500'
              )}
            >
              Stamina
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecrement('stamina')}
                disabled={assignments.stamina <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={assignments.stamina}
                onChange={e => {
                  const newValue = parseInt(e.target.value) || 0
                  if (newValue >= 0) {
                    onAttributeChange('stamina', newValue)
                  }
                }}
                className={cn(
                  'w-16 text-center text-lg font-bold border-green-300 focus:border-green-500 focus:ring-green-500',
                  isDark ? 'text-green-300 border-green-600' : 'text-green-700'
                )}
                min={0}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleIncrement('stamina')}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Magicka */}
          <div
            className="flex flex-col items-center p-3 rounded-lg border border-blue-200 dark:border-blue-800"
            style={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
          >
            <div
              className={cn(
                'font-medium mb-3',
                isDark ? 'text-blue-200' : 'text-blue-500'
              )}
            >
              Magicka
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecrement('magicka')}
                disabled={assignments.magicka <= 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={assignments.magicka}
                onChange={e => {
                  const newValue = parseInt(e.target.value) || 0
                  if (newValue >= 0) {
                    onAttributeChange('magicka', newValue)
                  }
                }}
                className={cn(
                  'w-16 text-center text-lg font-bold border-blue-300 focus:border-blue-500 focus:ring-blue-500',
                  isDark ? 'text-blue-300 border-blue-600' : 'text-blue-700'
                )}
                min={0}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleIncrement('magicka')}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
