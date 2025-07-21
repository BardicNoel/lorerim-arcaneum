import { describe, it, expect } from 'vitest'
import { render, act } from '@testing-library/react'
import { useDisplayControls } from '../useDisplayControls'
import React from 'react'

function setupHook() {
  let hookResult: any = {}
  function TestComponent() {
    Object.assign(hookResult, useDisplayControls())
    return null
  }
  render(<TestComponent />)
  return hookResult
}

describe('useDisplayControls', () => {
  it('should initialize all controls to true', () => {
    const result = setupHook()
    expect(result.showStats).toBe(true)
    expect(result.showPowers).toBe(true)
    expect(result.showSkills).toBe(true)
    expect(result.showEffects).toBe(true)
  })

  it('should toggle each control', () => {
    const result = setupHook()
    act(() => result.toggleStats())
    expect(result.showStats).toBe(false)
    act(() => result.togglePowers())
    expect(result.showPowers).toBe(false)
    act(() => result.toggleSkills())
    expect(result.showSkills).toBe(false)
    act(() => result.toggleEffects())
    expect(result.showEffects).toBe(false)
  })

  it('should set each control directly', () => {
    const result = setupHook()
    act(() => result.setStats(false))
    expect(result.showStats).toBe(false)
    act(() => result.setPowers(false))
    expect(result.showPowers).toBe(false)
    act(() => result.setSkills(false))
    expect(result.showSkills).toBe(false)
    act(() => result.setEffects(false))
    expect(result.showEffects).toBe(false)
  })

  it('should toggle all controls with toggleAll', () => {
    const result = setupHook()
    act(() => result.toggleAll(false))
    expect(result.showStats).toBe(false)
    expect(result.showPowers).toBe(false)
    expect(result.showSkills).toBe(false)
    expect(result.showEffects).toBe(false)
    act(() => result.toggleAll(true))
    expect(result.showStats).toBe(true)
    expect(result.showPowers).toBe(true)
    expect(result.showSkills).toBe(true)
    expect(result.showEffects).toBe(true)
  })
}) 