import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useRacesStore } from '@/shared/stores/racesStore'
import { useMemo } from 'react'
import { DERIVED_STATS_CONFIG } from '../config/derivedStatsConfig'
import { DerivedStatsCalculator } from '../model/DerivedStatsCalculator'
import type { DataSources, DerivedStatsCalculation } from '../types'

export function useDerivedStatsCalculation(): DerivedStatsCalculation {
  const { build } = useCharacterBuild()
  const { data: races } = useRacesStore()

  const calculation = useMemo(() => {
    const dataSources: DataSources = {
      races,
    }

    const baseAttributes = DerivedStatsCalculator.calculateBaseAttributes(
      build,
      dataSources
    )

    const derivedStats = DerivedStatsCalculator.calculateAllDerivedStats(
      baseAttributes,
      DERIVED_STATS_CONFIG
    )

    return {
      baseAttributes,
      derivedStats,
      sources: {
        race: build.race || 'None',
        birthsign: build.stone || 'None',
        traits: [
          ...(build.traits?.regular || []),
          ...(build.traits?.bonus || []),
        ],
        equipment: build.equipment || [],
        religion: build.religion || 'None',
        destinyPath: build.destinyPath || [],
        attributeAssignments: build.attributeAssignments?.level || 0,
      },
    }
  }, [build, races])

  return calculation
}
