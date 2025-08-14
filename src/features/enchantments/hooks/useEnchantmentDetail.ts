import { useEnchantmentsStore } from '@/shared/stores'
import { useCallback } from 'react'

export const useEnchantmentDetail = () => {
  const { selectedEnchantment, selectEnchantment, clearSelection } = useEnchantmentsStore()
  
  const openDetail = useCallback((enchantmentId: string) => {
    selectEnchantment(enchantmentId)
  }, [selectEnchantment])
  
  const closeDetail = useCallback(() => {
    clearSelection()
  }, [clearSelection])
  
  return {
    selectedEnchantment,
    openDetail,
    closeDetail,
    isOpen: !!selectedEnchantment
  }
}

