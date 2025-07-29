import type { Birthsign } from '@/features/birthsigns/types'
import type { DestinyNode } from '@/features/destiny/types'
import type { PerkReferenceNode } from '@/features/perk-references/types'
import type { PlayerCreationItem } from '@/shared/components/playerCreation/types'
import type { Race, Religion, Skill, Trait } from '@/shared/data/schemas'
import type {
  SearchableItem,
  SearchCategory,
  SearchHighlight,
  SearchResult,
} from './SearchModel'

export function transformSkillsToSearchable(skills: Skill[]): SearchableItem[] {
  return skills.map(skill => ({
    id: `skill-${skill.id}`,
    type: 'skill' as const,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    tags: skill.tags || [],
    searchableText: [
      skill.name,
      skill.description || '',
      skill.category || '',
      ...(skill.tags || []),
      ...(skill.keyAbilities || []),
      ...(skill.metaTags || []),
      skill.scaling || '',
    ],
    originalData: skill,
    url: `/build/perks?skill=${skill.id}`,
  }))
}

export function transformRacesToSearchable(races: Race[]): SearchableItem[] {
  return races.map(race => ({
    id: `race-${race.id}`,
    type: 'race' as const,
    name: race.name,
    description: race.description,
    category: race.category,
    tags: race.tags || [],
    searchableText: [
      race.name,
      race.description || '',
      race.category || '',
      race.source || '',
      ...(race.tags || []),
      ...(race.keywords || []),
    ],
    originalData: race,
    url: `/races`,
  }))
}

export function transformTraitsToSearchable(traits: Trait[]): SearchableItem[] {
  return traits.map(trait => ({
    id: `trait-${trait.id}`,
    type: 'trait' as const,
    name: trait.name,
    description: trait.description,
    category: trait.category,
    tags: trait.tags || [],
    searchableText: [
      trait.name,
      trait.description || '',
      trait.category || '',
      ...(trait.tags || []),
      ...(trait.effects?.map(effect => effect.description || effect.type) ||
        []),
    ],
    originalData: trait,
    url: `/traits`,
  }))
}

export function transformReligionsToSearchable(
  religions: Religion[]
): SearchableItem[] {
  return religions.map(religion => ({
    id: `religion-${religion.id || religion.name}`,
    type: 'religion' as const,
    name: religion.name,
    description: religion.tenet?.description || '',
    category: religion.type || religion.pantheon || '',
    tags: religion.tags || [],
    searchableText: [
      religion.name,
      religion.tenet?.description || '',
      religion.type || '',
      religion.pantheon || '',
      ...(religion.tags || []),
      ...(religion.favoredRaces || []),
      ...(religion.worshipRestrictions || []),
      ...(religion.tenet?.effects?.map(effect => effect.effectName) || []),
      ...(religion.blessing?.effects?.map(effect => effect.effectName) || []),
      ...(religion.boon1?.effects?.map(effect => effect.effectName) || []),
      ...(religion.boon2?.effects?.map(effect => effect.effectName) || []),
    ],
    originalData: religion,
    url: `/religions`,
  }))
}

export function transformBirthsignsToSearchable(
  birthsigns: Birthsign[]
): SearchableItem[] {
  return birthsigns.map(birthsign => ({
    id: `birthsign-${birthsign.id || birthsign.edid}`,
    type: 'birthsign' as const,
    name: birthsign.name,
    description: birthsign.description,
    category: birthsign.group,
    tags: birthsign.tags || [],
    searchableText: [
      birthsign.name,
      birthsign.description || '',
      birthsign.group || '',
      ...(birthsign.tags || []),
      ...(birthsign.powers?.map(power => power.name || power.description) ||
        []),
      ...(birthsign.stat_modifications?.map(stat => stat.stat) || []),
    ],
    originalData: birthsign,
    url: `/birthsigns`,
  }))
}

export function transformDestinyNodesToSearchable(
  nodes: DestinyNode[]
): SearchableItem[] {
  return nodes.map(node => ({
    id: `destiny-${node.id}`,
    type: 'destiny' as const,
    name: node.name,
    description: node.description,
    category: node.category,
    tags: node.tags || [],
    searchableText: [
      node.name,
      node.description || '',
      node.category || '',
      node.lore || '',
      ...(node.tags || []),
      ...(node.prerequisites || []),
    ],
    originalData: node,
    url: `/destiny`,
  }))
}

export function transformPerkTreesToSearchable(
  perkTrees: any[]
): SearchableItem[] {
  return perkTrees.map(tree => ({
    id: `perk-${tree.treeId || tree.id}`,
    type: 'perk' as const,
    name: tree.treeName || tree.name,
    description: tree.treeDescription || tree.description,
    category: tree.category,
    tags: tree.tags || [],
    searchableText: [
      tree.treeName || tree.name,
      tree.treeDescription || tree.description || '',
      tree.category || '',
      ...(tree.tags || []),
      ...(tree.perks?.map((perk: any) => perk.name) || []),
    ],
    originalData: tree,
    url: `/build/perks`,
  }))
}

export function transformPerkReferencesToSearchable(
  perkReferences: PerkReferenceNode[]
): SearchableItem[] {
  return perkReferences.map(perk => ({
    id: `perk-ref-${perk.edid}`,
    type: 'perk-reference' as const,
    name: perk.name,
    description: perk.ranks[0]?.description?.base || '',
    category: perk.category,
    tags: perk.tags,
    searchableText: [
      perk.name,
      perk.ranks[0]?.description?.base || '',
      perk.ranks[0]?.description?.subtext || '',
      perk.skillTreeName,
      perk.category,
      ...perk.tags,
      ...perk.prerequisites,
      perk.isRoot ? 'root perk' : 'branch perk',
      perk.totalRanks > 1 ? 'multi-rank' : 'single-rank',
    ],
    originalData: perk,
    url: `/perk-references?skill=${perk.skillTree}&perk=${perk.edid}`,
  }))
}

export function searchResultToPlayerCreationItem(
  result: SearchResult
): PlayerCreationItem {
  return {
    id: result.item.id,
    name: result.item.name,
    description: result.item.description || '',
    summary: result.item.description || '',
    tags: result.item.tags,
    category: result.item.category,
    imageUrl: undefined,
    effects: [],
    associatedItems: [],
    // Store the original search result for type-specific rendering
    originalSearchResult: result,
  } as PlayerCreationItem & { originalSearchResult: SearchResult }
}

export function createSearchCategories(
  results: SearchResult[]
): SearchCategory[] {
  const typeCounts = new Map<string, number>()
  const categoryCounts = new Map<string, number>()
  const tagCounts = new Map<string, number>()

  // Count occurrences
  results.forEach(result => {
    // Count types
    const typeCount = typeCounts.get(result.item.type) || 0
    typeCounts.set(result.item.type, typeCount + 1)

    // Count categories
    if (result.item.category) {
      const categoryCount = categoryCounts.get(result.item.category) || 0
      categoryCounts.set(result.item.category, categoryCount + 1)
    }

    // Count tags
    result.item.tags.forEach(tag => {
      const tagCount = tagCounts.get(tag) || 0
      tagCounts.set(tag, tagCount + 1)
    })
  })

  return [
    {
      id: 'types',
      name: 'Types',
      placeholder: 'Filter by type...',
      options: Array.from(typeCounts.entries()).map(([type, count]) => ({
        id: `type-${type}`,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        value: type,
        category: 'Types',
        description: `${count} ${type}${count !== 1 ? 's' : ''}`,
      })),
    },
    {
      id: 'categories',
      name: 'Categories',
      placeholder: 'Filter by category...',
      options: Array.from(categoryCounts.entries()).map(
        ([category, count]) => ({
          id: `category-${category}`,
          label: category,
          value: category,
          category: 'Categories',
          description: `${count} item${count !== 1 ? 's' : ''}`,
        })
      ),
    },
    {
      id: 'tags',
      name: 'Tags',
      placeholder: 'Filter by tag...',
      options: Array.from(tagCounts.entries()).map(([tag, count]) => ({
        id: `tag-${tag}`,
        label: tag,
        value: tag,
        category: 'Tags',
        description: `${count} item${count !== 1 ? 's' : ''}`,
      })),
    },
  ]
}

export function createSearchHighlights(
  matches: Fuse.FuseResultMatch[]
): SearchHighlight[] {
  return matches.map(match => ({
    field: match.key || 'unknown',
    snippet: match.value,
    startIndex: match.indices[0]?.[0] || 0,
    endIndex: match.indices[0]?.[1] || 0,
  }))
}
