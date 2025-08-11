import { cn } from '@/lib/utils'
import type { Race } from '@/shared/data/schemas'
import { H5 } from '@/shared/ui/ui/typography'
import type { AttributeDisplayData } from '../../types'
import { AttributeStatBar } from '../atomic/AttributeStatBar'

interface AttributeSummaryDisplayProps {
  displayData: AttributeDisplayData
  level: number
  className?: string
  showRatios?: boolean
  compact?: boolean
  selectedRace?: Race | null
}

export function AttributeSummaryDisplay({
  displayData,
  level,
  className,
  showRatios = true,
  compact = false,
  selectedRace,
}: AttributeSummaryDisplayProps) {
  if (compact) {
    return (
      <div className={cn('space-y-3', className)}>
        <H5 className="text-lg font-medium text-foreground">
          Attribute Assignments
        </H5>

        {selectedRace && (
          <div className="text-xs text-muted-foreground mb-2">
            Base stats from {selectedRace.name}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Health</div>
            <div className="font-medium text-lg">
              {displayData.health.total}
            </div>
            <div className="text-xs text-muted-foreground">
              +{displayData.health.assigned}
            </div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Stamina</div>
            <div className="font-medium text-lg">
              {displayData.stamina.total}
            </div>
            <div className="text-xs text-muted-foreground">
              +{displayData.stamina.assigned}
            </div>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded">
            <div className="text-sm text-muted-foreground">Magicka</div>
            <div className="font-medium text-lg">
              {displayData.magicka.total}
            </div>
            <div className="text-xs text-muted-foreground">
              +{displayData.magicka.assigned}
            </div>
          </div>
        </div>

        {showRatios && (
          <div className="text-xs text-muted-foreground text-center">
            Level {level} •{' '}
            {displayData.health.assigned +
              displayData.stamina.assigned +
              displayData.magicka.assigned}{' '}
            assignments
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <H5 className="text-lg font-medium text-foreground">
        Attribute Assignments
      </H5>

      {selectedRace && selectedRace.startingStats && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">
              Base Stats from {selectedRace.name}:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium">Health</div>
                <div className="text-muted-foreground">
                  {selectedRace.startingStats.health}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Stamina</div>
                <div className="text-muted-foreground">
                  {selectedRace.startingStats.stamina}
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Magicka</div>
                <div className="text-muted-foreground">
                  {selectedRace.startingStats.magicka}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <AttributeStatBar
          value={displayData.health.total}
          label="Health"
          color="red"
          size="sm"
          showValue={true}
          maxValue={Math.max(
            displayData.health.total,
            displayData.stamina.total,
            displayData.magicka.total
          )}
        />
        <AttributeStatBar
          value={displayData.stamina.total}
          label="Stamina"
          color="green"
          size="sm"
          showValue={true}
          maxValue={Math.max(
            displayData.health.total,
            displayData.stamina.total,
            displayData.magicka.total
          )}
        />
        <AttributeStatBar
          value={displayData.magicka.total}
          label="Magicka"
          color="blue"
          size="sm"
          showValue={true}
          maxValue={Math.max(
            displayData.health.total,
            displayData.stamina.total,
            displayData.magicka.total
          )}
        />
      </div>

      {showRatios && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Health</div>
            <div className="text-muted-foreground">
              {displayData.health.ratio.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Stamina</div>
            <div className="text-muted-foreground">
              {displayData.stamina.ratio.toFixed(1)}%
            </div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-medium">Magicka</div>
            <div className="text-muted-foreground">
              {displayData.magicka.ratio.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        Level {level} •{' '}
        {displayData.health.assigned +
          displayData.stamina.assigned +
          displayData.magicka.assigned}{' '}
        assignments made
      </div>
    </div>
  )
}
