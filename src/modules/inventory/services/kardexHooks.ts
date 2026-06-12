import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { inventoryApi } from '../hooks'
import type { KardexMovement } from '../types'

export const useKardex = (productCen: string | undefined, params?: { warehouseCen?: string; from?: string; to?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  const selectedWarehouseCen = useAppStore(s => s.selectedWarehouse?.warehouseCen)
  return useQuery<KardexMovement[]>({
    queryKey: ['kardex', companyCen, productCen, selectedWarehouseCen, params],
    queryFn:  () => inventoryApi.kardex.get(companyCen!, productCen!, { warehouseCen: selectedWarehouseCen, ...params }),
    enabled:  !!companyCen && !!productCen,
  })
}