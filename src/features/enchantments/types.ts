// Core enchantment data structure based on enchantment-primer.json
export interface EnchantmentEffect {
  name: string
  description: string
}

export interface FoundItem {
  name: string
  type: 'weapon' | 'armor'
  globalFormId: string
}

export interface Enchantment {
  name: string
  baseEnchantmentId: string
  enchantmentType: string
  targetType: 'touch' | 'self'
  effects: EnchantmentEffect[]
  wornRestrictions: string[]
  foundOnItems: FoundItem[]
  globalFormId: string
  plugin: string
  foundOnItemsTrimmed: string
}

export interface EnchantmentCategory {
  name: string
  description: string
  enchantments: Enchantment[]
}

// Raw data structure from JSON
export interface EnchantmentPrimerData {
  categories: EnchantmentCategory[]
}

// Computed enchantment properties for enhanced functionality
export interface EnchantmentWithComputed extends Enchantment {
  // Computed fields
  hasEffects: boolean
  effectCount: number
  isWeaponEnchantment: boolean
  isArmorEnchantment: boolean
  itemCount: number
  tags: string[]
  searchableText: string
  category: string
}

// Filter and search types
export interface EnchantmentFilters {
  categories: string[]
  targetTypes: string[]
  itemTypes: string[]
  plugins: string[]
  searchTerm: string
  hasEffects: boolean | null
  hasWornRestrictions: boolean | null
  minItemCount: number | null
  maxItemCount: number | null
}

export interface EnchantmentSearchResult {
  enchantment: EnchantmentWithComputed
  score: number
  matchedFields: string[]
}

// View state types
export interface EnchantmentViewState {
  viewMode: 'grid' | 'search'
  sortBy: 'name' | 'targetType' | 'wornRestrictions'
  sortOrder: 'asc' | 'desc'
  selectedEnchantment: string | null
  expandedEnchantments: string[]
}

// API response types
export interface EnchantmentDataResponse {
  categories: EnchantmentCategory[]
  enchantments: Enchantment[]
  totalCount: number
  categoryNames: string[]
  targetTypes: string[]
  plugins: string[]
  lastUpdated: string
}

export interface EnchantmentError {
  code: string
  message: string
  details?: unknown
}

// Utility types
export type EnchantmentTargetType = 'touch' | 'self'
export type EnchantmentItemType = 'weapon' | 'armor'
export type EnchantmentSortField = 'name' | 'targetType' | 'wornRestrictions'
export type SortOrder = 'asc' | 'desc'

// Constants
export const ENCHANTMENT_TARGET_TYPES: EnchantmentTargetType[] = ['touch', 'self']
export const ENCHANTMENT_ITEM_TYPES: EnchantmentItemType[] = ['weapon', 'armor']
export const ENCHANTMENT_SORT_FIELDS: EnchantmentSortField[] = [
  'name',
  'category', 
  'targetType',
  'plugin',
  'itemCount'
]

// Test data for type validation
export const testEnchantment: Enchantment = {
  name: "Absorb Health",
  baseEnchantmentId: "0x0010FB91",
  enchantmentType: "standard",
  targetType: "touch",
  effects: [
    {
      name: "Absorb Health",
      description: "Absorbs <mag> health, but doesn't affect constructs."
    }
  ],
  wornRestrictions: [],
  foundOnItems: [
    {
      name: "Dark Bow",
      type: "weapon",
      globalFormId: "0x0C00098E"
    }
  ],
  globalFormId: "0x0010FB91",
  plugin: "Requiem - Magic Redone.esp",
  foundOnItemsTrimmed: "Dark Bow, Dark Mace, Dark Sword, (and various others)"
}

export const testEnchantmentWithComputed: EnchantmentWithComputed = {
  ...testEnchantment,
  hasEffects: true,
  effectCount: 1,
  isWeaponEnchantment: true,
  isArmorEnchantment: false,
  itemCount: 1,
  tags: ['absorb', 'health', 'touch', 'weapon'],
  searchableText: 'Absorb Health Absorbs <mag> health, but doesn\'t affect constructs. Dark Bow weapon',
  category: 'Standard Enchantments (Touch)'
}
