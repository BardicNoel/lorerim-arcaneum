/**
 * Utility function to find an item in a store using multiple matching strategies
 * This handles cases where the original data might have different ID fields
 * than the processed store data
 */
export function findItemInStore<
  T extends { id?: string; edid?: string; name: string },
>(
  items: T[] | undefined,
  searchItem: { id?: string; edid?: string; name: string }
): T | undefined {
  if (!items) return undefined

  return items.find(
    item =>
      item.id === searchItem.id ||
      item.edid === searchItem.edid ||
      item.name === searchItem.name
  )
}
