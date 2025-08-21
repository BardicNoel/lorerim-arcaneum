import { useBlessings } from '@/shared/stores'

export function useBlessingData() {
  const { data: blessings, loading, error } = useBlessings()

  return {
    blessings: blessings || [], // Convert null/undefined to empty array for consistency
    loading,
    error,
  }
}
