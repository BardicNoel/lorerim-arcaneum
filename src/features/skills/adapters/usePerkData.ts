import { calculateAllSkillLevels } from '@/features/skills/utils/skillLevels'
import { useCharacterBuild } from '@/shared/hooks/useCharacterBuild'
import { usePerkTrees } from '@/shared/stores'
import { useMemo } from 'react'

// Adapter for perk data loading and management
export function usePerkData(skillId: string | null) {
  // Use the data cache hook for perk trees
  const { data: perkTrees, loading, error } = usePerkTrees()

  const {
    getSkillPerks,
    getPerkRank,
    addPerk,
    removePerk,
    setPerkRank,
    clearSkillPerks,
    build,
    updateBuild,
  } = useCharacterBuild()

  // Get perk tree for the selected skill
  const selectedPerkTree = useMemo(() => {
    if (!skillId || !perkTrees) return null
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
    console.log('🔧 usePerkData handlePerkRankChange called:', {
      perkId,
      newRank,
      skillId,
    })

    if (!skillId) {
      console.log('❌ No skillId, returning early')
      return
    }

    // Use the same logic as usePerkNodeCycle for proper rank cycling
    const currentRank = getPerkRank(perkId) || 0
    console.log('📊 Current rank:', currentRank, 'Target rank:', newRank)
    console.log('📋 Selected perks:', selectedPerks)
    console.log('🎯 Perk in selected perks:', selectedPerks.includes(perkId))

    if (newRank === 0) {
      console.log('🔄 Going to rank 0, removing perk')
      // Going to rank 0, remove perk and set rank to 0
      if (selectedPerks.includes(perkId)) {
        console.log('🗑️ Removing perk from selected perks')
        removePerk(skillId, perkId)
      } else {
        console.log(
          '⚠️ Perk not in selected perks, but trying to set rank to 0'
        )
      }
      console.log('📉 Setting rank to 0')
      setPerkRank(perkId, 0)
    } else {
      // For any rank > 0, ensure the perk is in selected perks and set rank in one operation
      const currentPerks = build?.perks?.selected ?? {}
      const currentRanks = build?.perks?.ranks ?? {}
      const skillPerks = currentPerks[skillId] ?? []

      let newSelectedPerks = { ...currentPerks }
      let newRanks = { ...currentRanks }

      // Add perk to selected perks if not already there
      if (!selectedPerks.includes(perkId)) {
        console.log('➕ Adding perk to selected perks (was missing)')
        newSelectedPerks[skillId] = [...skillPerks, perkId]
      }

      // Set the rank
      console.log('🔄 Setting rank to:', newRank)
      newRanks[perkId] = newRank

      // Update both selection and rank in one operation
      const newPerks = {
        ...build?.perks,
        selected: newSelectedPerks,
        ranks: newRanks,
      }

      // Calculate new skill levels based on updated perks
      const newSkillLevels = calculateAllSkillLevels(newPerks)

      updateBuild({
        perks: newPerks,
        skillLevels: newSkillLevels,
      })
      console.log('🔄 Build updated with perk selection and rank')
    }
  }

  const handleResetPerks = () => {
    if (skillId) {
      clearSkillPerks(skillId)
    }
  }

  return {
    // Data
    perkTrees: perkTrees || [],
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
