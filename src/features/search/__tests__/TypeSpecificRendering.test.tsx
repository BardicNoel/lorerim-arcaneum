import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TypeSpecificSearchResults } from '../components/composition/TypeSpecificSearchResults'
import type { SearchResult } from '../model/SearchModel'

// Mock search results for testing
const mockRaceResult: SearchResult = {
  item: {
    id: 'race-1',
    type: 'race',
    name: 'Altmer',
    description: 'High Elves of Summerset Isle',
    category: 'Elves',
    tags: ['elf', 'magic', 'intelligence'],
    searchableText: ['Altmer', 'High Elves', 'Summerset Isle'],
    originalData: {
      id: 'race-1',
      name: 'Altmer',
      description: 'High Elves of Summerset Isle',
      // Add other race-specific fields as needed
    },
    url: '/races/altmer',
  },
  score: 0.9,
  matches: [],
  highlights: [
    {
      field: 'name',
      snippet: 'Altmer',
      startIndex: 0,
      endIndex: 6,
    },
  ],
}

const mockBirthsignResult: SearchResult = {
  item: {
    id: 'birthsign-1',
    type: 'birthsign',
    name: 'The Apprentice',
    description: 'Increases Magicka but weakens Magic Resistance',
    category: 'Magic',
    tags: ['magic', 'magicka', 'resistance'],
    searchableText: ['The Apprentice', 'Magicka', 'Magic Resistance'],
    originalData: {
      id: 'birthsign-1',
      name: 'The Apprentice',
      description: 'Increases Magicka but weakens Magic Resistance',
      // Add other birthsign-specific fields as needed
    },
    url: '/birthsigns/apprentice',
  },
  score: 0.8,
  matches: [],
  highlights: [
    {
      field: 'name',
      snippet: 'The Apprentice',
      startIndex: 0,
      endIndex: 13,
    },
  ],
}

describe('TypeSpecificSearchResults', () => {
  it('renders race results with type-specific components', () => {
    render(
      <TypeSpecificSearchResults
        results={[mockRaceResult]}
        selectedResult={null}
        onResultSelect={() => {}}
        viewMode="card"
        renderMode="unified"
      />
    )

    // Should render the race name
    expect(screen.getByText('Altmer')).toBeInTheDocument()
  })

  it('renders birthsign results with type-specific components', () => {
    render(
      <TypeSpecificSearchResults
        results={[mockBirthsignResult]}
        selectedResult={null}
        onResultSelect={() => {}}
        viewMode="card"
        renderMode="unified"
      />
    )

    // Should render the birthsign name
    expect(screen.getByText('The Apprentice')).toBeInTheDocument()
  })

  it('renders mixed results grouped by type', () => {
    render(
      <TypeSpecificSearchResults
        results={[mockRaceResult, mockBirthsignResult]}
        selectedResult={null}
        onResultSelect={() => {}}
        viewMode="card"
        renderMode="grouped"
      />
    )

    // Should render both race and birthsign names
    expect(screen.getByText('Altmer')).toBeInTheDocument()
    expect(screen.getByText('The Apprentice')).toBeInTheDocument()
  })

  it('handles empty results', () => {
    render(
      <TypeSpecificSearchResults
        results={[]}
        selectedResult={null}
        onResultSelect={() => {}}
        viewMode="card"
        renderMode="unified"
      />
    )

    // Should show no results message
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('handles result selection', () => {
    const onResultSelect = vi.fn()

    render(
      <TypeSpecificSearchResults
        results={[mockRaceResult]}
        selectedResult={null}
        onResultSelect={onResultSelect}
        viewMode="card"
        renderMode="unified"
      />
    )

    // Click on the result
    screen.getByText('Altmer').click()

    // Should call onResultSelect with the result
    expect(onResultSelect).toHaveBeenCalledWith(mockRaceResult)
  })
})
