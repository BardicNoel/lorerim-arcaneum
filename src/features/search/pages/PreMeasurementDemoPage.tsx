import React, { useState, useCallback } from 'react'
import { VirtualMasonryGrid } from '../components/composition/virtualization/components/VirtualMasonryGrid'

export function PreMeasurementDemoPage() {
  const [items, setItems] = useState(() => generateDummyItems(100))
  const [showMetrics, setShowMetrics] = useState(false)

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
    const newItems = generateDummyItems(20)
    setItems(prev => [...prev, ...newItems])
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pre-measurement Demo</h1>
      
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h3 className="font-semibold mb-2">Pre-measurement Active</h3>
        <p className="text-sm text-muted-foreground">
          The first 20 items are measured offscreen before rendering. This eliminates layout jumps and provides stable positioning.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showMetrics}
            onChange={(e) => setShowMetrics(e.target.checked)}
          />
          Show Performance Metrics
        </label>
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
        showPerformanceMetrics={showMetrics}
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
    id: `item-${i}`,
    title: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}. It has variable length content that will affect the height of each item.`,
    tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1)
  }))
}
