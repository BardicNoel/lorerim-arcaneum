import { useReligions } from '@/shared/stores'

export function useReligionData() {
  // Use the data cache hook
  const { data: religions, loading, error } = useReligions()

  return {
    religions: religions || [], // Convert null/undefined to empty array for consistency
    loading,
    error,
  }
}
