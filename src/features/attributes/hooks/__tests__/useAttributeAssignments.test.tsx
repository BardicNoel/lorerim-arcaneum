import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAttributeAssignments } from '../useAttributeAssignments'
import { useCharacterStore } from '@/shared/stores/characterStore'

describe('useAttributeAssignments', () => {
  beforeEach(() => {
    useCharacterStore.getState().resetBuild()
  })
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAttributeAssignments())
    
    expect(result.current.level).toBe(1)
    expect(result.current.assignments.health).toBe(0)
    expect(result.current.assignments.stamina).toBe(0)
    expect(result.current.assignments.magicka).toBe(0)
  })
  
  it('should set attribute assignment correctly', () => {
    const { result } = renderHook(() => useAttributeAssignments())
    
    act(() => {
      result.current.setAttributeAssignment(2, 'health')
    })
    
    expect(result.current.assignments.health).toBe(1)
    expect(result.current.getAssignmentAtLevel(2)).toBe('health')
  })
  
  it('should clear attribute assignment correctly', () => {
    const { result } = renderHook(() => useAttributeAssignments())
    
    act(() => {
      result.current.setAttributeAssignment(2, 'health')
      result.current.clearAttributeAssignment(2)
    })
    
    expect(result.current.assignments.health).toBe(0)
    expect(result.current.getAssignmentAtLevel(2)).toBeNull()
  })
  
  it('should calculate display data correctly', () => {
    const { result } = renderHook(() => useAttributeAssignments())
    
    act(() => {
      result.current.setAttributeAssignment(2, 'health')
      result.current.setAttributeAssignment(3, 'stamina')
      result.current.setAttributeAssignment(4, 'magicka')
    })
    
    expect(result.current.displayData.health.total).toBe(101) // 100 base + 1 assigned
    expect(result.current.displayData.stamina.total).toBe(101) // 100 base + 1 assigned
    expect(result.current.displayData.magicka.total).toBe(101) // 100 base + 1 assigned
  })
}) 