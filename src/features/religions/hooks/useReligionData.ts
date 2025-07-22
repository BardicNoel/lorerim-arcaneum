import { useEffect, useState } from 'react'
import type { Religion, ReligionPantheon } from '../types'

export function useReligionData() {
  const [religions, setReligions] = useState<Religion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReligions() {
      try {
        setLoading(true)
        const res = await fetch(
          `${import.meta.env.BASE_URL}data/wintersun-religion-docs.json`
        )
        if (!res.ok) throw new Error('Failed to fetch religion data')
        const data = await res.json()
        
        // Flatten the pantheon structure to get all religions
        const allReligions: Religion[] = data.flatMap(
          (pantheon: ReligionPantheon) =>
            pantheon.deities.map(deity => ({
              ...deity,
              pantheon: pantheon.type, // Add pantheon info to each religion
            }))
        )
        setReligions(allReligions)
      } catch (err) {
        setError('Failed to load religion data')
        console.error('Error loading religions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReligions()
  }, [])

  return {
    religions,
    loading,
    error,
  }
} 