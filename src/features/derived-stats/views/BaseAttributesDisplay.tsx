import { Activity, Heart, Zap } from 'lucide-react'
import type { BaseAttributes } from '../types'

interface BaseAttributesDisplayProps {
  attributes: BaseAttributes
}

export function BaseAttributesDisplay({
  attributes,
}: BaseAttributesDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 p-3 bg-background rounded border">
        <Heart className="w-5 h-5 text-red-500" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Health</span>
          <span className="text-lg font-bold text-red-600">
            {attributes.health}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-background rounded border">
        <Zap className="w-5 h-5 text-blue-500" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Magicka</span>
          <span className="text-lg font-bold text-blue-600">
            {attributes.magicka}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 bg-background rounded border">
        <Activity className="w-5 h-5 text-green-500" />
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Stamina</span>
          <span className="text-lg font-bold text-green-600">
            {attributes.stamina}
          </span>
        </div>
      </div>
    </div>
  )
}
