import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import type { StockItem } from '../types'

export const useStock = (params?: { productCen?: string; warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const warehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery<StockItem[]>({
    queryKey: ['stock', companyCen, warehouseCen, params],
    queryFn:  () => inventoryApi.stock.list(companyCen!, { warehouseCen, ...params }),
    enabled:  !!companyCen,
  })
}
