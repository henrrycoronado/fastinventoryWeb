import { useQuery } from '@tanstack/react-query'
import { useAppStore } from '../../../core/store/useAppStore'
import { salesApi } from '../hooks'
import type { DailySalesDashboard, KdsStatusDashboard } from '../types'

export const useDailySales = (params?: { warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<DailySalesDashboard>({
    queryKey: ['daily-sales', companyCen, params],
    queryFn:  () => salesApi.dashboard.dailySales(companyCen!, params),
    enabled:  !!companyCen,
  })
}

export const useKdsStatus = (params?: { warehouseCen?: string }) => {
  const companyCen = useAppStore(s => s.selectedCompany?.companyCen)
  return useQuery<KdsStatusDashboard>({
    queryKey: ['kds-status', companyCen, params],
    queryFn:  () => salesApi.dashboard.kdsStatus(companyCen!, params),
    enabled:  !!companyCen,
  })
}
