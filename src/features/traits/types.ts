export interface TraitEffect {
  type: string
  value: number
  condition?: string
  duration: number
  flags: string[]
}

export interface TraitSpell {
  cost: number
  type: string
  castType: string
  delivery: string
}

export interface Trait {
  name: string
  description: string
  edid: string
  formId: string
  spell: TraitSpell
  effects: TraitEffect[]
  category: string
  tags: string[]
  diagram: string
}

export interface TraitFilters {
  search: string
  category: string
  tags: string[]
}
