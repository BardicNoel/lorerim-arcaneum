import { cn } from '@/lib/utils'

interface AttributeProgressBarsProps {
  health: number
  stamina: number
  magicka: number
  className?: string
  showTitle?: boolean
}

export function AttributeProgressBars({
  health,
  stamina,
  magicka,
  className,
  showTitle = true,
}: AttributeProgressBarsProps) {
  // Find the maximum value to scale all bars relative to it
  const maxValue = Math.max(health, stamina, magicka)
  
  // Calculate percentages relative to the maximum value
  const healthPercentage = (health / maxValue) * 100
  const staminaPercentage = (stamina / maxValue) * 100
  const magickaPercentage = (magicka / maxValue) * 100

  return (
    <div className={cn('space-y-2', className)}>
      {showTitle && <h4 className="text-sm font-medium">Attributes</h4>}
      <div className="space-y-3">
        {/* Health Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Health</span>
            <span className="font-medium">{health}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Stamina Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Stamina</span>
            <span className="font-medium">{stamina}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${staminaPercentage}%` }}
            />
          </div>
        </div>

        {/* Magicka Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Magicka</span>
            <span className="font-medium">{magicka}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${magickaPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 