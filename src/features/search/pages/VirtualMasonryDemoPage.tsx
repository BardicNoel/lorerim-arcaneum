import React from 'react'
import { TestCard } from '../components/atomic/TestCard'
import { VirtualMasonryGrid } from '../components/composition/VirtualMasonryGrid'
import { generateDummyItems } from '../utils/dummyDataGenerator'

export function VirtualMasonryDemoPage() {
  const [items, setItems] = React.useState(() => generateDummyItems(50))
  const [loading, setLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)

  const loadMore = React.useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newItems = generateDummyItems(20)
    setItems(prev => [...prev, ...newItems])

    // Stop loading more after 200 items for demo
    if (items.length + newItems.length >= 200) {
      setHasMore(false)
    }

    setLoading(false)
  }, [loading, hasMore, items.length])

  const keyExtractor = (item: any) => item.id

  const renderItem = (item: any) => <TestCard item={item} />

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">VirtualMasonryGrid Demo</h1>
        <p className="text-muted-foreground">
          Testing InfiniteGrid implementation with {items.length} items
        </p>
        {loading && (
          <div className="mt-2 text-sm text-blue-600">
            Loading more items...
          </div>
        )}
        {!hasMore && (
          <div className="mt-2 text-sm text-green-600">
            All items loaded (200 total)
          </div>
        )}
      </div>

      <VirtualMasonryGrid
        items={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        loadMore={loadMore}
        hasMore={hasMore}
        columns={3}
        gap={16}
        className="min-h-screen"
      />
    </div>
  )
}
