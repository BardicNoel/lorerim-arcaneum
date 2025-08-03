import { useCharacterStore } from '@/shared/stores/characterStore'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAttributeAssignments } from '../useAttributeAssignments'

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

    expect(result.current.assignments.health).toBe(5)
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

    expect(result.current.displayData.health.total).toBe(105) // 100 base + 5 assigned
    expect(result.current.displayData.stamina.total).toBe(105) // 100 base + 5 assigned
    expect(result.current.displayData.magicka.total).toBe(105) // 100 base + 5 assigned

    // Test ratios - each should be 33.3% since all have equal assignments
    expect(result.current.displayData.health.ratio).toBeCloseTo(33.33, 1)
    expect(result.current.displayData.stamina.ratio).toBeCloseTo(33.33, 1)
    expect(result.current.displayData.magicka.ratio).toBeCloseTo(33.33, 1)
  })

  it('should calculate ratios correctly when only one attribute is assigned', () => {
    const { result } = renderHook(() => useAttributeAssignments())

    act(() => {
      result.current.setAttributeAssignment(2, 'health')
      result.current.setAttributeAssignment(3, 'health')
      result.current.setAttributeAssignment(4, 'health')
    })

    // Health should have 100% of assignments, others 0%
    expect(result.current.displayData.health.ratio).toBe(100)
    expect(result.current.displayData.stamina.ratio).toBe(0)
    expect(result.current.displayData.magicka.ratio).toBe(0)
  })
})
