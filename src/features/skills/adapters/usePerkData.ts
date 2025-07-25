import type { PerkTree } from '@/features/perks/types'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { useEffect, useMemo, useState } from 'react'
import { getDataUrl } from '@/shared/utils/baseUrl'

// Adapter for perk data loading and management
export function usePerkData(skillId: string | null) {
  const [perkTrees, setPerkTrees] = useState<PerkTree[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    getSkillPerks,
    getPerkRank,
    addPerk,
    removePerk,
    setPerkRank,
    clearSkillPerks,
  } = useCharacterBuild()

  // Load perk trees data
  useEffect(() => {
    const loadPerkTrees = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(
          getDataUrl('data/perk-trees.json')
        )
        if (!res.ok) throw new Error('Failed to fetch perk trees data')
        const data = await res.json()
        // The data is an array directly, not wrapped in perkTrees property
        setPerkTrees(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load perk trees'
        )
      } finally {
        setLoading(false)
      }
    }

    loadPerkTrees()
  }, [])

  // Get perk tree for the selected skill
  const selectedPerkTree = useMemo(() => {
    if (!skillId) return null
    const found = perkTrees.find(tree => tree.treeId === skillId) || null
    return found
  }, [skillId, perkTrees])

  // Get selected perks for the current skill
  const selectedPerks = useMemo(() => {
    if (!skillId) return []
    return getSkillPerks(skillId)
  }, [skillId, getSkillPerks])

  // Get perk ranks for the current skill
  const perkRanks = useMemo(() => {
    if (!skillId || !selectedPerkTree) return {}

    const ranks: Record<string, number> = {}
    selectedPerkTree.perks.forEach(perk => {
      ranks[perk.edid] = getPerkRank(perk.edid)
    })
    return ranks
  }, [skillId, selectedPerkTree, getPerkRank])

  // Calculate available perks (perks that can be selected)
  const availablePerks = useMemo(() => {
    if (!selectedPerkTree) return []

    const available: string[] = []

    selectedPerkTree.perks.forEach(perk => {
      // Root perks are always available
      if (perk.isRoot) {
        available.push(perk.edid)
        return
      }

      // Check if parent perks are selected (prerequisites)
      const parentPerks = perk.connections.parents || []
      const prerequisitesMet = parentPerks.every(parentId =>
        selectedPerks.includes(parentId)
      )

      if (prerequisitesMet) {
        available.push(perk.edid)
      }
    })

    return available
  }, [selectedPerkTree, selectedPerks])

  // Perk management functions
  const handlePerkSelect = (perkId: string) => {
    if (!skillId) return

    const isSelected = selectedPerks.includes(perkId)
    if (isSelected) {
      removePerk(skillId, perkId)
    } else {
      addPerk(skillId, perkId)
    }
  }

  const handlePerkRankChange = (perkId: string, newRank: number) => {
    setPerkRank(perkId, newRank)
    
    // For multi-rank perks, also handle selection state
    if (newRank === 0) {
      // Rank is 0, remove from selected perks if it's there
      if (selectedPerks.includes(perkId)) {
        removePerk(skillId, perkId)
      }
    } else {
      // Rank is > 0, add to selected perks if it's not there
      if (!selectedPerks.includes(perkId)) {
        addPerk(skillId, perkId)
      }
    }
  }

  const handleResetPerks = () => {
    if (skillId) {
      clearSkillPerks(skillId)
    }
  }

  return {
    // Data
    perkTrees,
    selectedPerkTree,
    selectedPerks,
    perkRanks,
    availablePerks,

    // State
    loading,
    error,

    // Actions
    handlePerkSelect,
    handlePerkRankChange,
    handleResetPerks,
  }
}
