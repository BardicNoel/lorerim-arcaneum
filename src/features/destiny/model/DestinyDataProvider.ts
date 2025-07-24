import type { DestinyNode } from '../types'

// Raw data structure from JSON
interface RawDestinyNode {
  globalFormId?: string
  edid: string // <-- Add edid from JSON
  name: string
  description: string
  prerequisites?: string[] // These are EDIDs now
}

export class DestinyDataProvider {
  private nodes: DestinyNode[] = []
  private loading = false
  private error: string | null = null
  private loaded = false

  /**
   * Load destiny nodes from the JSON file
   */
  async loadNodes(): Promise<DestinyNode[]> {
    if (this.loaded && this.nodes.length > 0) {
      return this.nodes
    }

    try {
      this.loading = true
      this.error = null

      const res = await fetch(`${import.meta.env.BASE_URL}data/subclasses.json`)
      if (!res.ok) throw new Error('Failed to fetch destiny data')

      const rawData: RawDestinyNode[] = await res.json()

      // Transform the data to match our DestinyNode interface
      const transformedNodes: DestinyNode[] = rawData.map(
        (node: RawDestinyNode, index: number) => ({
          id: node.globalFormId || node.edid || `destiny-${index}`,
          edid: node.edid, // <-- Set edid
          name: node.name,
          description: node.description,
          tags: [], // Will be enriched below
          prerequisites: node.prerequisites || [], // Already EDIDs
          nextBranches: [], // Calculated dynamically in tree view
          levelRequirement: undefined, // Not in current data
          lore: undefined, // Not in current data
          globalFormId: node.globalFormId,
        })
      )

      // Add tags based on content analysis
      this.enrichNodesWithTags(transformedNodes)

      this.nodes = transformedNodes
      this.loaded = true
      return this.nodes
    } catch (err) {
      this.error = 'Failed to load destiny data'
      console.error('Error loading destiny data:', err)
      throw new Error(this.error)
    } finally {
      this.loading = false
    }
  }

  /**
   * Get cached nodes (returns empty array if not loaded)
   */
  getNodes(): DestinyNode[] {
    return this.nodes
  }

  /**
   * Check if data is currently loading
   */
  isLoading(): boolean {
    return this.loading
  }

  /**
   * Get current error state
   */
  getError(): string | null {
    return this.error
  }

  /**
   * Check if data has been loaded
   */
  isLoaded(): boolean {
    return this.loaded
  }

  /**
   * Retry loading data
   */
  async retry(): Promise<DestinyNode[]> {
    this.loaded = false
    this.nodes = []
    return this.loadNodes()
  }

  /**
   * Clear cached data
   */
  clear(): void {
    this.nodes = []
    this.loaded = false
    this.error = null
  }

  /**
   * Enrich nodes with tags based on content analysis
   */
  private enrichNodesWithTags(nodes: DestinyNode[]): void {
    nodes.forEach(node => {
      const tags: string[] = []
      const description = node.description.toLowerCase()

      if (description.includes('magicka')) tags.push('Magic')
      if (description.includes('health')) tags.push('Defensive')
      if (description.includes('stamina')) tags.push('Utility')
      if (description.includes('damage')) tags.push('Offensive')
      if (description.includes('armor')) tags.push('Defensive')
      if (description.includes('spell')) tags.push('Magic')
      if (description.includes('weapon')) tags.push('Combat')

      node.tags = tags
    })
  }
}
