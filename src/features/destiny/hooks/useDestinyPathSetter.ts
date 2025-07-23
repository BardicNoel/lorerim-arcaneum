import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import type { DestinyNode } from '../types'

// Returns a function to set the destiny path to a node and all its ancestors
export function useDestinyPathSetter() {
  const { setDestinyPath } = useCharacterBuild()
  return (path: DestinyNode[], clickedIndex: number) => {
    const newPath = path.slice(0, clickedIndex + 1).map(n => n.id)
    setDestinyPath(newPath)
  }
} 