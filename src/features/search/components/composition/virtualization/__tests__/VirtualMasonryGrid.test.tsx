import { render, screen } from '@testing-library/react'
import { VirtualMasonryGrid } from '../components/VirtualMasonryGrid'

// Mock the virtualization hooks
jest.mock('../hooks/useMasonryVirtualizer', () => ({
  useMasonryVirtualizer: () => ({
    containerRef: { current: null },
    state: {
      visibleRange: { start: 0, end: 10 },
      scrollTop: 0,
      containerHeight: 800,
      itemPositions: new Map()
    },
    metrics: {
      totalItems: 100,
      visibleItems: 10,
      memoryUsage: 10240,
      renderTime: 5,
      scrollFPS: 60
    },
    handleScroll: jest.fn(),
    measureItemHeight: jest.fn(),
    getVisibleItems: () => [
      { item: { id: '1', name: 'Test Item 1' }, position: { top: 0, height: 200, column: 0, index: 0 }, key: '1' },
      { item: { id: '2', name: 'Test Item 2' }, position: { top: 0, height: 200, column: 1, index: 1 }, key: '2' }
    ],
    getTotalHeight: () => 2000,
    getPerformanceStats: () => ({})
  })
}))

describe('VirtualMasonryGrid', () => {
  const mockItems = [
    { id: '1', name: 'Test Item 1' },
    { id: '2', name: 'Test Item 2' }
  ]

  const mockKeyExtractor = (item: any) => item.id
  const mockRenderItem = (item: any) => <div>{item.name}</div>

  it('should render without crashing', () => {
    render(
      <VirtualMasonryGrid
        items={mockItems}
        keyExtractor={mockKeyExtractor}
        renderItem={mockRenderItem}
      />
    )

    expect(screen.getByText('Test Item 1')).toBeInTheDocument()
    expect(screen.getByText('Test Item 2')).toBeInTheDocument()
  })

  it('should show empty state when no items', () => {
    render(
      <VirtualMasonryGrid
        items={[]}
        keyExtractor={mockKeyExtractor}
        renderItem={mockRenderItem}
      />
    )

    expect(screen.getByText('No items to display')).toBeInTheDocument()
  })

  it('should render performance metrics when enabled', () => {
    render(
      <VirtualMasonryGrid
        items={mockItems}
        keyExtractor={mockKeyExtractor}
        renderItem={mockRenderItem}
        showPerformanceMetrics={true}
      />
    )

    expect(screen.getByText('Total Items: 100')).toBeInTheDocument()
    expect(screen.getByText('Visible Items: 10')).toBeInTheDocument()
  })
})

