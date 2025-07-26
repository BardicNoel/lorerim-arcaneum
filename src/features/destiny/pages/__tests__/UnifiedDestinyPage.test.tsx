import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UnifiedDestinyPage } from '../UnifiedDestinyPage'

// Mock the data cache hooks
vi.mock('@/shared/data/useDataCache', () => ({
  useDestinyNodes: () => ({
    data: [
      {
        id: '0xFE25F808',
        name: 'Destiny',
        edid: 'DAR_Perk01Destiny',
        description: 'Increases carry weight by 25.',
        prerequisites: [],
        globalFormId: '0xFE25F808',
        tags: ['Utility'],
      },
      {
        id: '0xFE25F80A',
        name: 'Focus',
        edid: 'DAR_Perk02Focus',
        description: 'Your Magicka Regeneration is increased by 50%.',
        prerequisites: ['DAR_Perk01Destiny'],
        globalFormId: '0xFE25F80A',
        tags: ['Magic', 'Utility'],
      },
    ],
    loading: false,
    error: null,
    reload: vi.fn(),
  }),
}))

// Mock the player creation hook
vi.mock('@/shared/hooks/usePlayerCreation', () => ({
  usePlayerCreation: () => ({
    viewMode: 'list',
    selectedItem: null,
    setSelectedItem: vi.fn(),
    setViewMode: vi.fn(),
  }),
}))

// Mock the destiny adapters
vi.mock('../../adapters/useDestinyFilters', () => ({
  useDestinyFilters: () => ({
    selectedFilters: [],
    addFilter: vi.fn(),
    removeFilter: vi.fn(),
    clearFilters: vi.fn(),
    searchOptions: [],
    searchCategories: [
      { id: 'includes-node', name: 'Includes Node', options: [] },
      { id: 'tags', name: 'Tags', options: [] },
      { id: 'prerequisites', name: 'Prerequisites', options: [] },
    ],
  }),
}))

vi.mock('../../adapters/useDestinyPath', () => ({
  useDestinyPath: () => ({
    currentPath: [],
    isValidPath: true,
    pathErrors: [],
    setPath: vi.fn(),
    clearPath: vi.fn(),
    getPathSummary: vi.fn(() => ({
      totalNodes: 0,
      totalLevels: 0,
      averageLevel: 0,
    })),
  }),
}))

vi.mock('../../adapters/useDestinyPossiblePaths', () => ({
  useDestinyPossiblePaths: () => ({
    possiblePaths: [],
  }),
}))

describe('UnifiedDestinyPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    // This test just verifies that the component renders without throwing an error
    expect(() => render(<UnifiedDestinyPage />)).not.toThrow()
  })
})
