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

  const foundItem = items.find(item => {
    const idMatch = !!item.id && item.id === searchItem.id
    const edidMatch = !!item.edid && item.edid === searchItem.edid
    const nameMatch = !!item.name && item.name === searchItem.name
    return idMatch || edidMatch || nameMatch
  })
  return foundItem
}
