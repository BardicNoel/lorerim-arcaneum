import { useWishlistStore } from './store'
import type { WishlistItem } from './store'

export const useWishlist = () => {
  const store = useWishlistStore()
  
  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    clearAll: store.clearAll,
    hasItem: store.hasItem,
    getItemCount: store.getItemCount
  }
}

export const useWishlistItem = (id: string) => {
  const { hasItem, addItem, removeItem } = useWishlistStore()
  
  return {
    isInWishlist: hasItem(id),
    toggleItem: (item: WishlistItem) => {
      if (hasItem(id)) {
        removeItem(id)
      } else {
        addItem(item)
      }
    }
  }
}

export const useWishlistStats = () => {
  const { items } = useWishlistStore()
  
  const stats = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return {
    totalItems: items.length,
    byType: {
      perks: stats.perk || 0,
      races: stats.race || 0,
      traits: stats.trait || 0
    },
    byCategory: stats
  }
} 