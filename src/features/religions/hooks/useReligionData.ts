import { useReligions } from '@/shared/data/useDataCache'

export function useReligionData() {
  // Use the data cache hook
  const { data: religions, loading, error } = useReligions()

  return {
    religions: religions || [],
    loading,
    error,
  }
}
