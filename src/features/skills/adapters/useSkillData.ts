import { useState, useEffect } from 'react'
import { UnifiedAdapter, type UnifiedSkill } from './unifiedAdapter'

// Adapter for skill data loading and caching
export function useSkillData() {
  const [skills, setSkills] = useState<UnifiedSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adapter, setAdapter] = useState<UnifiedAdapter | null>(null)
  
  useEffect(() => {
    const loadSkills = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const newAdapter = new UnifiedAdapter()
        await newAdapter.initialize()
        setAdapter(newAdapter)
        
        const buildState = newAdapter.getBuildState()
        setSkills(buildState.skills)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills')
      } finally {
        setLoading(false)
      }
    }
    
    loadSkills()
  }, [])
  
  const refreshSkills = async () => {
    if (!adapter) return
    
    try {
      setLoading(true)
      const buildState = adapter.getBuildState()
      setSkills(buildState.skills)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh skills')
    } finally {
      setLoading(false)
    }
  }
  
  return { 
    skills, 
    loading, 
    error, 
    adapter,
    refreshSkills 
  }
} 