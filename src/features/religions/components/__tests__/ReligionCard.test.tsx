import { render, screen } from '@testing-library/react'
import type { Religion } from '../../types'
import { ReligionCard } from '../ReligionCard'

// Mock the router
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

// Mock the player creation component
jest.mock('@/shared/components/playerCreation', () => ({
  AddToBuildSwitchSimple: ({ itemName }: { itemName: string }) => (
    <div data-testid="toggle-switch">{itemName}</div>
  ),
}))

// Mock the atomic components
jest.mock('../atomic', () => ({
  ReligionAvatar: ({ religionName }: { religionName: string }) => (
    <div data-testid="religion-avatar">{religionName}</div>
  ),
  ReligionCategoryBadge: ({ category }: { category: string }) => (
    <div data-testid="category-badge">{category}</div>
  ),
}))

describe('ReligionCard', () => {
  const mockReligion: Religion = {
    name: 'Test Religion',
    type: 'Divine',
    blessing: {
      spellId: 'test-blessing',
      spellName: 'Test Blessing',
      effects: [
        {
          magnitude: 10,
          area: 0,
          duration: 60,
          effectName: 'Test Effect',
          effectDescription: 'A test blessing effect',
          effectType: 'Restoration',
          targetAttribute: 'Health',
          keywords: [],
        },
      ],
    },
    boon1: {
      spellId: 'test-boon1',
      spellName: 'Test Boon 1',
      effects: [],
    },
    boon2: {
      spellId: 'test-boon2',
      spellName: 'Test Boon 2',
      effects: [],
    },
    tenet: {
      spellId: 'test-tenet',
      spellName: 'Test Tenet',
      header: 'Test Tenet Header',
      description: 'Test tenet description. This is a second sentence.',
      effects: [
        {
          magnitude: 5,
          area: 0,
          duration: 0,
          effectName: 'Test Tenet Effect',
          effectDescription: 'First tenet. Second tenet. Third tenet.',
          effectType: 'Alteration',
          targetAttribute: 'Magicka',
          keywords: [],
        },
      ],
    },
    favoredRaces: ['Nord', 'Imperial'],
    worshipRestrictions: [],
  }

  it('renders with minimal data', () => {
    render(<ReligionCard originalReligion={mockReligion} />)

    expect(screen.getByText('Test Religion')).toBeInTheDocument()
    expect(screen.getByText('Divine')).toBeInTheDocument()
    expect(screen.getByText('Test Religion')).toBeInTheDocument() // Avatar
    expect(screen.getByText('Divine')).toBeInTheDocument() // Category badge
  })

  it('shows effects count', () => {
    render(<ReligionCard originalReligion={mockReligion} />)

    // Should show 2 effects (1 blessing + 1 tenet)
    expect(screen.getByText('2 effects')).toBeInTheDocument()
  })

  it('shows favored races', () => {
    render(<ReligionCard originalReligion={mockReligion} />)

    expect(screen.getByText('Nord')).toBeInTheDocument()
    expect(screen.getByText('Imperial')).toBeInTheDocument()
  })

  it('shows blessing summary', () => {
    render(<ReligionCard originalReligion={mockReligion} />)

    expect(screen.getByText('Test Effect')).toBeInTheDocument()
  })

  it('shows tenets as chips', () => {
    render(<ReligionCard originalReligion={mockReligion} />)

    // Should show first few words of each tenet
    expect(screen.getByText('First tenet...')).toBeInTheDocument()
    expect(screen.getByText('Second tenet...')).toBeInTheDocument()
    expect(screen.getByText('Third tenet...')).toBeInTheDocument()
  })

  it('shows details button', () => {
    render(<ReligionCard originalReligion={mockReligion} />)

    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('handles missing data gracefully', () => {
    const minimalReligion: Religion = {
      name: 'Minimal Religion',
      type: 'Unknown',
      blessing: { spellId: '', spellName: '', effects: [] },
      boon1: { spellId: '', spellName: '', effects: [] },
      boon2: { spellId: '', spellName: '', effects: [] },
      tenet: {
        spellId: '',
        spellName: '',
        header: '',
        description: '',
        effects: [],
      },
      favoredRaces: [],
      worshipRestrictions: [],
    }

    render(<ReligionCard originalReligion={minimalReligion} />)

    expect(screen.getByText('Minimal Religion')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getByText('Blessing')).toBeInTheDocument() // Default blessing name
  })
})
