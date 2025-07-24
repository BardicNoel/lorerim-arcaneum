import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDestinyFilters } from '../useDestinyFilters'
import type { DestinyNode } from '../../types'

// Mock the destiny nodes adapter
vi.mock('../useDestinyNodes', () => ({
  useDestinyNodes: () => ({
    nodes: [
      {
        id: 'node1',
        name: 'Root Node 1',
        description: 'A root node',
        tags: ['combat', 'melee'],
        prerequisites: [],
      },
      {
        id: 'node2',
        name: 'Child Node 1',
        description: 'A child node',
        tags: ['combat', 'ranged'],
        prerequisites: ['Root Node 1'],
      },
      {
        id: 'node3',
        name: 'Child Node 2',
        description: 'Another child node',
        tags: ['magic', 'destruction'],
        prerequisites: ['Root Node 1'],
      },
    ] as DestinyNode[],
    rootNodes: [
      {
        id: 'node1',
        name: 'Root Node 1',
        description: 'A root node',
        tags: ['combat', 'melee'],
        prerequisites: [],
      },
    ] as DestinyNode[],
  }),
}))

// Mock the destiny path adapter
vi.mock('../useDestinyPath', () => ({
  useDestinyPath: () => ({
    currentPath: [],
  }),
}))

describe('useDestinyFilters', () => {
  it('should initialize with empty filters', () => {
    const { result } = renderHook(() => useDestinyFilters({ filterType: 'build-path' }))

    expect(result.current.selectedFilters).toEqual([])
    expect(result.current.searchCategories).toHaveLength(2) // Includes Node and Ends With Node
  })

  it('should generate correct search categories for build-path filters', () => {
    const { result } = renderHook(() => useDestinyFilters({ filterType: 'build-path' }))

    const categories = result.current.searchCategories
    expect(categories).toHaveLength(2)
    
    const includesCategory = categories.find(cat => cat.id === 'includes-node')
    expect(includesCategory).toBeDefined()
    expect(includesCategory?.name).toBe('Includes Node')
    
    const endsCategory = categories.find(cat => cat.id === 'ends-with-node')
    expect(endsCategory).toBeDefined()
    expect(endsCategory?.name).toBe('Ends With Node')
  })

  it('should generate correct search categories for reference filters', () => {
    const { result } = renderHook(() => useDestinyFilters({ filterType: 'reference' }))

    const categories = result.current.searchCategories
    expect(categories).toHaveLength(2)
    
    const tagsCategory = categories.find(cat => cat.id === 'tags')
    expect(tagsCategory).toBeDefined()
    expect(tagsCategory?.name).toBe('Tags')
    
    const prereqCategory = categories.find(cat => cat.id === 'prerequisites')
    expect(prereqCategory).toBeDefined()
    expect(prereqCategory?.name).toBe('Prerequisites')
  })

  it('should add filters correctly', () => {
    const { result } = renderHook(() => useDestinyFilters({ filterType: 'build-path' }))

    const filter = {
      id: 'test-filter',
      type: 'includes-node' as const,
      nodeName: 'Test Node',
      nodeId: 'test-node',
      label: 'Test Node',
    }

    act(() => {
      result.current.addFilter(filter)
    })

    expect(result.current.selectedFilters).toHaveLength(1)
    expect(result.current.selectedFilters[0]).toEqual(filter)
  })

  it('should remove filters correctly', () => {
    const { result } = renderHook(() => useDestinyFilters({ filterType: 'build-path' }))

    const filter = {
      id: 'test-filter',
      type: 'includes-node' as const,
      nodeName: 'Test Node',
      nodeId: 'test-node',
      label: 'Test Node',
    }

    act(() => {
      result.current.addFilter(filter)
    })

    expect(result.current.selectedFilters).toHaveLength(1)

    act(() => {
      result.current.removeFilter('test-filter')
    })

    expect(result.current.selectedFilters).toHaveLength(0)
  })

  it('should clear all filters', () => {
    const { result } = renderHook(() => useDestinyFilters({ filterType: 'build-path' }))

    const filter1 = {
      id: 'test-filter-1',
      type: 'includes-node' as const,
      nodeName: 'Test Node 1',
      nodeId: 'test-node-1',
      label: 'Test Node 1',
    }

    const filter2 = {
      id: 'test-filter-2',
      type: 'ends-with-node' as const,
      nodeName: 'Test Node 2',
      nodeId: 'test-node-2',
      label: 'Test Node 2',
    }

    act(() => {
      result.current.addFilter(filter1)
      result.current.addFilter(filter2)
    })

    expect(result.current.selectedFilters).toHaveLength(2)

    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.selectedFilters).toHaveLength(0)
  })

  it('should prevent duplicate filters', () => {
    const { result } = renderHook(() => useDestinyFilters({ filterType: 'build-path' }))

    const filter = {
      id: 'test-filter',
      type: 'includes-node' as const,
      nodeName: 'Test Node',
      nodeId: 'test-node',
      label: 'Test Node',
    }

    act(() => {
      result.current.addFilter(filter)
      result.current.addFilter(filter) // Try to add the same filter again
    })

    expect(result.current.selectedFilters).toHaveLength(1) // Should only have one
  })
}) 