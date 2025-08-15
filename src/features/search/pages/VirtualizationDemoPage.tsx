import React, { useState, useCallback } from 'react'
import { VirtualMasonryGrid, LegacyVirtualMasonryGrid, VirtualizedMasonryGrid } from '../components/composition'
import { TestCard } from '../components/atomic/TestCard'
import { generateDummyItems } from '../utils/dummyDataGenerator'
import { Button } from '@/shared/ui/ui/button'
import { Switch } from '@/shared/ui/ui/switch'
import { Label } from '@/shared/ui/ui/label'

export function VirtualizationDemoPage() {
  const [items, setItems] = useState(() => generateDummyItems(100))
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [showMetrics, setShowMetrics] = useState(true)
  const [useVirtualization, setUseVirtualization] = useState(true)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newItems = generateDummyItems(50)
    setItems(prev => [...prev, ...newItems])

    // Stop loading more after 1000 items for demo
    if (items.length + newItems.length >= 1000) {
      setHasMore(false)
    }

    setLoading(false)
  }, [loading, hasMore, items.length])

  const keyExtractor = (item: any) => item.id

  const renderItem = (item: any) => <TestCard item={item} />

  const resetItems = useCallback(() => {
    setItems(generateDummyItems(100))
    setHasMore(true)
  }, [])

  const addMoreItems = useCallback(() => {
    const newItems = generateDummyItems(100)
    setItems(prev => [...prev, ...newItems])
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Virtualization Demo</h1>
        <p className="text-muted-foreground mb-4">
          Testing the new virtualization system with {items.length} items
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="virtualization"
              checked={useVirtualization}
              onCheckedChange={setUseVirtualization}
            />
            <Label htmlFor="virtualization">Use Virtualization</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="metrics"
              checked={showMetrics}
              onCheckedChange={setShowMetrics}
            />
            <Label htmlFor="metrics">Show Performance Metrics</Label>
          </div>

          <Button onClick={resetItems} variant="outline">
            Reset Items
          </Button>

          <Button onClick={addMoreItems} variant="outline">
            Add 100 Items
          </Button>
        </div>

        {/* Status */}
        <div className="flex gap-4 text-sm">
          {loading && (
            <div className="text-blue-600">
              Loading more items...
            </div>
          )}
          {!hasMore && (
            <div className="text-green-600">
              All items loaded (1000 total)
            </div>
          )}
          <div className="text-gray-600">
            Current items: {items.length}
          </div>
        </div>
      </div>

      {/* Virtualization Info */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
        <h3 className="font-semibold mb-2">
          {useVirtualization ? 'Virtualization Active' : 'Legacy Mode Active'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {useVirtualization 
            ? 'Only visible items are rendered in the DOM, significantly improving performance for large datasets. Scroll to see the virtualization in action!'
            : 'All items are rendered in the DOM. Switch to virtualization for better performance with large datasets.'
          }
        </p>
      </div>

      {/* Grid */}
      <div className="min-h-screen">
        {useVirtualization ? (
          <VirtualizedMasonryGrid
            items={items}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            loadMore={loadMore}
            hasMore={hasMore}
            columns={3}
            gap={16}
            maxColumnWidth={400}
            className="min-h-screen"
            showPerformanceMetrics={showMetrics}
            overscan={5}
            estimatedItemHeight={200}
          />
        ) : (
          <LegacyVirtualMasonryGrid
            items={items}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            loadMore={loadMore}
            hasMore={hasMore}
            columns={3}
            gap={16}
            maxColumnWidth={400}
            className="min-h-screen"
          />
        )}
      </div>
    </div>
  )
}
