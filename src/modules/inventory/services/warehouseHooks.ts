import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import type { Warehouse } from '../types'

export const useWarehouses = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<Warehouse[]>({
    queryKey: ['warehouses', companyCen],
    queryFn:  () => inventoryApi.warehouses.list(companyCen!),
    enabled:  !!companyCen,
  })
}
