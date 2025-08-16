import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/ui/card'
import { Calculator } from 'lucide-react'
import { useDerivedStatsCalculation } from '../adapters/useDerivedStatsCalculation'
import { BaseAttributesDisplay } from './BaseAttributesDisplay'
import { DerivedStatsTable } from './DerivedStatsTable'

export function DerivedStatsCard() {
  const { baseAttributes, derivedStats } = useDerivedStatsCalculation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Derived Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Base Attributes
          </h4>
          <BaseAttributesDisplay attributes={baseAttributes} />
        </div>

        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
            Derived Attributes
          </h4>
          <DerivedStatsTable stats={derivedStats} />
        </div>
      </CardContent>
    </Card>
  )
}
