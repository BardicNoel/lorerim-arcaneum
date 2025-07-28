import { usePerkTrees } from '@/shared/stores'
import { useMemo } from 'react'
import type { PerkReferenceNode, PerkReferenceDataProvider as IPerkReferenceDataProvider } from '../types'

// Implementation of the PerkReferenceDataProvider interface
export class PerkReferenceDataProvider implements IPerkReferenceDataProvider {
  private perkNodes: PerkReferenceNode[] = []

  constructor(perkTrees: any[]) {
    this.perkNodes = this.transformPerkTrees(perkTrees)
  }

  private transformPerkTrees(perkTrees: any[]): PerkReferenceNode[] {
    const transformedNodes: PerkReferenceNode[] = []

    perkTrees.forEach(tree => {
      tree.perks.forEach((perk: any) => {
        const transformedNode: PerkReferenceNode = {
          ...perk,
          skillTree: tree.treeId,
          skillTreeName: tree.treeName,
          isRoot: perk.isRoot || false,
          hasChildren: (perk.connections?.children?.length || 0) > 0,
          prerequisites: perk.connections?.parents || [],
          connections: {
            parents: perk.connections?.parents || [],
            children: perk.connections?.children || [],
          },
          searchableText: this.generateSearchableText(perk, tree),
          tags: this.generateTags(perk, tree),
          category: this.determineCategory(tree.treeName),
        }
        transformedNodes.push(transformedNode)
      })
    })

    return transformedNodes
  }

  private generateSearchableText(perk: any, tree: any): string {
    const texts = [
      perk.name,
      perk.ranks?.map((rank: any) => rank.description?.base).join(' '),
      perk.ranks?.map((rank: any) => rank.description?.subtext).join(' '),
      tree.treeName,
      this.determineCategory(tree.treeName),
    ].filter(Boolean)

    return texts.join(' ').toLowerCase()
  }

  private generateTags(perk: any, tree: any): string[] {
    const tags = [
      tree.treeName,
      this.determineCategory(tree.treeName),
      perk.isRoot ? 'root' : 'branch',
      perk.totalRanks > 1 ? 'multi-rank' : 'single-rank',
    ]

    // Add prerequisite tags
    if (perk.connections?.parents?.length > 0) {
      tags.push('has-prerequisites')
    }

    // Add child tags
    if (perk.connections?.children?.length > 0) {
      tags.push('has-children')
    }

    return tags
  }

  private determineCategory(skillTreeName: string): string {
    const categoryMap: Record<string, string> = {
      'Alchemy': 'Magic',
      'Alteration': 'Magic',
      'Conjuration': 'Magic',
      'Destruction': 'Magic',
      'Illusion': 'Magic',
      'Restoration': 'Magic',
      'Archery': 'Combat',
      'Block': 'Combat',
      'Heavy Armor': 'Combat',
      'One Handed': 'Combat',
      'Smithing': 'Combat',
      'Two Handed': 'Combat',
      'Light Armor': 'Stealth',
      'Lockpicking': 'Stealth',
      'Pickpocket': 'Stealth',
      'Sneak': 'Stealth',
      'Speech': 'Stealth',
      'Enchanting': 'Crafting',
      'Enchanting': 'Crafting',
    }

    return categoryMap[skillTreeName] || 'Other'
  }

  getAllPerks(): PerkReferenceNode[] {
    return this.perkNodes
  }

  getPerksBySkill(skillId: string): PerkReferenceNode[] {
    return this.perkNodes.filter(node => node.skillTree === skillId)
  }

  getPerksByCategory(category: string): PerkReferenceNode[] {
    return this.perkNodes.filter(node => node.category === category)
  }

  getPerksByPrerequisite(prerequisiteId: string): PerkReferenceNode[] {
    return this.perkNodes.filter(node => 
      node.prerequisites.includes(prerequisiteId)
    )
  }

  getRootPerks(): PerkReferenceNode[] {
    return this.perkNodes.filter(node => node.isRoot)
  }

  getMultiRankPerks(): PerkReferenceNode[] {
    return this.perkNodes.filter(node => node.totalRanks > 1)
  }

  searchPerks(query: string): PerkReferenceNode[] {
    const lowerQuery = query.toLowerCase()
    return this.perkNodes.filter(node => 
      node.searchableText.includes(lowerQuery) ||
      node.name.toLowerCase().includes(lowerQuery) ||
      node.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
}

// Hook to use the data provider
export function usePerkReferenceData() {
  const { data: perkTrees, loading, error } = usePerkTrees()

  const dataProvider = useMemo(() => {
    if (!perkTrees) return null
    return new PerkReferenceDataProvider(perkTrees)
  }, [perkTrees])

  const allPerks = useMemo(() => {
    return dataProvider?.getAllPerks() || []
  }, [dataProvider])

  return {
    dataProvider,
    allPerks,
    loading,
    error,
  }
} 