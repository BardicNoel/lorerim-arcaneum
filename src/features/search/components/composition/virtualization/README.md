# Virtualization System

A high-performance virtualization system for masonry layouts using `@tanstack/react-virtual` and custom masonry layout algorithms.

## 🎯 Overview

This virtualization system provides:

- **True Virtualization**: Only renders visible items + overscan
- **Masonry Layout**: Multi-column layout with dynamic height support
- **Performance Monitoring**: Real-time metrics and performance tracking
- **Responsive Design**: Dynamic column calculation based on container width
- **Infinite Scroll**: Seamless loading of additional items
- **Height Measurement**: Dynamic height tracking with ResizeObserver

## ⚠️ Current Status

**The virtualization system is implemented but currently disabled by default due to stability issues.** 

- **Default VirtualMasonryGrid**: Uses the legacy (non-virtualized) version for stability
- **VirtualizedMasonryGrid**: Available for testing and advanced users
- **LegacyVirtualMasonryGrid**: Explicitly available for backward compatibility

## 🏗 Architecture

### Core Components

1. **MasonryVirtualizer**: Main virtualization engine
2. **HeightMeasurer**: Dynamic height measurement system
3. **PositionCache**: Item position tracking and caching
4. **PerformanceMonitor**: Performance metrics and optimization

### React Hooks

1. **useMasonryVirtualizer**: Main virtualization hook
2. **useHeightMeasurement**: Height measurement hook

### Components

1. **VirtualMasonryGrid**: Main virtualized grid component (currently uses legacy version)
2. **VirtualizedMasonryGrid**: True virtualized version (for testing)
3. **LegacyVirtualMasonryGrid**: Non-virtualized version (stable)
4. **VirtualItem**: Individual virtualized item component

## 📦 Installation

The virtualization system is already included in the project. It uses:

```bash
npm install @tanstack/react-virtual
```

## 🚀 Usage

### Basic Usage (Stable - Uses Legacy Version)

```tsx
import { VirtualMasonryGrid } from '@/features/search/components/composition'

function MyComponent() {
  const items = [/* your items */]
  
  return (
    <VirtualMasonryGrid
      items={items}
      keyExtractor={(item) => item.id}
      renderItem={(item) => <MyCard item={item} />}
      columns={3}
      gap={16}
    />
  )
}
```

### Advanced Usage with True Virtualization (Experimental)

```tsx
import { VirtualizedMasonryGrid } from '@/features/search/components/composition'

function MyComponent() {
  const items = [/* your items */]
  
  return (
    <VirtualizedMasonryGrid
      items={items}
      keyExtractor={(item) => item.id}
      renderItem={(item) => <MyCard item={item} />}
      columns={3}
      gap={16}
      overscan={5}
      estimatedItemHeight={200}
      showPerformanceMetrics={true}
      loadMore={loadMoreItems}
      hasMore={true}
    />
  )
}
```

### Using the Hook Directly

```tsx
import { useMasonryVirtualizer } from '@/features/search/components/composition/virtualization'

function MyCustomComponent() {
  const {
    containerRef,
    state,
    metrics,
    handleScroll,
    measureItemHeight,
    getVisibleItems,
    getTotalHeight,
  } = useMasonryVirtualizer(items, keyExtractor, {
    columns: 3,
    gap: 16,
    overscan: 5,
    estimatedItemHeight: 200,
  })

  return (
    <div ref={containerRef} onScroll={handleScroll}>
      <div style={{ height: getTotalHeight() }}>
        {getVisibleItems().map(({ item, position, key }) => (
          <div
            key={key}
            style={{
              position: 'absolute',
              top: position.top,
              left: `${(position.column * 100) / 3}%`,
              width: 'calc(33.33% - 8px)',
            }}
          >
            <MyCard item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## ⚙️ Configuration

### VirtualMasonryGrid Props (Legacy Version)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | - | Array of items to render |
| `keyExtractor` | `(item: T) => string` | - | Function to extract unique keys |
| `renderItem` | `(item: T) => React.ReactNode` | - | Function to render each item |
| `columns` | `number` | `3` | Number of columns |
| `gap` | `number` | `12` | Gap between items in pixels |
| `maxColumnWidth` | `number` | - | Maximum column width for responsive design |
| `loadMore` | `() => void` | - | Function to load more items |
| `hasMore` | `boolean` | `true` | Whether more items are available |
| `className` | `string` | `''` | Additional CSS classes |

### VirtualizedMasonryGrid Props (Experimental)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `T[]` | - | Array of items to render |
| `keyExtractor` | `(item: T) => string` | - | Function to extract unique keys |
| `renderItem` | `(item: T) => React.ReactNode` | - | Function to render each item |
| `columns` | `number` | `3` | Number of columns |
| `gap` | `number` | `12` | Gap between items in pixels |
| `maxColumnWidth` | `number` | - | Maximum column width for responsive design |
| `overscan` | `number` | `5` | Number of items to render outside viewport |
| `estimatedItemHeight` | `number` | `200` | Estimated height for initial layout |
| `showPerformanceMetrics` | `boolean` | `false` | Show performance metrics overlay |
| `loadMore` | `() => void` | - | Function to load more items |
| `hasMore` | `boolean` | `true` | Whether more items are available |
| `className` | `string` | `''` | Additional CSS classes |

## 📊 Performance Metrics

The system provides real-time performance metrics:

- **Total Items**: Total number of items in the dataset
- **Visible Items**: Number of items currently rendered
- **Memory Usage**: Estimated memory usage in bytes
- **Render Time**: Time taken for last render in milliseconds
- **Scroll FPS**: Current scroll frame rate

### Performance Targets

- **Memory Usage**: < 50MB for 1000+ items
- **Initial Render**: < 100ms for 1000 items
- **Scroll Performance**: 60fps smooth scrolling
- **Resize Handling**: < 50ms layout recalculation

## 🔧 Customization

### Custom Height Measurement

```tsx
import { useHeightMeasurement } from '@/features/search/components/composition/virtualization'

function MyCustomItem({ item }) {
  const { elementRef, height } = useHeightMeasurement(
    item,
    item.id,
    (height) => {
      console.log(`Item ${item.id} height: ${height}`)
    }
  )

  return (
    <div ref={elementRef}>
      <MyCard item={item} />
    </div>
  )
}
```

### Custom Layout Engine

You can extend the system by creating custom layout engines:

```tsx
import { MasonryVirtualizer } from '@/features/search/components/composition/virtualization'

class CustomVirtualizer extends MasonryVirtualizer {
  // Override methods for custom behavior
  protected calculatePositions() {
    // Custom position calculation
  }
}
```

## 🧪 Testing

Run the tests:

```bash
npm test -- --testPathPattern=virtualization
```

### Test Coverage

- Component rendering
- Hook functionality
- Performance metrics
- Height measurement
- Position calculation

## 🐛 Troubleshooting

### Common Issues

1. **Items not rendering**: Check that `keyExtractor` returns unique keys
2. **Poor performance**: Reduce `overscan` or increase `estimatedItemHeight`
3. **Layout issues**: Ensure container has proper dimensions
4. **Memory leaks**: Components are automatically cleaned up, but check for external observers

### Debug Mode

Enable performance metrics to debug issues:

```tsx
<VirtualizedMasonryGrid
  showPerformanceMetrics={true}
  // ... other props
/>
```

## 📚 API Reference

### Hooks

#### useMasonryVirtualizer

```typescript
function useMasonryVirtualizer<T>(
  items: T[],
  keyExtractor: (item: T) => string,
  config?: Partial<MasonryVirtualizerConfig>
): {
  containerRef: RefObject<HTMLDivElement>
  state: VirtualizationState
  metrics: VirtualizationMetrics
  handleScroll: (event: UIEvent<HTMLDivElement>) => void
  measureItemHeight: (element: HTMLElement, item: T) => Promise<void>
  scrollToItem: (index: number) => void
  updateConfig: (config: Partial<MasonryVirtualizerConfig>) => void
  getVisibleItems: () => Array<{ item: T; position: ItemPosition; key: string }>
  getTotalHeight: () => number
  getColumnLayouts: () => ColumnLayout[]
  getPerformanceStats: () => any
}
```

#### useHeightMeasurement

```typescript
function useHeightMeasurement<T>(
  item: T,
  key: string,
  onHeightChange?: (height: number, item: T) => void
): {
  elementRef: RefObject<HTMLElement>
  height: number
}
```

### Types

```typescript
interface ItemPosition {
  top: number
  height: number
  column: number
  index: number
}

interface VirtualizationState {
  visibleRange: { start: number; end: number }
  scrollTop: number
  containerHeight: number
  itemPositions: Map<string, ItemPosition>
}

interface VirtualizationMetrics {
  totalItems: number
  visibleItems: number
  memoryUsage: number
  renderTime: number
  scrollFPS: number
}
```

## 🔄 Migration from Old VirtualMasonryGrid

The new virtualization system is backward compatible. Simply replace the import:

```tsx
// Old
import { VirtualMasonryGrid } from './VirtualMasonryGrid'

// New
import { VirtualMasonryGrid } from '@/features/search/components/composition'
```

All existing props are supported, with additional performance and configuration options available.

## 🎯 Future Enhancements

- [ ] Fix virtualization stability issues
- [ ] Virtual scrolling for horizontal layouts
- [ ] Advanced caching strategies
- [ ] GPU acceleration for large datasets
- [ ] Accessibility improvements
- [ ] Touch gesture support
- [ ] Custom animation frameworks

## 🚨 Known Issues

1. **Virtualization Stability**: The virtualized version may cause items to blink or disappear
2. **Height Calculation**: Dynamic height measurement can be unstable
3. **Performance**: May not provide expected performance improvements in all cases

**Recommendation**: Use the default `VirtualMasonryGrid` (legacy version) for production applications until virtualization issues are resolved.
