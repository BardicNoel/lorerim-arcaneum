import { create } from 'zustand'
import type { DestinyNode } from '@/shared/data/schemas'

export interface PathStep {
  id: string
  name: string
  summary: string
  meta: Record<string, any>
  node: DestinyNode
}

interface DestinyStepperStore {
  // State
  steps: PathStep[]
  currentIndex: number
  nextChoices: DestinyNode[]
  
  // Actions
  selectChoice: (choiceId: string) => void
  jumpTo: (index: number) => void
  clear: () => void
  setNextChoices: (choices: DestinyNode[]) => void
  hydrateFromQuery: (query: string) => void
  toQuery: () => string
}

export const useDestinyStepperStore = create<DestinyStepperStore>((set, get) => ({
  // Initial state
  steps: [],
  currentIndex: -1,
  nextChoices: [],
  
  // Actions
  selectChoice: (choiceId: string) => {
    const { steps, currentIndex, nextChoices } = get()
    
    // Find the selected choice
    const selectedChoice = nextChoices.find(choice => choice.edid === choiceId)
    if (!selectedChoice) return
    
    // Create path step from the choice
    const newStep: PathStep = {
      id: selectedChoice.edid,
      name: selectedChoice.name,
      summary: selectedChoice.description || '',
      meta: {
        tags: selectedChoice.tags || [],
        levelRequirement: selectedChoice.levelRequirement,
        lore: selectedChoice.lore,
      },
      node: selectedChoice,
    }
    
    // Update state
    set(state => {
      const newSteps = [...state.steps]
      const insertIndex = state.currentIndex + 1
      
      // Replace or append at the insert index
      if (insertIndex < newSteps.length) {
        newSteps.splice(insertIndex, newSteps.length - insertIndex)
      }
      newSteps.push(newStep)
      
      return {
        steps: newSteps,
        currentIndex: insertIndex,
        nextChoices: [], // Will be computed by external logic
      }
    })
  },
  
  jumpTo: (index: number) => {
    const { steps } = get()
    if (index < 0 || index >= steps.length) return
    
    set(state => ({
      currentIndex: index,
      steps: state.steps.slice(0, index + 1), // Truncate after the jump point
      nextChoices: [], // Will be computed by external logic
    }))
  },
  
  clear: () => {
    set({
      steps: [],
      currentIndex: -1,
      nextChoices: [],
    })
  },
  
  setNextChoices: (choices: DestinyNode[]) => {
    set({ nextChoices: choices })
  },
  
  hydrateFromQuery: (query: string) => {
    try {
      // Simple base64 decode for now - can be enhanced
      const decoded = atob(query)
      const data = JSON.parse(decoded)
      
      if (data.steps && Array.isArray(data.steps)) {
        set({
          steps: data.steps,
          currentIndex: data.currentIndex || data.steps.length - 1,
          nextChoices: data.nextChoices || [],
        })
      }
    } catch (error) {
      console.warn('Failed to hydrate from query:', error)
    }
  },
  
  toQuery: () => {
    const { steps, currentIndex, nextChoices } = get()
    const data = {
      steps,
      currentIndex,
      nextChoices: nextChoices.map(node => node.edid), // Only store IDs
    }
    
    try {
      return btoa(JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to serialize to query:', error)
      return ''
    }
  },
}))
