import { useBirthsignsStore } from '@/shared/stores/birthsignsStore'

export function useBirthsignData() {
  const { data: birthsigns, loading, error, load } = useBirthsignsStore()

  return {
    birthsigns,
    loading,
    error,
    refetch: load,
  }
}
