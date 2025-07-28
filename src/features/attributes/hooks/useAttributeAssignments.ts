import { useMemo } from 'react'
import { useCharacterStore } from '@/shared/stores/characterStore'
import type { AttributeType, AttributeDisplayData } from '../types'

export function useAttributeAssignments() {
  const { build, setAttributeAssignment, clearAttributeAssignment, clearAllAttributeAssignments, updateAttributeLevel } = useCharacterStore()
  
  const assignments = build.attributeAssignments
  
  // Calculate display data
  const displayData = useMemo((): AttributeDisplayData => {
    const level = assignments.level || 1
    const totalAssignments = assignments.health + assignments.stamina + assignments.magicka
    
    return {
      health: {
        base: 100, // Base health - could come from race data
        assigned: assignments.health,
        total: 100 + assignments.health,
        ratio: level > 0 ? (assignments.health / level) * 100 : 0,
      },
      stamina: {
        base: 100, // Base stamina - could come from race data
        assigned: assignments.stamina,
        total: 100 + assignments.stamina,
        ratio: level > 0 ? (assignments.stamina / level) * 100 : 0,
      },
      magicka: {
        base: 100, // Base magicka - could come from race data
        assigned: assignments.magicka,
        total: 100 + assignments.magicka,
        ratio: level > 0 ? (assignments.magicka / level) * 100 : 0,
      },
    }
  }, [assignments])
  
  // Validation helpers
  const canAssignAtLevel = (level: number) => {
    return level > 0 && level <= assignments.level
  }
  
  const getAssignmentAtLevel = (level: number): AttributeType | null => {
    return assignments.assignments[level] || null
  }
  
  const getTotalAssignments = () => {
    return assignments.health + assignments.stamina + assignments.magicka
  }
  
  const getUnassignedLevels = () => {
    const assignedLevels = Object.keys(assignments.assignments).map(Number)
    const unassigned = []
    
    for (let i = 2; i <= assignments.level; i++) { // Start at level 2 (level 1 has no assignment)
      if (!assignedLevels.includes(i)) {
        unassigned.push(i)
      }
    }
    
    return unassigned
  }
  
  return {
    // State
    assignments,
    displayData,
    level: assignments.level,
    
    // Actions
    setAttributeAssignment,
    clearAttributeAssignment,
    clearAllAttributeAssignments,
    updateAttributeLevel,
    
    // Computed
    canAssignAtLevel,
    getAssignmentAtLevel,
    getTotalAssignments,
    getUnassignedLevels,
  }
} 