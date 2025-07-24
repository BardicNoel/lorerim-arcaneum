// Export specialized adapters for different view types
export { useSkillsQuickSelector } from './useSkillsQuickSelector'
export { useSkillsReference } from './useSkillsReference'
export { useSkillsDetail } from './useSkillsDetail'
export { useSkillsPage } from './useSkillsPage'

// Export base adapters
export { usePerkData } from './usePerkData'
export { useSkillComputed } from './useSkillComputed'
export { useSkillData } from './useSkillData'
export { useSkillFilters } from './useSkillFilters'

// Export types for external use
export type { UnifiedSkill } from '../types'
export type { QuickSelectorSkill } from './useSkillsQuickSelector'
export type { ReferenceSkill } from './useSkillsReference'
export type { DetailSkill } from './useSkillsDetail'
export type { SkillsPageSkill, SkillSummary } from './useSkillsPage'
