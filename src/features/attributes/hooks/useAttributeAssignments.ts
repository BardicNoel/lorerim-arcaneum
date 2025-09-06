import { useCharacterStore } from '@/shared/stores/characterStore'
import { useRacesStore } from '@/shared/stores/racesStore'
import { useMemo } from 'react'
import type { AttributeDisplayData } from '../types'

export function useAttributeAssignments() {
  const {
    build,
    setAttributePoints,
    clearAllAttributeAssignments,
    updateAttributeLevel,
  } = useCharacterStore()
  const { data: races } = useRacesStore()

  const assignments = build.attributeAssignments

  // Get the selected race data
  const selectedRace = useMemo(() => {
    if (!build.race || races.length === 0) return null
    return races.find(race => race.edid === build.race) || null
  }, [build.race, races])

  // Get base stats from race or use defaults
  const baseStats = useMemo(() => {
    if (selectedRace?.startingStats) {
      return {
        health: selectedRace.startingStats.health,
        stamina: selectedRace.startingStats.stamina,
        magicka: selectedRace.startingStats.magicka,
      }
    }
    // Default values if no race is selected
    return {
      health: 100,
      stamina: 100,
      magicka: 100,
    }
  }, [selectedRace])

  // Calculate display data
  const displayData = useMemo((): AttributeDisplayData => {
    const level = assignments.level || 1
    const totalAssignments =
      assignments.health + assignments.stamina + assignments.magicka

    return {
      health: {
        base: baseStats.health,
        assigned: assignments.health,
        total: baseStats.health + assignments.health * 5, // Each assignment point = 5 attribute points
        ratio:
          totalAssignments > 0
            ? (assignments.health / totalAssignments) * 100
            : 0,
      },
      stamina: {
        base: baseStats.stamina,
        assigned: assignments.stamina,
        total: baseStats.stamina + assignments.stamina * 5, // Each assignment point = 5 attribute points
        ratio:
          totalAssignments > 0
            ? (assignments.stamina / totalAssignments) * 100
            : 0,
      },
      magicka: {
        base: baseStats.magicka,
        assigned: assignments.magicka,
        total: baseStats.magicka + assignments.magicka * 5, // Each assignment point = 5 attribute points
        ratio:
          totalAssignments > 0
            ? (assignments.magicka / totalAssignments) * 100
            : 0,
      },
    }
  }, [assignments, baseStats])

  // Validation helpers (simplified)
  const getTotalAssignments = () => {
    return assignments.health + assignments.stamina + assignments.magicka
  }

  const getMaxPossibleAssignments = () => {
    // No limit on attribute points - users can assign any amount up to level 100
    // The level cap is 100, so we allow unlimited assignment
    return Infinity
  }

  const getRemainingAssignments = () => {
    return getMaxPossibleAssignments() - getTotalAssignments()
  }

  return {
    // State
    assignments,
    displayData,
    level: assignments.level,
    selectedRace,
    baseStats,

    // Actions
    setAttributePoints,
    clearAllAttributeAssignments,
    updateAttributeLevel,

    // Computed
    getTotalAssignments,
    getMaxPossibleAssignments,
    getRemainingAssignments,
  }
}
