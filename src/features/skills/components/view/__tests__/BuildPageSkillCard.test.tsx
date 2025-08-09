import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BuildPageSkillCard } from '../BuildPageSkillCard'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useSkillsQuickSelector } from '../../../adapters/useSkillsQuickSelector'
import { useSkillData } from '../../../adapters/useSkillData'

// Mock the hooks
vi.mock('@/shared/hooks/useCharacterBuild')
vi.mock('../../../adapters/useSkillsQuickSelector')
vi.mock('../../../adapters/useSkillData')
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

const mockUseCharacterBuild = vi.mocked(useCharacterBuild)
const mockUseSkillsQuickSelector = vi.mocked(useSkillsQuickSelector)
const mockUseSkillData = vi.mocked(useSkillData)

describe('BuildPageSkillCard', () => {
  const mockSkills = [
    {
      id: 'skill1',
      name: 'One-Handed',
      category: 'Combat',
      description: 'One-handed weapons',
      keyAbilities: ['Strength'],
      metaTags: ['combat'],
      assignmentType: 'none' as const,
      canAssignMajor: true,
      canAssignMinor: true,
      level: 0,
      totalPerks: 5,
      selectedPerksCount: 0,
      selectedPerks: [],
      isSelected: false,
    },
    {
      id: 'skill2',
      name: 'Two-Handed',
      category: 'Combat',
      description: 'Two-handed weapons',
      keyAbilities: ['Strength'],
      metaTags: ['combat'],
      assignmentType: 'none' as const,
      canAssignMajor: true,
      canAssignMinor: true,
      level: 0,
      totalPerks: 4,
      selectedPerksCount: 0,
      selectedPerks: [],
      isSelected: false,
    },
    {
      id: 'skill3',
      name: 'Archery',
      category: 'Combat',
      description: 'Bows and arrows',
      keyAbilities: ['Agility'],
      metaTags: ['combat'],
      assignmentType: 'none' as const,
      canAssignMajor: true,
      canAssignMinor: true,
      level: 0,
      totalPerks: 6,
      selectedPerksCount: 0,
      selectedPerks: [],
      isSelected: false,
    },
  ]

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Mock useSkillData
    mockUseSkillData.mockReturnValue({
      skills: mockSkills,
      loading: false,
      error: null,
      refreshSkills: vi.fn(),
    })

    // Mock useCharacterBuild
    mockUseCharacterBuild.mockReturnValue({
      build: {
        skills: {
          major: ['skill1'], // One-Handed is assigned as major
          minor: ['skill2'], // Two-Handed is assigned as minor
        },
        perks: {
          selected: {
            skill1: ['perk1'], // One-Handed has perks
            skill2: ['perk2'], // Two-Handed has perks
            skill3: ['perk3'], // Archery has perks but is not assigned
          },
        },
        skillLevels: {
          skill1: 15,
          skill2: 12,
          skill3: 8,
        },
      },
      getSkillLevel: vi.fn((skillId) => {
        const levels = { skill1: 15, skill2: 12, skill3: 8 }
        return levels[skillId as keyof typeof levels] || 0
      }),
      getSkillPerks: vi.fn((skillId) => {
        const perks = {
          skill1: ['perk1'],
          skill2: ['perk2'],
          skill3: ['perk3'],
        }
        return perks[skillId as keyof typeof perks] || []
      }),
    } as any)

    // Mock useSkillsQuickSelector
    mockUseSkillsQuickSelector.mockReturnValue({
      selectedMajorSkills: [mockSkills[0]], // One-Handed
      selectedMinorSkills: [mockSkills[1]], // Two-Handed
      availableSkills: [mockSkills[2]], // Archery
      skills: mockSkills,
      loading: false,
      error: null,
      handleMajorSkillSelect: vi.fn(),
      handleMinorSkillSelect: vi.fn(),
      handleMajorSkillRemove: vi.fn(),
      handleMinorSkillRemove: vi.fn(),
    })
  })

  it('should not show major skills in "Other Perked Skills" section', () => {
    render(<BuildPageSkillCard />)
    
    // Check that One-Handed (major skill) is not in the "Other Perked Skills" section
    const [otherPerkedSection] = screen.getAllByText('Other Perked Skills')
    expect(otherPerkedSection).toBeInTheDocument()
    
    // One-Handed should not appear in the other perked skills list
    const oneHandedSkill = screen.queryByText('One-Handed')
    expect(oneHandedSkill).toBeInTheDocument() // It should be in the major skills section
    
    // Verify it's in the major skills section, not the other perked skills section
    const majorSkillsSection = screen.getByText('Major Skills')
    expect(majorSkillsSection).toBeInTheDocument()
  })

  it('should not show minor skills in "Other Perked Skills" section', () => {
    render(<BuildPageSkillCard />)
    
    // Check that Two-Handed (minor skill) is not in the "Other Perked Skills" section
    const [otherPerkedSection] = screen.getAllByText('Other Perked Skills')
    expect(otherPerkedSection).toBeInTheDocument()
    
    // Two-Handed should not appear in the other perked skills list
    const twoHandedSkill = screen.queryByText('Two-Handed')
    expect(twoHandedSkill).toBeInTheDocument() // It should be in the minor skills section
    
    // Verify it's in the minor skills section, not the other perked skills section
    const minorSkillsSection = screen.getByText('Minor Skills')
    expect(minorSkillsSection).toBeInTheDocument()
  })

  it('should show unassigned skills with perks in "Other Perked Skills" section', () => {
    render(<BuildPageSkillCard />)
    
    // Check that Archery (unassigned skill with perks) appears in the "Other Perked Skills" section
    const otherPerkedSection = screen.getByText('Other Perked Skills')
    expect(otherPerkedSection).toBeInTheDocument()
    
    // Archery should appear in the other perked skills list
    const archerySkill = screen.queryByText('Archery')
    expect(archerySkill).toBeInTheDocument()
  })
}) 