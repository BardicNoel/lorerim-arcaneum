import { useState, useCallback } from 'react'
import type { UnifiedAdapter } from './unifiedAdapter'

// Adapter for skill state management
export function useSkillState(adapter: UnifiedAdapter | null) {
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null)
  
  const assignSkill = useCallback((skillId: string, type: 'major' | 'minor') => {
    if (!adapter) return { valid: false, reason: 'Adapter not initialized' }
    
    const result = adapter.assignSkill(skillId, type)
    return result
  }, [adapter])
  
  const unassignSkill = useCallback((skillId: string) => {
    if (!adapter) return
    
    adapter.unassignSkill(skillId)
  }, [adapter])
  
  const selectSkill = useCallback((skillId: string | null) => {
    if (!adapter) return
    
    setSelectedSkillId(skillId)
    if (skillId) {
      adapter.setSelectedSkill(skillId)
    }
  }, [adapter])
  
  const getSelectedSkill = useCallback(() => {
    if (!adapter) return null
    return adapter.getSelectedSkill()
  }, [adapter])
  
  const getMajorSkills = useCallback(() => {
    if (!adapter) return []
    return adapter.getSkillsByAssignment('major')
  }, [adapter])
  
  const getMinorSkills = useCallback(() => {
    if (!adapter) return []
    return adapter.getSkillsByAssignment('minor')
  }, [adapter])
  
  return {
    selectedSkillId,
    setSelectedSkillId: selectSkill,
    assignSkill,
    unassignSkill,
    getSelectedSkill,
    getMajorSkills,
    getMinorSkills,
  }
} 