import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import type { InventoryDashboard } from '../types'

export const useInventoryDashboard = () => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<InventoryDashboard>({
    queryKey: ['inventory-dashboard', companyCen],
    queryFn:  () => inventoryApi.dashboard.get(companyCen!),
    enabled:  !!companyCen,
  })
}
