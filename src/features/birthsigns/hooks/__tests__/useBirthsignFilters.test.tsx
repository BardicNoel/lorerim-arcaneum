import { describe, it, expect } from 'vitest'
import { act } from 'react-dom/test-utils'
import { useBirthsignFilters } from '../useBirthsignFilters'
import React from 'react'
import { render } from '@testing-library/react'

const mockBirthsigns = [
  {
    name: 'The Warrior',
    group: 'Warrior',
    description: 'Strong and brave.',
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
    description: 'Wise and powerful.',
    powers: [],
    edid: 'mage',
    formid: '0002',
    stat_modifications: [],
    skill_bonuses: [],
    conditional_effects: [],
    mastery_effects: [],
  },
  {
    name: 'The Thief',
    group: 'Thief',
    description: 'Quick and cunning.',
    powers: [],
    edid: 'thief',
    formid: '0003',
    stat_modifications: [],
    skill_bonuses: [],
    conditional_effects: [],
    mastery_effects: [],
  },
]

function setupHook(birthsigns = mockBirthsigns) {
  const hookResult: any = {}
  function TestComponent() {
    Object.assign(hookResult, useBirthsignFilters(birthsigns))
    return null
  }
  render(<TestComponent />)
  return hookResult
}

describe('useBirthsignFilters', () => {
  it('should have initial state', () => {
    const result = setupHook()
    expect(result.selectedTags).toEqual([])
    expect(result.sortBy).toBe('alphabetical')
    expect(result.viewMode).toBe('grid')
    expect(result.expandedBirthsigns.size).toBe(0)
    expect(Array.isArray(result.sortedDisplayItems)).toBe(true)
  })

  it('should add and remove tags', () => {
    const result = setupHook()
    const tag = {
      id: 'group-Warrior',
      label: 'Warrior',
      value: 'Warrior',
      category: 'Birthsign Groups',
    }
    act(() => result.addTag(tag))
    expect(result.selectedTags).toContainEqual(tag)
    act(() => result.removeTag(tag.id))
    expect(result.selectedTags).not.toContainEqual(tag)
  })

  it('should not add duplicate tags', () => {
    const result = setupHook()
    const tag = {
      id: 'group-Warrior',
      label: 'Warrior',
      value: 'Warrior',
      category: 'Birthsign Groups',
    }
    act(() => result.addTag(tag))
    act(() => result.addTag(tag))
    expect(result.selectedTags.filter((t: any) => t.id === tag.id).length).toBe(
      1
    )
  })

  it('should set sort and view mode', () => {
    const result = setupHook()
    act(() => result.setSort('group'))
    expect(result.sortBy).toBe('group')
    act(() => result.setViewMode('list'))
    expect(result.viewMode).toBe('list')
  })

  it('should expand and collapse birthsigns', () => {
    const result = setupHook()
    const id = result.sortedDisplayItems[0]?.id
    act(() => result.toggleExpanded(id))
    expect(result.expandedBirthsigns.has(id)).toBe(true)
    act(() => result.collapseAll())
    expect(result.expandedBirthsigns.size).toBe(0)
    const allIds = result.sortedDisplayItems.map((item: any) => item.id)
    act(() => result.expandAll(allIds))
    expect(result.expandedBirthsigns.size).toBe(allIds.length)
  })

  it('should filter and sort display items', () => {
    const result = setupHook()
    // Add a tag to filter by group
    const tag = {
      id: 'group-Warrior',
      label: 'Warrior',
      value: 'Warrior',
      category: 'Birthsign Groups',
    }
    act(() => result.addTag(tag))
    expect(
      result.sortedDisplayItems.every(
        (item: any) => item.category === 'Warrior'
      )
    ).toBe(true)
    // Change sort to power-count
    act(() => result.setSort('power-count'))
    // Should still only show Warrior group, but sorted by power count
    expect(
      result.sortedDisplayItems.every(
        (item: any) => item.category === 'Warrior'
      )
    ).toBe(true)
  })
})
