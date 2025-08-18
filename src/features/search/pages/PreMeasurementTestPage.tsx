import React, { useState, useCallback } from 'react'
import { VirtualMasonryGrid } from '../components/composition/virtualization/components/VirtualMasonryGrid'

export function PreMeasurementTestPage() {
  const [items, setItems] = useState(() => generateDummyItems(50))
  const [renderCount, setRenderCount] = useState(0)

  // Increment render count to track re-renders - FIXED: Added dependency array
  React.useEffect(() => {
    setRenderCount(prev => prev + 1)
  }, []) // ✅ Added empty dependency array to prevent infinite loop

  const keyExtractor = useCallback((item: any) => item.id, [])
  const renderItem = useCallback((item: any) => (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-semibold mb-2">{item.title}</h3>
      <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
      <div className="space-y-2">
        {item.tags.map((tag: string, index: number) => (
          <span key={index} className="inline-block bg-muted px-2 py-1 rounded text-xs mr-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  ), [])

  const loadMore = useCallback(() => {
    const newItems = generateDummyItems(10)
    setItems(prev => [...prev, ...newItems])
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pre-measurement Test (Fixed)</h1>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h3 className="font-semibold mb-2">Test Information</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Render count: {renderCount} (should not increase rapidly)
        </p>
        <p className="text-sm text-muted-foreground">
          Items: {items.length} | First 20 items will be pre-measured
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
          ✅ Fixed: Infinite loop resolved with dependency array
        </p>
      </div>

      <VirtualMasonryGrid
        items={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        loadMore={loadMore}
        hasMore={true}
        columns={3}
        gap={16}
        maxColumnWidth={400}
        className="min-h-screen"
        showPerformanceMetrics={true}
        overscan={5}
        estimatedItemHeight={200}
        preMeasurement={{
          enabled: true,
          maxItemsToMeasure: 20,
          showLoadingScreen: true,
          showProgress: true
        }}
      />
    </div>
  )
}

function generateDummyItems(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${Date.now()}-${i}`,
    title: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}. It has variable length content that will affect the height of each item.`,
    tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1)
  }))
}
