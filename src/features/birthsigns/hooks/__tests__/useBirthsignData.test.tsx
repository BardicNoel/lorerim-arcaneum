import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act, waitFor } from '@testing-library/react'
import { useBirthsignData } from '../useBirthsignData'
import React from 'react'

const mockBirthsigns = [
  {
    name: 'The Warrior',
    group: 'Warrior',
    description: '',
    powers: [],
    edid: 'warrior',
    formid: '0001',
    stat_modifications: [],
    skill_bonuses: [],
    conditional_effects: [],
    mastery_effects: [],
  },
  {
    name: 'The Mage',
    group: 'Mage',
    description: '',
    powers: [],
    edid: 'mage',
    formid: '0002',
    stat_modifications: [],
    skill_bonuses: [],
    conditional_effects: [],
    mastery_effects: [],
  },
]

function setupHook() {
  const hookResult: any = {}
  function TestComponent() {
    Object.assign(hookResult, useBirthsignData())
    return null
  }
  render(<TestComponent />)
  return hookResult
}

describe('useBirthsignData', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should have initial loading state', () => {
    const result = setupHook()
    expect(result.loading).toBe(true)
    expect(result.error).toBeNull()
    expect(Array.isArray(result.birthsigns)).toBe(true)
  })

  it('should fetch and populate birthsigns', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBirthsigns),
        })
      )
    )
    const result = setupHook()
    await waitFor(() => {
      expect(result.loading).toBe(false)
      expect(result.birthsigns.length).toBeGreaterThan(0)
      expect(result.error).toBeNull()
    })
  })

  it('should handle fetch error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: false }))
    )
    const hookResult: any = {}
    function TestComponent() {
      Object.assign(hookResult, useBirthsignData())
      return null
    }
    render(<TestComponent />)
    await waitFor(() => {
      expect(hookResult.loading).toBe(false)
      expect(hookResult.error).not.toBeNull()
      expect(hookResult.birthsigns.length).toBe(0)
    })
  })

  it('should refetch data when refetch is called', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBirthsigns),
        })
      )
    )
    const result = setupHook()
    await waitFor(() => expect(result.loading).toBe(false))
    const originalCount = result.birthsigns.length
    act(() => result.refetch())
    await waitFor(() => expect(result.loading).toBe(false))
    expect(result.birthsigns.length).toBe(originalCount)
  })
})
