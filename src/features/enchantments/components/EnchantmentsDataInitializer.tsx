import { useEffect } from 'react'
import { useEnchantmentsStore } from '../../../shared/stores'

export const EnchantmentsDataInitializer = () => {
  const { loading, error, data } = useEnchantmentsStore()
  const { load } = useEnchantmentsStore()
  
  useEffect(() => {
    if (data.length === 0 && !loading) {
      load()
    }
  }, [data.length, loading, load])
  
  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading enchantments: {error}
      </div>
    )
  }
  
  return null
}
