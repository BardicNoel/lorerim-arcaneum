import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import {
  type Skill,
  type Race,
  type Trait,
  type Religion,
  type Birthsign,
  type DestinyNode,
  type PerkTree,
  type SearchResult,
  safeValidateSkillsData,
  safeValidateRacesData,
  safeValidateTraitsData,
  safeValidateReligionsData,
  safeValidateBirthsignsData,
  safeValidateDestinyNodesData,
  safeValidatePerkTreesData,
} from './schemas'

// Data store state
interface DataState {
  // Raw data
  skills: Skill[]
  races: Race[]
  traits: Trait[]
  religions: Religion[]
  birthsigns: Birthsign[]
  destinyNodes: DestinyNode[]
  perkTrees: PerkTree[]
  
  // Loading states
  loading: {
    skills: boolean
    races: boolean
    traits: boolean
    religions: boolean
    birthsigns: boolean
    destinyNodes: boolean
    perkTrees: boolean
  }
  
  // Error states
  errors: {
    skills: string | null
    races: string | null
    traits: string | null
    religions: string | null
    birthsigns: string | null
    destinyNodes: string | null
    perkTrees: string | null
  }
  
  // Cache metadata
  cache: {
    lastUpdated: {
      skills: number | null
      races: number | null
      traits: number | null
      religions: number | null
      birthsigns: number | null
      destinyNodes: number | null
      perkTrees: number | null
    }
    cacheExpiry: number // 5 minutes in milliseconds
  }
  
  // Actions
  setSkills: (skills: Skill[]) => void
  setRaces: (races: Race[]) => void
  setTraits: (traits: Trait[]) => void
  setReligions: (religions: Religion[]) => void
  setBirthsigns: (birthsigns: Birthsign[]) => void
  setDestinyNodes: (nodes: DestinyNode[]) => void
  setPerkTrees: (trees: PerkTree[]) => void
  
  setLoading: (key: keyof DataState['loading'], loading: boolean) => void
  setError: (key: keyof DataState['errors'], error: string | null) => void
  
  // Data loading actions
  loadSkills: () => Promise<void>
  loadRaces: () => Promise<void>
  loadTraits: () => Promise<void>
  loadReligions: () => Promise<void>
  loadBirthsigns: () => Promise<void>
  loadDestinyNodes: () => Promise<void>
  loadPerkTrees: () => Promise<void>
  
  // Bulk loading
  loadAllData: () => Promise<void>
  
  // Cache management
  isCacheValid: (key: keyof DataState['cache']['lastUpdated']) => boolean
  clearCache: () => void
  
  // Search functionality
  searchAll: (query: string) => SearchResult[]
}

// Create the data store
export const useDataStore = create<DataState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    skills: [],
    races: [],
    traits: [],
    religions: [],
    birthsigns: [],
    destinyNodes: [],
    perkTrees: [],
    
    loading: {
      skills: false,
      races: false,
      traits: false,
      religions: false,
      birthsigns: false,
      destinyNodes: false,
      perkTrees: false,
    },
    
    errors: {
      skills: null,
      races: null,
      traits: null,
      religions: null,
      birthsigns: null,
      destinyNodes: null,
      perkTrees: null,
    },
    
    cache: {
      lastUpdated: {
        skills: null,
        races: null,
        traits: null,
        religions: null,
        birthsigns: null,
        destinyNodes: null,
        perkTrees: null,
      },
      cacheExpiry: 5 * 60 * 1000, // 5 minutes
    },
    
    // Setters
    setSkills: (skills) => set({ skills }),
    setRaces: (races) => set({ races }),
    setTraits: (traits) => set({ traits }),
    setReligions: (religions) => set({ religions }),
    setBirthsigns: (birthsigns) => set({ birthsigns }),
    setDestinyNodes: (destinyNodes) => set({ destinyNodes }),
    setPerkTrees: (perkTrees) => set({ perkTrees }),
    
    setLoading: (key, loading) => 
      set((state) => ({
        loading: { ...state.loading, [key]: loading }
      })),
    
    setError: (key, error) => 
      set((state) => ({
        errors: { ...state.errors, [key]: error }
      })),
    
    // Data loading actions
    loadSkills: async () => {
      const state = get()
      if (!state.isCacheValid('skills')) {
        state.setLoading('skills', true)
        state.setError('skills', null)
        
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}data/skills.json`)
          if (!response.ok) throw new Error('Failed to fetch skills data')
          
          const rawData = await response.json()
          const validatedData = safeValidateSkillsData(rawData)
          
          if (!validatedData) {
            throw new Error('Invalid skills data format')
          }
          
          const skills = validatedData.skills.map(skill => ({
            ...skill,
            tags: [...(skill.metaTags || []), skill.category].filter(Boolean),
          }))
          
          state.setSkills(skills)
          set((state) => ({
            cache: {
              ...state.cache,
              lastUpdated: { ...state.cache.lastUpdated, skills: Date.now() }
            }
          }))
        } catch (error) {
          state.setError('skills', error instanceof Error ? error.message : 'Failed to load skills')
        } finally {
          state.setLoading('skills', false)
        }
      }
    },
    
    loadRaces: async () => {
      const state = get()
      if (!state.isCacheValid('races')) {
        state.setLoading('races', true)
        state.setError('races', null)
        
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}data/playable-races.json`)
          if (!response.ok) throw new Error('Failed to fetch races data')
          
          const rawData = await response.json()
          const validatedData = safeValidateRacesData(rawData)
          
          if (!validatedData) {
            throw new Error('Invalid races data format')
          }
          
          const races = validatedData.races.map(race => ({
            ...race,
            tags: [race.category, ...(race.keywords || [])].filter(Boolean),
          }))
          
          state.setRaces(races)
          set((state) => ({
            cache: {
              ...state.cache,
              lastUpdated: { ...state.cache.lastUpdated, races: Date.now() }
            }
          }))
        } catch (error) {
          state.setError('races', error instanceof Error ? error.message : 'Failed to load races')
        } finally {
          state.setLoading('races', false)
        }
      }
    },
    
    loadTraits: async () => {
      const state = get()
      if (!state.isCacheValid('traits')) {
        state.setLoading('traits', true)
        state.setError('traits', null)
        
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}data/traits.json`)
          if (!response.ok) throw new Error('Failed to fetch traits data')
          
          const rawData = await response.json()
          const validatedData = safeValidateTraitsData(rawData)
          
          if (!validatedData) {
            throw new Error('Invalid traits data format')
          }
          
          const traits = validatedData.traits.map(trait => ({
            ...trait,
            id: trait.id || trait.name,
            tags: [trait.category, ...(trait.tags || []), ...(trait.effects?.map(e => e.type) || [])].filter(Boolean),
          }))
          
          state.setTraits(traits)
          set((state) => ({
            cache: {
              ...state.cache,
              lastUpdated: { ...state.cache.lastUpdated, traits: Date.now() }
            }
          }))
        } catch (error) {
          state.setError('traits', error instanceof Error ? error.message : 'Failed to load traits')
        } finally {
          state.setLoading('traits', false)
        }
      }
    },
    
    loadReligions: async () => {
      const state = get()
      if (!state.isCacheValid('religions')) {
        state.setLoading('religions', true)
        state.setError('religions', null)
        
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}data/wintersun-religion-docs.json`)
          if (!response.ok) throw new Error('Failed to fetch religions data')
          
          const rawData = await response.json()
          const validatedData = safeValidateReligionsData(rawData)
          
          if (!validatedData) {
            throw new Error('Invalid religions data format')
          }
          
          const religions = validatedData.flatMap(pantheon =>
            pantheon.deities.map(deity => ({
              id: deity.id || deity.name,
              name: deity.name,
              description: deity.description,
              pantheon: pantheon.type,
              tenets: deity.tenets || [],
              powers: deity.powers || [],
              restrictions: deity.restrictions || [],
              favoredRaces: deity.favoredRaces || [],
              tags: [pantheon.type, ...(deity.tags || [])].filter(Boolean),
            }))
          )
          
          state.setReligions(religions)
          set((state) => ({
            cache: {
              ...state.cache,
              lastUpdated: { ...state.cache.lastUpdated, religions: Date.now() }
            }
          }))
        } catch (error) {
          state.setError('religions', error instanceof Error ? error.message : 'Failed to load religions')
        } finally {
          state.setLoading('religions', false)
        }
      }
    },
    
    loadBirthsigns: async () => {
      const state = get()
      if (!state.isCacheValid('birthsigns')) {
        state.setLoading('birthsigns', true)
        state.setError('birthsigns', null)
        
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}data/birthsigns.json`)
          if (!response.ok) throw new Error('Failed to fetch birthsigns data')
          
          const rawData = await response.json()
          const validatedData = safeValidateBirthsignsData(rawData)
          
          if (!validatedData) {
            throw new Error('Invalid birthsigns data format')
          }
          
          const birthsigns = validatedData.birthsigns.map(birthsign => ({
            ...birthsign,
            tags: [birthsign.category, ...(birthsign.tags || [])].filter(Boolean),
          }))
          
          state.setBirthsigns(birthsigns)
          set((state) => ({
            cache: {
              ...state.cache,
              lastUpdated: { ...state.cache.lastUpdated, birthsigns: Date.now() }
            }
          }))
        } catch (error) {
          state.setError('birthsigns', error instanceof Error ? error.message : 'Failed to load birthsigns')
        } finally {
          state.setLoading('birthsigns', false)
        }
      }
    },
    
    loadDestinyNodes: async () => {
      const state = get()
      if (!state.isCacheValid('destinyNodes')) {
        state.setLoading('destinyNodes', true)
        state.setError('destinyNodes', null)
        
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}data/subclasses.json`)
          if (!response.ok) throw new Error('Failed to fetch destiny nodes data')
          
          const rawData = await response.json()
          const validatedData = safeValidateDestinyNodesData(rawData)
          
          if (!validatedData) {
            throw new Error('Invalid destiny nodes data format')
          }
          
          const destinyNodes = validatedData.map((node, index) => ({
            ...node,
            id: node.globalFormId || node.edid || `destiny-${index}`,
            nextBranches: node.nextBranches || [],
            levelRequirement: node.levelRequirement,
            lore: node.lore,
            tags: node.tags || [], // Will be enriched by the destiny feature
          }))
          
          state.setDestinyNodes(destinyNodes)
          set((state) => ({
            cache: {
              ...state.cache,
              lastUpdated: { ...state.cache.lastUpdated, destinyNodes: Date.now() }
            }
          }))
        } catch (error) {
          state.setError('destinyNodes', error instanceof Error ? error.message : 'Failed to load destiny nodes')
        } finally {
          state.setLoading('destinyNodes', false)
        }
      }
    },
    
    loadPerkTrees: async () => {
      const state = get()
      if (!state.isCacheValid('perkTrees')) {
        state.setLoading('perkTrees', true)
        state.setError('perkTrees', null)
        
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}data/perk-trees.json`)
          if (!response.ok) throw new Error('Failed to fetch perk trees data')
          
          const rawData = await response.json()
          const validatedData = safeValidatePerkTreesData(rawData)
          
          if (!validatedData) {
            throw new Error('Invalid perk trees data format')
          }
          
          state.setPerkTrees(validatedData)
          set((state) => ({
            cache: {
              ...state.cache,
              lastUpdated: { ...state.cache.lastUpdated, perkTrees: Date.now() }
            }
          }))
        } catch (error) {
          state.setError('perkTrees', error instanceof Error ? error.message : 'Failed to load perk trees')
        } finally {
          state.setLoading('perkTrees', false)
        }
      }
    },
    
    loadAllData: async () => {
      const state = get()
      await Promise.all([
        state.loadSkills(),
        state.loadRaces(),
        state.loadTraits(),
        state.loadReligions(),
        state.loadBirthsigns(),
        state.loadDestinyNodes(),
        state.loadPerkTrees(),
      ])
    },
    
    // Cache management
    isCacheValid: (key) => {
      const state = get()
      const lastUpdated = state.cache.lastUpdated[key]
      if (!lastUpdated) return false
      return Date.now() - lastUpdated < state.cache.cacheExpiry
    },
    
    clearCache: () => set((state) => ({
      cache: {
        ...state.cache,
        lastUpdated: {
          skills: null,
          races: null,
          traits: null,
          religions: null,
          birthsigns: null,
          destinyNodes: null,
          perkTrees: null,
        }
      }
    })),
    
    // Search functionality
    searchAll: (query) => {
      const state = get()
      if (!query.trim()) return []
      
      const searchTerm = query.toLowerCase()
      const results: SearchResult[] = []
      
      // Search skills
      state.skills.forEach(skill => {
        const searchableText = [
          skill.name,
          skill.description,
          skill.category,
          ...(skill.tags || []),
          ...(skill.keyAbilities || []),
        ].join(' ').toLowerCase()
        
        if (searchableText.includes(searchTerm)) {
          const score = calculateSearchScore(searchableText, searchTerm)
          results.push({
            type: 'skill',
            id: skill.id,
            name: skill.name,
            description: skill.description,
            category: skill.category,
            tags: skill.tags,
            score,
            highlights: generateHighlights(skill, searchTerm),
          })
        }
      })
      
      // Search races
      state.races.forEach(race => {
        const searchableText = [
          race.name,
          race.description,
          race.category,
          ...(race.tags || []),
          ...(race.keywords || []),
        ].join(' ').toLowerCase()
        
        if (searchableText.includes(searchTerm)) {
          const score = calculateSearchScore(searchableText, searchTerm)
          results.push({
            type: 'race',
            id: race.id,
            name: race.name,
            description: race.description,
            category: race.category,
            tags: race.tags,
            score,
            highlights: generateHighlights(race, searchTerm),
          })
        }
      })
      
      // Search traits
      state.traits.forEach(trait => {
        const searchableText = [
          trait.name,
          trait.description,
          trait.category,
          ...(trait.tags || []),
          ...(trait.effects?.map(e => e.type) || []),
        ].join(' ').toLowerCase()
        
        if (searchableText.includes(searchTerm)) {
          const score = calculateSearchScore(searchableText, searchTerm)
          results.push({
            type: 'trait',
            id: trait.id,
            name: trait.name,
            description: trait.description,
            category: trait.category,
            tags: trait.tags,
            score,
            highlights: generateHighlights(trait, searchTerm),
          })
        }
      })
      
      // Search religions
      state.religions.forEach(religion => {
        const searchableText = [
          religion.name,
          religion.description,
          religion.pantheon,
          ...(religion.tags || []),
          ...(religion.tenets || []),
          ...(religion.powers || []),
        ].join(' ').toLowerCase()
        
        if (searchableText.includes(searchTerm)) {
          const score = calculateSearchScore(searchableText, searchTerm)
          results.push({
            type: 'religion',
            id: religion.id,
            name: religion.name,
            description: religion.description,
            category: religion.pantheon,
            tags: religion.tags,
            score,
            highlights: generateHighlights(religion, searchTerm),
          })
        }
      })
      
      // Search birthsigns
      state.birthsigns.forEach(birthsign => {
        const searchableText = [
          birthsign.name,
          birthsign.description,
          birthsign.category,
          ...(birthsign.tags || []),
          ...(birthsign.powers || []),
          ...(birthsign.effects || []),
        ].join(' ').toLowerCase()
        
        if (searchableText.includes(searchTerm)) {
          const score = calculateSearchScore(searchableText, searchTerm)
          results.push({
            type: 'birthsign',
            id: birthsign.id,
            name: birthsign.name,
            description: birthsign.description,
            category: birthsign.category,
            tags: birthsign.tags,
            score,
            highlights: generateHighlights(birthsign, searchTerm),
          })
        }
      })
      
      // Search destiny nodes
      state.destinyNodes.forEach(node => {
        const searchableText = [
          node.name,
          node.description,
          ...(node.tags || []),
        ].join(' ').toLowerCase()
        
        if (searchableText.includes(searchTerm)) {
          const score = calculateSearchScore(searchableText, searchTerm)
          results.push({
            type: 'destiny',
            id: node.id,
            name: node.name,
            description: node.description,
            tags: node.tags,
            score,
            highlights: generateHighlights(node, searchTerm),
          })
        }
      })
      
      // Sort by relevance score
      return results.sort((a, b) => b.score - a.score)
    },
  }))
)

// Helper functions for search
function calculateSearchScore(text: string, query: string): number {
  const queryWords = query.split(' ').filter(Boolean)
  let score = 0
  
  queryWords.forEach(word => {
    if (text.includes(word)) {
      score += 1
      // Bonus for exact matches
      if (text.includes(` ${word} `) || text.startsWith(word) || text.endsWith(word)) {
        score += 0.5
      }
    }
  })
  
  return score
}

function generateHighlights(entity: any, query: string): SearchResult['highlights'] {
  const highlights: SearchResult['highlights'] = []
  const searchTerm = query.toLowerCase()
  
  // Highlight name matches
  if (entity.name.toLowerCase().includes(searchTerm)) {
    highlights.push({
      field: 'name',
      snippet: entity.name,
    })
  }
  
  // Highlight description matches
  if (entity.description?.toLowerCase().includes(searchTerm)) {
    const desc = entity.description
    const index = desc.toLowerCase().indexOf(searchTerm)
    const start = Math.max(0, index - 50)
    const end = Math.min(desc.length, index + searchTerm.length + 50)
    highlights.push({
      field: 'description',
      snippet: `${start > 0 ? '...' : ''}${desc.slice(start, end)}${end < desc.length ? '...' : ''}`,
    })
  }
  
  return highlights
}

// Export convenience hooks
export const useSkills = () => useDataStore((state) => ({
  skills: state.skills,
  loading: state.loading.skills,
  error: state.errors.skills,
  loadSkills: state.loadSkills,
}))

export const useRaces = () => useDataStore((state) => ({
  races: state.races,
  loading: state.loading.races,
  error: state.errors.races,
  loadRaces: state.loadRaces,
}))

export const useTraits = () => useDataStore((state) => ({
  traits: state.traits,
  loading: state.loading.traits,
  error: state.errors.traits,
  loadTraits: state.loadTraits,
}))

export const useReligions = () => useDataStore((state) => ({
  religions: state.religions,
  loading: state.loading.religions,
  error: state.errors.religions,
  loadReligions: state.loadReligions,
}))

export const useBirthsigns = () => useDataStore((state) => ({
  birthsigns: state.birthsigns,
  loading: state.loading.birthsigns,
  error: state.errors.birthsigns,
  loadBirthsigns: state.loadBirthsigns,
}))

export const useDestinyNodes = () => useDataStore((state) => ({
  destinyNodes: state.destinyNodes,
  loading: state.loading.destinyNodes,
  error: state.errors.destinyNodes,
  loadDestinyNodes: state.loadDestinyNodes,
}))

export const usePerkTrees = () => useDataStore((state) => ({
  perkTrees: state.perkTrees,
  loading: state.loading.perkTrees,
  error: state.errors.perkTrees,
  loadPerkTrees: state.loadPerkTrees,
}))

export const useGlobalSearch = () => useDataStore((state) => ({
  searchAll: state.searchAll,
}))

export const useDataCache = () => useDataStore((state) => ({
  isCacheValid: state.isCacheValid,
  clearCache: state.clearCache,
  loadAllData: state.loadAllData,
})) 