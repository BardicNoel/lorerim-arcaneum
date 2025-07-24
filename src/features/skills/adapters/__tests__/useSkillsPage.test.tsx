import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSkillsPage } from '../useSkillsPage'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useSkillData } from '../useSkillData'
import { useSkillFilters } from '../useSkillFilters'

// Mock the dependencies
vi.mock('@/shared/hooks/useCharacterBuild')
vi.mock('../useSkillData')
vi.mock('../useSkillFilters')

const mockUseCharacterBuild = vi.mocked(useCharacterBuild)
const mockUseSkillData = vi.mocked(useSkillData)
const mockUseSkillFilters = vi.mocked(useSkillFilters)

describe('useSkillsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock useSkillData
    mockUseSkillData.mockReturnValue({
      skills: [
        {
          id: 'skill1',
          name: 'One-Handed',
          description: 'Weapon skills',
          category: 'Combat',
          keyAbilities: ['Strength'],
          metaTags: ['weapon'],
          assignmentType: 'none',
          canAssignMajor: true,
          canAssignMinor: true,
          level: 0,
          totalPerks: 10,
          selectedPerksCount: 0,
          selectedPerks: [],
          isSelected: false,
        },
        {
          id: 'skill2',
          name: 'Two-Handed',
          description: 'Heavy weapon skills',
          category: 'Combat',
          keyAbilities: ['Strength'],
          metaTags: ['weapon'],
          assignmentType: 'none',
          canAssignMajor: true,
          canAssignMinor: true,
          level: 0,
          totalPerks: 8,
          selectedPerksCount: 2,
          selectedPerks: [],
          isSelected: false,
        },
      ],
      loading: false,
      error: null,
      refreshSkills: vi.fn(),
    })

    // Mock useCharacterBuild
    mockUseCharacterBuild.mockReturnValue({
      build: {
        skills: {
          major: ['skill1'],
          minor: ['skill2'],
        },
        perks: {
          selected: {
            skill1: ['perk1', 'perk2'],
            skill2: ['perk3'],
          },
          ranks: {},
        },
      },
      addMajorSkill: vi.fn(),
      addMinorSkill: vi.fn(),
      removeMajorSkill: vi.fn(),
      removeMinorSkill: vi.fn(),
      getSkillPerks: vi.fn(),
      getPerkRank: vi.fn(),
      addPerk: vi.fn(),
      removePerk: vi.fn(),
      setPerkRank: vi.fn(),
      clearSkillPerks: vi.fn(),
    })

    // Mock useSkillFilters
    mockUseSkillFilters.mockReturnValue({
      searchQuery: '',
      setSearchQuery: vi.fn(),
      selectedCategory: null,
      setSelectedCategory: vi.fn(),
      filteredSkills: [
        {
          id: 'skill1',
          name: 'One-Handed',
          description: 'Weapon skills',
          category: 'Combat',
          keyAbilities: ['Strength'],
          metaTags: ['weapon'],
          assignmentType: 'none',
          canAssignMajor: true,
          canAssignMinor: true,
          level: 0,
          totalPerks: 10,
          selectedPerksCount: 0,
          selectedPerks: [],
          isSelected: false,
        },
        {
          id: 'skill2',
          name: 'Two-Handed',
          description: 'Heavy weapon skills',
          category: 'Combat',
          keyAbilities: ['Strength'],
          metaTags: ['weapon'],
          assignmentType: 'none',
          canAssignMajor: true,
          canAssignMinor: true,
          level: 0,
          totalPerks: 8,
          selectedPerksCount: 2,
          selectedPerks: [],
          isSelected: false,
        },
      ],
      categories: ['Combat', 'Magic'],
      clearFilters: vi.fn(),
    })
  })

  it('should return skills with assignment state', () => {
    const { result } = renderHook(() => useSkillsPage())

    expect(result.current.skills).toHaveLength(2)
    expect(result.current.skills[0]).toMatchObject({
      id: 'skill1',
      name: 'One-Handed',
      assignmentType: 'major',
      canAssignMajor: false,
      canAssignMinor: true,
      perkCount: '0/10',
    })
    expect(result.current.skills[1]).toMatchObject({
      id: 'skill2',
      name: 'Two-Handed',
      assignmentType: 'minor',
      canAssignMajor: true,
      canAssignMinor: false,
      perkCount: '2/8',
    })
  })

  it('should compute skill summary correctly', () => {
    const { result } = renderHook(() => useSkillsPage())

    expect(result.current.skillSummary).toMatchObject({
      majorCount: 1,
      minorCount: 1,
      majorLimit: 3,
      minorLimit: 6,
      canAssignMajor: true,
      canAssignMinor: true,
      totalSkills: 2,
      totalPerks: 2,
    })
  })

  it('should provide assignment handlers', () => {
    const { result } = renderHook(() => useSkillsPage())
    const mockAddMajorSkill = vi.fn()
    const mockAddMinorSkill = vi.fn()
    const mockRemoveMajorSkill = vi.fn()
    const mockRemoveMinorSkill = vi.fn()

    mockUseCharacterBuild.mockReturnValue({
      build: {
        skills: { major: [], minor: [] },
        perks: { selected: {}, ranks: {} },
      },
      addMajorSkill: mockAddMajorSkill,
      addMinorSkill: mockAddMinorSkill,
      removeMajorSkill: mockRemoveMajorSkill,
      removeMinorSkill: mockRemoveMinorSkill,
      getSkillPerks: vi.fn(),
      getPerkRank: vi.fn(),
      addPerk: vi.fn(),
      removePerk: vi.fn(),
      setPerkRank: vi.fn(),
      clearSkillPerks: vi.fn(),
    })

    act(() => {
      result.current.onAssignMajor('skill1')
      result.current.onAssignMinor('skill2')
      result.current.onRemoveAssignment('skill1')
    })

    expect(mockAddMajorSkill).toHaveBeenCalledWith('skill1')
    expect(mockAddMinorSkill).toHaveBeenCalledWith('skill2')
    expect(mockRemoveMajorSkill).toHaveBeenCalledWith('skill1')
    expect(mockRemoveMinorSkill).toHaveBeenCalledWith('skill1')
  })

  it('should provide filter state and handlers', () => {
    const { result } = renderHook(() => useSkillsPage())

    expect(result.current.searchQuery).toBe('')
    expect(result.current.selectedCategory).toBe(null)
    expect(result.current.categories).toEqual(['Combat', 'Magic'])
    expect(typeof result.current.setSearchQuery).toBe('function')
    expect(typeof result.current.setSelectedCategory).toBe('function')
    expect(typeof result.current.clearFilters).toBe('function')
  })

  it('should handle skill selection', () => {
    const { result } = renderHook(() => useSkillsPage())

    expect(result.current.selectedSkillId).toBe(null)

    act(() => {
      result.current.onSkillSelect('skill1')
    })

    expect(result.current.selectedSkillId).toBe('skill1')
  })
}) 