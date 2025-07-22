import { useState, useCallback } from 'react'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'

/**
 * Custom Hook for Trait Limit Management
 *
 * Manages trait limit state and provides handlers for updating limits.
 * This follows the birthsigns pattern of custom hooks for state management.
 */
export function useTraitLimits() {
  const { build, updateBuild } = useCharacterBuild()

  const [regularLimit, setRegularLimit] = useState(build.traitLimits.regular)
  const [bonusLimit, setBonusLimit] = useState(build.traitLimits.bonus)

  const handleRegularLimitChange = useCallback(
    (value: number) => {
      setRegularLimit(value)
      updateBuild({
        traitLimits: { ...build.traitLimits, regular: value },
      })
    },
    [build.traitLimits, updateBuild]
  )

  const handleBonusLimitChange = useCallback(
    (value: number) => {
      setBonusLimit(value)
      updateBuild({
        traitLimits: { ...build.traitLimits, bonus: value },
      })
    },
    [build.traitLimits, updateBuild]
  )

  return {
    regularLimit,
    bonusLimit,
    handleRegularLimitChange,
    handleBonusLimitChange,
    currentRegularCount: build.traits.regular.length,
    currentBonusCount: build.traits.bonus.length,
  }
}
